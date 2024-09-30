contract;

mod errors;
mod events;
mod interface;

use errors::{AmountError, MintError, SetError};
use ::events::{MintEvent,BurnEvent};
use standards::{src20::{SetDecimalsEvent, SetNameEvent, SetSymbolEvent, SRC20, TotalSupplyEvent,}, src5::{SRC5, State},};
use sway_libs::ownership::{
        _owner,
        initialize_ownership,
        only_owner,
        };
use interface::{Constructor,EmitSRC20Events,Compv};
use std::{auth::msg_sender, string::String, context::msg_amount,hash::Hash, asset::{burn,mint_to}};

storage {
    /// The current total number of coins minted for the asset.
    total_supply: u64 = 0,
}

configurable {
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
        1
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
        if asset == AssetId::default() {
            Some(storage.total_supply.try_read().unwrap_or(0))
        } else {
            None
        }
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
        if asset == AssetId::default() {
            Some(String::from_ascii_str(from_str_array(NAME)))
        } else {
            None
        }
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
        if asset == AssetId::default() {
            Some(String::from_ascii_str(from_str_array(SYMBOL)))
        } else {
            None
        }
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
        if asset == AssetId::default() {
            Some(DECIMALS)
        } else {
            None
        }
    }
}


impl Compv for Contract {

    #[storage(read, write)]
    fn mint(recipient: Identity, amount: u64) {
        only_owner();

        let current_supply = storage.total_supply.try_read().unwrap();
        storage.total_supply.write(current_supply + amount);
        let _ = mint_to(recipient, SubId::zero(), amount);

        log(MintEvent {
            recipient: recipient,
            supply: current_supply + amount,
            minted: amount,
        });
    }

    #[payable]
    #[storage(read, write)]
    fn burn(amount: u64) {
        require(msg_amount() == amount, AmountError::AmountMismatch);
        
        let current_supply = storage.total_supply.try_read().unwrap();

        storage.total_supply.write(current_supply - amount);

        burn(SubId::zero(), amount);

        log(BurnEvent {
            user: msg_sender().unwrap(),
            supply: current_supply - amount,
            burned: amount,
        });
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

impl EmitSRC20Events for Contract {
    fn emit_src20_events() {
        // Metadata that is stored as a configurable should only be emitted once.
        let asset = AssetId::default();
        let sender = msg_sender().unwrap();
        let name = Some(String::from_ascii_str(from_str_array(NAME)));
        let symbol = Some(String::from_ascii_str(from_str_array(SYMBOL)));

        SetNameEvent::new(asset, name, sender).log();
        SetSymbolEvent::new(asset, symbol, sender).log();
        SetDecimalsEvent::new(asset, DECIMALS, sender).log();
        TotalSupplyEvent::new(asset, TOTAL_SUPPLY, sender).log();
    }
}