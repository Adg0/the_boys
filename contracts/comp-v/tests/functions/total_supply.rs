use crate::functions::setup::{test_helpers::setup,abi_calls::{total_supply,emit_src20_events}};
use fuels::types::AssetId;

mod success {
    use super::*;

    #[tokio::test]
    async fn can_get_total_supply() {
        let (user, _) = setup().await;
        let response = emit_src20_events(&user.compv).await;
        let log = response
            .decode_logs();
        println!("{:?}", log);

        let assets = total_supply(&user.compv, AssetId::default()).await;
        assert_eq!(
            assets,
            Some(100000000)
        );
    }
}