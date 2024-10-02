contract;

mod events;
mod interface;
use events::*;
use interface::*;

use std::{
    asset::transfer,
    call_frames::msg_asset_id,
    constants::DEFAULT_SUB_ID,
    context::{
        balance_of,
        msg_amount,
    },
    hash::{
        Hash,
        sha256,
    },
    storage::storage_string::*,
    string::String,
};

use standards::{src20::SRC20, src5::{SRC5, State}, src6::{Deposit, SRC6, Withdraw}};

use oracle_lib::*;
use asset_lib::*;

storage {
    /// Vault share AssetId -> VaultInfo.
    vault_info: StorageMap<AssetId, VaultInfo> = StorageMap {},
    /// Number of different assets managed by this contract.
    total_assets: u64 = 0,
    /// Total supply of shares.
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    /// Asset name.
    name: StorageMap<AssetId, StorageString> = StorageMap {},
    /// Asset symbol.
    symbol: StorageMap<AssetId, StorageString> = StorageMap {},
    /// Asset decimals.
    decimals: StorageMap<AssetId, u8> = StorageMap {},
    /// Vault share AssetId -> VaultInfo.
    collateral_info: StorageMap<AssetId, CollateralInfo> = StorageMap {},
    user_collateral: StorageMap<(Identity, AssetId), u64> = StorageMap {}, // User collateral per asset
    user_debt: StorageMap<(Identity, AssetId), u64> = StorageMap {}, // User debt per asset
}

/// The compv ContractId of this contract at deployment.
#[allow(dead_code)]
const INITIAL_COMPV: ContractId = ContractId::from(0x3ede62568a4600582c79d99abdddab8f625caed77454fc088856ebb086496c03);

configurable {
    /// Oracle contract
    ORACLE_CONTRACT_ID: ContractId = ContractId::from(0x3ede62568a4600582c79d99abdddab8f625caed77454fc088856ebb086496c03),
    COMPV_CONTRACT_ID: ContractId = INITIAL_COMPV,
    TEMPV_CONTRACT_ID: ContractId = ContractId::from(0x3ede62568a4600582c79d99abdddab8f625caed77454fc088856ebb086496c03),
}

impl SRC6VaultConnector for Contract {
    #[storage(read, write)]
    fn configure_compv(contract_id: ContractId) {
        let owner = Identity::ContractId(ContractId::this());

        // External call
        let src_5_abi = abi(SRC5, contract_id.bits());
        require(
            src_5_abi
                .owner() == State::Uninitialized,
            "Already Initialized",
        );
        // let compv_contract_id: b256 = COMPV_CONTRACT_ID.into();

        let compv_contract = abi(Compv, contract_id.bits());

        compv_contract.constructor(owner);
        require(
            src_5_abi
                .owner() == State::Initialized(owner),
            "Owner did not get Initialized",
        );
    }

    #[payable]
    #[storage(read, write)]
    fn deposit_collateral(user: Identity) -> u64 {
        let asset_amount = msg_amount();
        let asset_id = msg_asset_id();

        require(asset_amount != 0, "ZERO_ASSETS");
        // require(underlying_asset == AssetId::base(), "INVALID_ASSET_ID");

        let mut collateral_info = match storage.collateral_info.get(asset_id).try_read() {
            Some(collateral_info) => collateral_info,
            None => CollateralInfo {
                asset: asset_id,
                collateral: 0,
                debt: 0,
                ltv_ratio: 90,
            },
        };
        // storage.collateral_info.get(asset_id).read();
        collateral_info.collateral = collateral_info.collateral + asset_amount;
        storage.collateral_info.insert(asset_id, collateral_info);

        let user_collateral = storage.user_collateral.get((user, asset_id)).try_read().unwrap_or(0) + asset_amount;

        storage
            .user_collateral
            .insert((user, asset_id), user_collateral);

        // Log the deposit for future reference
        log(CollateralDeposited {
            user,
            asset: asset_id,
            amount: asset_amount,
        });

        // collateral_info.collateral
        user_collateral
    }

