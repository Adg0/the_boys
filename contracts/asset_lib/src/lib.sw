library;

// anything `pub` here will be exported as a part of this library's API
use std::string::String;

pub enum AmountError {
    AmountMismatch: (),
}
pub enum MintError {
    MaxMinted: (),
}
pub enum SetError {
    ValueAlreadySet: (),
}

/// Determines the state of ownership.
pub enum State {
    /// The ownership has not been set.
    Uninitialized: (),
    /// The user which has been given ownership.
    Initialized: Identity,
    /// The ownership has been given up and can never be set again.
    Revoked: (),
}

/// Error log for when access is denied.
pub enum AccessError {
    /// Emitted when the caller is not the owner of the contract.
    NotOwner: (),
}


abi Compv {
    /// Initialized owner
    #[storage(read, write)]
    fn constructor(owner: Identity);
    /// Event when contract created
    fn emit_src20_events();

    
    /// Mints new assets using the `sub_id` sub-identifier set to SubId::zero()
    ///
    /// # Arguments
    ///
    /// * `recipient`: [Identity] - The user to which the newly minted assets are transferred to.
    /// * `amount`: [u64] - The quantity of coins to mint.
    ///
    /// # Reverts
    ///
    /// * When the caller is not the contract owner.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    #[storage(read, write)]
    fn mint(recipient: Identity, amount: u64);
    
    /// Burns assets sent with the given `sub_id`.
    ///
    /// # Arguments
    ///
    /// * `sub_id`: [SubId] - The sub-identifier of the asset to burn.
    /// * `amount`: [u64] - The quantity of coins to burn.
    ///
    /// # Reverts
    ///
    /// * When the `amount` provided and transaction amount do not match.
    ///
    /// # Number of Storage Accesses
    ///
    /// * Reads: `1`
    /// * Writes: `1`
    ///
    #[payable]
    #[storage(read, write)]
    fn burn(amount: u64);

    /// Returns the total number of individual assets for a contract.
    ///
    /// # Returns
    ///
    /// * [u64] - The number of assets that this contract has minted.
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src20::SRC20;
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SRC20, contract_id.bits());
    ///     let total_assets: u64 = contract_abi.total_assets();
    ///     assert(total_assets != 0);
    /// }
    /// ```
    #[storage(read)]
    fn total_assets() -> u64;

    /// Returns the total supply of coins for an asset.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the total supply.
    ///
    /// # Returns
    ///
    /// * [Option<u64>] - The total supply of coins for `asset`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src20::SRC20;
    ///
    /// fn foo(contract_id: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC20, contract_id.bits());
    ///     let total_supply: Option<u64> = contract_abi.total_supply(asset);
    ///     assert(total_supply.unwrap() != 0);
    /// }
    /// ```
    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64>;

    /// Returns the name of the asset, such as “Ether”.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the name.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The name of `asset`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src20::SRC20;
    /// use std::string::String;
    ///
    /// fn foo(contract_id: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC20, contract_id.bits());
    ///     let name: Option<String> = contract_abi.name(asset);
    ///     assert(name.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn name(asset: AssetId) -> Option<String>;
    /// Returns the symbol of the asset, such as “ETH”.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the symbol.
    ///
    /// # Returns
    ///
    /// * [Option<String>] - The symbol of `asset`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src20::SRC20;
    /// use std::string::String;
    ///
    /// fn foo(contract_id: ContractId, asset: AssetId) {
    ///     let contract_abi = abi(SRC20, contract_id.bits());
    ///     let symbol: Option<String> = contract_abi.symbol(asset);
    ///     assert(symbol.is_some());
    /// }
    /// ```
    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String>;
    /// Returns the number of decimals the asset uses.
    ///
    /// # Additional Information
    ///
    /// e.g. 8, means to divide the coin amount by 100000000 to get its user representation.
    ///
    /// # Arguments
    ///
    /// * `asset`: [AssetId] - The asset of which to query the decimals.
    ///
    /// # Returns
    ///
    /// * [Option<u8>] - The decimal precision used by `asset`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src20::SRC20;
    ///
    /// fn foo(contract_id: ContractId, asset: AssedId) {
    ///     let contract_abi = abi(SRC20, contract_id.bits());
    ///     let decimals: Option<u8> = contract_abi.decimals(asset);
    ///     assert(decimals.unwrap() == 8u8);
    /// }
    /// ```
    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8>;

    /// Returns the owner.
    ///
    /// # Return Values
    ///
    /// * [State] - Represents the state of ownership for this contract.
    ///
    /// # Examples
    ///
    /// ```sway
    /// use standards::src5::{SRC5, State};
    ///
    /// fn foo(contract_id: ContractId) {
    ///     let contract_abi = abi(SRC5, contract_id.bits());
    ///
    ///     match contract_abi.owner() {
    ///         State::Uninitialized => log("The ownership is uninitialized"),
    ///         State::Initialized(owner) => log("The ownership is initialized"),
    ///         State::Revoked => log("The ownership is revoked"),
    ///     }
    /// }
    /// ```
    #[storage(read)]
    fn owner() -> State;
}