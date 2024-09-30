use crate::functions::owner::{test_helpers::setup,abi_calls::{price,set_price}};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_get_price() {
        let (user, _) = setup().await;
        let set_price_amount: u64 = 1000;
        set_price(&user.oracle, set_price_amount).await;
        let price = price(&user.oracle).await;
        assert_eq!(price, Some(set_price_amount));
    }

    #[tokio::test]
    async fn can_get_price_when_not_initialized() {
        let (user, _) = setup().await;
        let price = price(&user.oracle).await;
        assert_eq!(price, None);
    }
}
