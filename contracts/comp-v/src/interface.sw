library;

abi Constructor {
    #[storage(read, write)]
    fn constructor(owner: Identity);
}

abi EmitSRC20Events {
    fn emit_src20_events();
}

abi Compv {
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
}