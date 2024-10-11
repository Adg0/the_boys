library;

abi SRC6VaultConnector {
    #[storage(read, write)]
    fn configure_compv(contract_id: ContractId);

    fn setasset_compv(contract_id: ContractId);

    #[payable]
    #[storage(read, write)]
    fn deposit_collateral(user: Identity) -> u64;

    #[payable]
    #[storage(read, write)]
    fn borrow_a(user: Identity, borrow_asset_id: AssetId) -> u64;

    #[payable]
    #[storage(read, write)]
    fn repay(user: Identity) -> u64;

    fn get_balance(asset_id: AssetId) -> u64;

    #[payable]
    #[storage(read, write)]
    fn liquidate(user: Identity, borrowed_asset_id: AssetId) -> u64;

    fn preview_share(underlying_asset: AssetId, vault_sub_id: SubId) -> (AssetId, SubId);

    #[payable]
    #[storage(read)]
    fn preview_wi(share_asset_id: AssetId) -> u64;
}
