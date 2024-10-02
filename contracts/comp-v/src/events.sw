library;

/// Event for when a token is minted.
pub struct MintEvent {
    pub recipient: Identity,
    pub supply: u64,
    pub minted: u64,
}
/// Event for when a token is burned.
pub struct BurnEvent {
    pub user: Identity,
    pub supply: u64,
    pub burned: u64,
}