    #[payable]
    #[storage(read, write)]
    fn borrow_a(user: Identity, borrow_asset_id: AssetId) -> u64 {
        let asset_amount = msg_amount();
        let asset_id = msg_asset_id();

        require(asset_amount != 0, "ZERO_ASSETS");

        let user_collateral = storage.user_collateral.get((user, asset_id)).try_read();
        let collateral = user_collateral.unwrap_or(0);
        let mut collateral_info = storage.collateral_info.get(asset_id).read();
        let user_debt = storage.user_debt.get((user, borrow_asset_id)).try_read().unwrap_or(0) + asset_amount;

        // External call
        // let oracle_contract_id: b256 = ORACLE_CONTRACT_ID.into();
        // let oracle_contract = abi(Oracle, oracle_contract_id);
        // let price_collateral = oracle_contract.get_price_of(asset_id);
        // let price_borrowing = oracle_contract.get_price_of(borrow_asset_id);

        // let max_borrow = (collateral * price_collateral) * collateral_info.ltv_ratio / 100; // Max borrowable based on LTV
        // require((user_debt * price_borrowing) <= max_borrow, "Exceeds borrow limit");
        let max_borrow = collateral * collateral_info.ltv_ratio / 100; // Max borrowable based on LTV
        require(user_debt <= max_borrow, "Exceeds borrow limit");

        // Update the user's debt and the vault's managed assets
        storage.user_debt.insert((user, borrow_asset_id), user_debt);
        collateral_info.debt = collateral_info.debt + asset_amount;
        storage.collateral_info.insert(asset_id, collateral_info);

        // Transfer the borrowed amount to the user
        transfer(user, borrow_asset_id, asset_amount);

        // External call
        let compv_contract_id: b256 = COMPV_CONTRACT_ID.into();
        let compv_contract = abi(Compv, compv_contract_id);
        // let total_supply = compv_contract.total_supply(asset_id);
        // require( total_supply == Some(0), "Total Supply greater than zero");
        compv_contract.mint(user, Some(DEFAULT_SUB_ID), asset_amount);

        log(BorrowedLog {
            user,
            asset: borrow_asset_id,
            amount: asset_amount,
        });

        // 1
        user_debt
    }

    #[payable]
    #[storage(read, write)]
    fn repay(user: Identity) -> u64 {
        let asset_amount = msg_amount();
        let borrow_asset_id = msg_asset_id();

        require(asset_amount != 0, "ZERO_ASSETS");

        let user_debt = storage.user_debt.get((user, borrow_asset_id)).try_read().unwrap_or(0);

        require(user_debt >= asset_amount, "Cannot repay more than borrowed");

        // Update user's debt and the vault's managed assets
        storage
            .user_debt
            .insert((user, borrow_asset_id), user_debt - asset_amount);

        let mut collateral_info = storage.collateral_info.get(borrow_asset_id).read();
        collateral_info.debt = collateral_info.debt - asset_amount;
        storage
            .collateral_info
            .insert(borrow_asset_id, collateral_info);

        // let mut vault_info = storage.vault_info.get(asset_id).unwrap();
        // vault_info.managed_assets -= amount;
        // storage.vault_info.insert(asset, vault_info);

        // Transfer the repaid amount from the user back to the vault
        // transfer_from(user, ContractId::this(), asset_id, asset_amount);

        log(Repayment {
            user,
            asset: borrow_asset_id,
            amount: asset_amount,
            debt: (user_debt - asset_amount),
            balance: balance_of(ContractId::this(), borrow_asset_id),
        });
        (user_debt - asset_amount)
    }

    #[payable]
    #[storage(read, write)]
    fn liquidate(user: Identity, borrowed_asset_id: AssetId) -> u64 {
        // let asset_amount = msg_amount();
        let asset_id = msg_asset_id();

        let collateral = storage.user_collateral.get((user, asset_id)).try_read().unwrap_or(0);
        let user_debt = storage.user_debt.get((user, borrowed_asset_id)).try_read().unwrap_or(0);
        let mut collateral_info = storage.collateral_info.get(asset_id).read();

        // Calculate liquidation threshold (e.g., if debt exceeds 80% of collateral)
        let liquidation_threshold = collateral * 80 / 100;
        require(user_debt > liquidation_threshold, "Cannot liquidate");

        // Seize collateral and reduce debt
        storage.user_collateral.insert((user, asset_id), 0);
        storage.user_debt.insert((user, borrowed_asset_id), 0);

        // Transfer the seized collateral to the liquidator or the vault
        transfer(msg_sender().unwrap(), asset_id, collateral);

        log(Liquidated {
            user,
            asset: asset_id,
            collateral,
            debt: user_debt,
        });

        collateral
    }

