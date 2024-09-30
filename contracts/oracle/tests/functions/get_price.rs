use crate::functions::owner::{test_helpers::setup,abi_calls::{set_price_of,get_price_of}};
use fuels::types::AssetId;

mod success {
    use super::*;

    #[tokio::test]
    async fn can_get_price_of() {
        let (user, _) = setup().await;
        let set_price_amount: u64 = 1000;
        set_price_of(&user.oracle, set_price_amount, AssetId::zeroed()).await;
        let price_of = get_price_of(&user.oracle, AssetId::zeroed()).await;
        assert_eq!(price_of, set_price_amount);
    }
}
