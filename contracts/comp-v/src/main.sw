contract;

mod errors;
mod events;
mod interface;

use errors::{AmountError, MintError, SetError};
use ::events::{MintEvent,BurnEvent};
use standards::{src20::{SetDecimalsEvent, SetNameEvent, SetSymbolEvent, SRC20, TotalSupplyEvent,},src3::SRC3, src5::{SRC5, State},};
use sway_libs::{
    asset::{
        base::{
            _decimals,
            _name,
            _set_decimals,
            _set_name,
            _set_symbol,
            _symbol,
            _total_assets,
            _total_supply,
            SetAssetAttributes,
        }
    },
    ownership::{
        _owner,
        initialize_ownership,
        only_owner,
    },
};
use interface::{Constructor,};//EmitSRC20Events,Compv};
use std::{auth::msg_sender, string::String, context::msg_amount,call_frames::msg_asset_id, hash::Hash, storage::storage_string::*,constants::DEFAULT_SUB_ID,asset::{burn,mint_to}}; //asset::{burn,mint_to}

storage {
    /// The total number of unique assets minted by this contract.
    total_assets: u64 = 0,
    /// The current total number of coins minted for a particular asset.
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    /// The name associated with a particular asset.
    name: StorageMap<AssetId, StorageString> = StorageMap {},
    /// The symbol associated with a particular asset.
    symbol: StorageMap<AssetId, StorageString> = StorageMap {},
    /// The decimals associated with a particular asset.
    decimals: StorageMap<AssetId, u8> = StorageMap {},
    /// The total number of coins ever minted for an asset.
    cumulative_supply: StorageMap<AssetId, u64> = StorageMap {},
}

configurable {
    /// The maximum supply allowed for any single asset.
    MAX_SUPPLY: u64 = 100_000_000,
    /// The total supply of coins for the asset minted by this contract.
    TOTAL_SUPPLY: u64 = 100_000_000,
    /// The decimals of the asset minted by this contract.
    DECIMALS: u8 = 9u8,
    /// The name of the asset minted by this contract.
    NAME: str[9] = __to_str_array("CompoundV"),
    /// The symbol of the asset minted by this contract.
    SYMBOL: str[5] = __to_str_array("COMPV"),
    /// MINTER
    MINTER: ContractId = ContractId::from(0x3ede62568a4600582c79d99abdddab8f625caed77454fc088856ebb086496c03),
}

impl SRC20 for Contract {
    /// Returns the total number of individual assets minted by a contract.
    ///
    /// For this single asset contract, this is always one.
    ///
    /// # Returns
    ///
    /// * [u64] - The number of assets that this contract has minted.
    ///
    #[storage(read)]
    fn total_assets() -> u64 {
        _total_assets(storage.total_assets)
    }

    /// Returns the total supply of coins for the asset.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the total supply, this should be the default `SubId`.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The total supply of an `asset`.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        _total_supply(storage.total_supply, asset)
    }

    /// Returns the name of the asset.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the name, this should be the default `SubId`.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The name of `asset`.
    ///
    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        _name(storage.name, asset)
    }

    /// Returns the symbol of the asset.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the symbol, this should be the default `SubId`.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The symbol of `asset`.
    ///
    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        _symbol(storage.symbol, asset)
    }

    /// Returns the number of decimals the asset uses.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the decimals, this should be the default `SubId`.
    ///
    /// # Returns
    ///
    /// * [Option<u8>] - The decimal precision used by `asset`.
    ///
    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        _decimals(storage.decimals, asset)
    }
}


impl SRC3 for Contract {

    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: Option<SubId>, amount: u64) {
        only_owner();
        let sub_id = match sub_id {
            Some(s) => s,
            None => DEFAULT_SUB_ID,
        };
        let asset_id = AssetId::new(ContractId::this(), sub_id);

        // If this SubId is new, increment the total number of distinguishable assets this contract has minted.
        let asset_supply = storage.total_supply.get(asset_id).try_read();
        match asset_supply {
            None => {
                storage.total_assets.write(storage.total_assets.read() + 1)
            },
            _ => {},
        }

        // Increment total supply of the asset and mint to the recipient.
        let new_supply = amount + asset_supply.unwrap_or(0);
        storage.total_supply.insert(asset_id, new_supply);

        mint_to(recipient, sub_id, amount);
        
        let cumulative_supply = storage.cumulative_supply.get(asset_id).try_read().unwrap_or(0);
        storage
            .cumulative_supply
            .insert(asset_id, cumulative_supply + amount);

        TotalSupplyEvent::new(asset_id, new_supply, msg_sender().unwrap())
            .log();
    }

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require(msg_amount() == amount, AmountError::AmountMismatch);
        
        let asset_id = AssetId::new(ContractId::this(), sub_id);
        require(msg_asset_id() == asset_id, "Incorrect asset provided");

        // Decrement total supply of the asset and burn.
        let new_supply = storage.total_supply.get(asset_id).read() - amount;
        storage.total_supply.insert(asset_id, new_supply);

        burn(sub_id, amount);

        let cumulative_supply = storage.cumulative_supply.get(asset_id).try_read().unwrap_or(0);
        storage
            .cumulative_supply
            .insert(asset_id, cumulative_supply - amount);        

        TotalSupplyEvent::new(asset_id, new_supply, msg_sender().unwrap())
            .log();
    }
}