    fn get_balance(asset_id: AssetId) -> u64 {
        balance_of(ContractId::this(), asset_id)
    }

    fn preview_share(underlying_asset: AssetId, vault_sub_id: SubId // assets: u64,
) -> (AssetId, SubId) {
        let (share_asset_id, share_asset_vault_sub_id) = vault_asset_id(underlying_asset, vault_sub_id);
        (share_asset_id, share_asset_vault_sub_id)
    }

    #[payable]
    #[storage(read)]
    fn preview_wi(share_asset_id: AssetId) -> u64 {
        let shares = msg_amount();
        require(shares != 0, "ZERO_SHARES");
        let assets = preview_withdraw(share_asset_id, shares);
        assets
    }
}

impl SRC6 for Contract {
    #[payable]
    #[storage(read, write)]
    fn deposit(receiver: Identity, vault_sub_id: SubId) -> u64 {
        let asset_amount = msg_amount();
        let underlying_asset = msg_asset_id();

        require(asset_amount != 0, "ZERO_ASSETS");
        // require(underlying_asset == AssetId::base(), "INVALID_ASSET_ID");
        let (shares, share_asset, share_asset_vault_sub_id) = preview_deposit(underlying_asset, vault_sub_id, asset_amount);

        _mint(receiver, share_asset, share_asset_vault_sub_id, shares);

        let mut vault_info = match storage.vault_info.get(share_asset).try_read() {
            Some(vault_info) => vault_info,
            None => VaultInfo {
                managed_assets: 0,
                vault_sub_id,
                asset: underlying_asset,
            },
        };
        vault_info.managed_assets = vault_info.managed_assets + asset_amount;
        storage.vault_info.insert(share_asset, vault_info);

        log(Deposit {
            caller: msg_sender().unwrap(),
            receiver: receiver,
            underlying_asset,
            vault_sub_id: vault_sub_id,
            deposited_amount: asset_amount,
            minted_shares: shares,
        });

        shares
    }

    #[payable]
    #[storage(read, write)]
    fn withdraw(
        receiver: Identity,
        underlying_asset: AssetId,
        vault_sub_id: SubId,
    ) -> u64 {
        let shares = msg_amount();
        require(shares != 0, "ZERO_SHARES");

        let (share_asset_id, share_asset_vault_sub_id) = vault_asset_id(underlying_asset, vault_sub_id);

        require(msg_asset_id() == share_asset_id, "INVALID_ASSET_ID");
        let assets = preview_withdraw(share_asset_id, shares);

        let mut vault_info = storage.vault_info.get(share_asset_id).read();
        vault_info.managed_assets = vault_info.managed_assets - shares;
        storage.vault_info.insert(share_asset_id, vault_info);

        _burn(share_asset_id, share_asset_vault_sub_id, shares);

        transfer(receiver, underlying_asset, assets);

        log(Withdraw {
            caller: msg_sender().unwrap(),
            receiver: receiver,
            underlying_asset,
            vault_sub_id: vault_sub_id,
            withdrawn_amount: assets,
            burned_shares: shares,
        });

        assets
    }

    #[storage(read)]
    fn managed_assets(underlying_asset: AssetId, vault_sub_id: SubId) -> u64 {
        let vault_share_asset = vault_asset_id(underlying_asset, vault_sub_id).0;
        // In this implementation managed_assets and max_withdrawable are the same. However in case of lending out of assets, managed_assets should be greater than max_withdrawable.
        managed_assets(vault_share_asset)
    }

