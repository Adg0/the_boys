library;

/// Event for when the price of an asset is updated.
pub struct PriceUpdateEvent {
    /// Updated price.
    pub price: u64,
}

pub struct PriceOfUpdateEvent {
    /// Updated price.
    pub price: u64,
    /// Updated asset
    pub asset: AssetId,
}