impl SRC5 for Contract {
    /// Returns the owner.
    ///
    /// # Return Values
    ///
    /// * [State] - Represents the state of ownership for this contract.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src5::SRC5;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let ownership_abi = abi(contract_id, SRC_5);
    ///
    ///     match ownership_abi.owner() {
    ///         State::Uninitalized => log("The ownership is uninitalized"),
    ///         _ => log("This example will never reach this statement"),
    ///     }
    /// }
    /// ```
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}

impl Constructor for Contract {
    /// Sets the defaults for the contract.
    ///
    /// # Arguments
    ///
    /// * `owner`: [Identity] - The `Identity` that will be the first owner.
    ///
    /// # Reverts
    ///
    /// * When ownership has been set before.
    ///
    /// # Number of Storage Acesses
    ///
    /// * Reads: `1`
    /// * Write: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src5::SRC5;
    /// use native_asset::Constructor;
    ///
    /// fn foo(contract: ContractId, owner: Identity) {
    ///     let src_5_abi = abi(SRC5, contract.bits());
    ///     assert(src_5_abi.owner() == State::Uninitialized);
    ///
    ///     let constructor_abi = abi(Constructor, contract.bits());
    ///     constructor_abi.constructor(owner);
    ///     assert(src_5_abi.owner() == State::Initialized(owner));
    /// }
    /// ```
    #[storage(read, write)]
    fn constructor(owner: Identity) {
        initialize_ownership(owner);
    }
}

impl SetAssetAttributes for Contract {
    /// Sets the name of an asset.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to set the name.
    /// * `name`: [String] - The name of the asset.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    /// * When the name has already been set for an asset.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `2`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::asset::SetAssetAttributes;
    /// use standards::src20::SRC20;
    /// use std::string::String;
    ///
    /// fn foo(asset: AssetId) {
    ///     let set_abi = abi(SetAssetAttributes, contract_id);
    ///     let src_20_abi = abi(SRC20, contract_id);
    ///     let name = String::from_ascii_str("Ether");
    ///     set_abi.set_name(storage.name, asset, name);
    ///     assert(src_20_abi.name(asset) == name);
    /// }
    /// ```
    #[storage(write)]
    fn set_name(asset: AssetId, name: String) {
        only_owner();

        require(
            storage
                .name
                .get(asset)
                .read_slice()
                .is_none(),
            SetError::ValueAlreadySet,
        );
        _set_name(storage.name, asset, name);
    }

    /// Sets the symbol of an asset.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to set the symbol.
    /// * `symbol`: [String] - The symbol of the asset.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    /// * When the symbol has already been set for an asset.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `2`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use asset::SetAssetAttributes;
    /// use standards::src20::SRC20;
    /// use std::string::String;
    ///
    /// fn foo(asset: AssetId) {
    ///     let set_abi = abi(SetAssetAttributes, contract_id);
    ///     let src_20_abi = abi(SRC20, contract_id);
    ///     let symbol = String::from_ascii_str("ETH");
    ///     set_abi.set_symbol(storage.name, asset, symbol);
    ///     assert(src_20_abi.symbol(asset) == symbol);
    /// }
    /// ```
    #[storage(write)]
    fn set_symbol(asset: AssetId, symbol: String) {
        only_owner();

        require(
            storage
                .symbol
                .get(asset)
                .read_slice()
                .is_none(),
            SetError::ValueAlreadySet,
        );
        _set_symbol(storage.symbol, asset, symbol);
    }

    /// Sets the decimals of an asset.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to set the decimals.
    /// * `decimal`: [u8] - The decimals of the asset.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    /// * When the decimals has already been set for an asset.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    /// # Examples
    ///
    /// ```sway
    /// use sway_libs::asset::SetAssetAttributes;
    /// use standards::src20::SRC20;
    ///
    /// fn foo(asset: AssetId) {
    ///     let decimals = 8u8;
    ///     let set_abi = abi(SetAssetAttributes, contract_id);
    ///     let src_20_abi = abi(SRC20, contract_id);
    ///     set_abi.set_decimals(asset, decimals);
    ///     assert(src_20_abi.decimals(asset) == decimals);
    /// }
    /// ```
    #[storage(write)]
    fn set_decimals(asset: AssetId, decimals: u8) {
        only_owner();

        require(
            storage
                .decimals
                .get(asset)
                .try_read()
                .is_none(),
            SetError::ValueAlreadySet,
        );
        _set_decimals(storage.decimals, asset, decimals);
    }
}