    #[storage(read)]
    fn max_depositable(
        receiver: Identity,
        underlying_asset: AssetId,
        vault_sub_id: SubId,
    ) -> Option<u64> {
        let vault_share_asset = vault_asset_id(underlying_asset, vault_sub_id).0;
        match storage.vault_info.get(vault_share_asset).try_read() {
            // This is the max value of u64 minus the current managed_assets. Ensures that the sum will always be lower than u64::MAX.
            Some(vault_info) => Some(u64::max() - vault_info.managed_assets),
            None => None,
        }
    }

    #[storage(read)]
    fn max_withdrawable(underlying_asset: AssetId, vault_sub_id: SubId) -> Option<u64> {
        let vault_share_asset = vault_asset_id(underlying_asset, vault_sub_id).0;
        // In this implementation managed_assets and max_withdrawable are the same. However in case of lending out of assets, total_assets should be greater than max_withdrawable.
        match storage.vault_info.get(vault_share_asset).try_read() {
            Some(vault_info) => Some(vault_info.managed_assets),
            None => None,
        }
    }
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        storage.total_assets.try_read().unwrap_or(0)
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        storage.total_supply.get(asset).try_read()
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        storage.name.get(asset).read_slice()
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        storage.symbol.get(asset).read_slice()
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        storage.decimals.get(asset).try_read()
    }
}

/// Returns the vault shares assetid and subid for the given assets assetid and the vaults sub id
fn vault_asset_id(underlying_asset: AssetId, vault_sub_id: SubId) -> (AssetId, SubId) {
    let share_asset_vault_sub_id = sha256((underlying_asset, vault_sub_id));
    let share_asset_id = AssetId::new(ContractId::this(), share_asset_vault_sub_id);
    (share_asset_id, share_asset_vault_sub_id)
}

#[storage(read)]
fn managed_assets(share_asset: AssetId) -> u64 {
    match storage.vault_info.get(share_asset).try_read() {
        Some(vault_info) => vault_info.managed_assets,
        None => 0,
    }
}

#[storage(read)]
fn preview_deposit(
    underlying_asset: AssetId,
    vault_sub_id: SubId,
    assets: u64,
) -> (u64, AssetId, SubId) {
    let (share_asset_id, share_asset_vault_sub_id) = vault_asset_id(underlying_asset, vault_sub_id);

    let shares_supply = storage.total_supply.get(share_asset_id).try_read().unwrap_or(0);
    if shares_supply == 0 {
        (assets, share_asset_id, share_asset_vault_sub_id)
    } else {
        (
            assets * shares_supply / managed_assets(share_asset_id),
            share_asset_id,
            share_asset_vault_sub_id,
        )
    }
}

#[storage(read)]
fn preview_withdraw(share_asset_id: AssetId, shares: u64) -> u64 {
    let supply = storage.total_supply.get(share_asset_id).read();
    if supply == shares {
        managed_assets(share_asset_id)
    } else {
        shares * (managed_assets(share_asset_id) / supply)
    }
}

#[storage(read, write)]
pub fn _mint(
    recipient: Identity,
    asset_id: AssetId,
    vault_sub_id: SubId,
    amount: u64,
) {
    use std::asset::mint_to;

    let supply = storage.total_supply.get(asset_id).try_read();
    // Only increment the number of assets minted by this contract if it hasn't been minted before.
    if supply.is_none() {
        storage.total_assets.write(storage.total_assets.read() + 1);
    }
    let current_supply = supply.unwrap_or(0);
    storage
        .total_supply
        .insert(asset_id, current_supply + amount);
    mint_to(recipient, vault_sub_id, amount);
}

#[storage(read, write)]
pub fn _burn(asset_id: AssetId, vault_sub_id: SubId, amount: u64) {
    use std::{asset::burn, context::this_balance};

    require(
        this_balance(asset_id) >= amount,
        "BurnError::NotEnoughCoins",
    );
    // If we pass the check above, we can assume it is safe to unwrap.
    let supply = storage.total_supply.get(asset_id).try_read().unwrap();
    storage.total_supply.insert(asset_id, supply - amount);
    burn(vault_sub_id, amount);
}
