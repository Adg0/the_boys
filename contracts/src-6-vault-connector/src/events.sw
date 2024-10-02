library;

pub struct VaultInfo {
    /// Amount of assets currently managed by this vault
    pub managed_assets: u64,
    /// The vault_sub_id of this vault.
    pub vault_sub_id: SubId,
    /// The asset being managed by this vault
    pub asset: AssetId,
}

pub struct CollateralInfo {
    pub asset: AssetId, // The asset being used as collateral
    pub collateral: u64, // Total collateral provided by users
    pub debt: u64, // Total borrowed amount
    pub ltv_ratio: u64, // Loan-to-Value ratio for borrowing
}

pub struct CollateralDeposited {
    pub user: Identity,
    pub asset: AssetId,
    pub amount: u64,
}

pub struct BorrowedLog {
    pub user: Identity,
    pub asset: AssetId,
    pub amount: u64,
}

pub struct Repayment {
    pub user: Identity,
    pub asset: AssetId,
    pub amount: u64,
    pub debt: u64,
    pub balance: u64,
}

pub struct Liquidated {
    pub user: Identity,
    pub asset: AssetId,
    pub collateral: u64,
    pub debt: u64,
}
