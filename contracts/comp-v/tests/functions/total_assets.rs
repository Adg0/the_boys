use crate::functions::setup::{test_helpers::setup,abi_calls::{total_assets}};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_get_total_assets() {
        let (user, _) = setup().await;
        let assets = total_assets(&user.compv).await;
        assert_eq!(
            assets,
            1
        );
    }
}