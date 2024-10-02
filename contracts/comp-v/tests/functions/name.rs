use crate::functions::setup::{test_helpers::setup,abi_calls::{name,symbol,emit_src20_events}};
use fuels::types::AssetId;
use std::{string::String,str::FromStr};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_get_name() {
        let (user, _) = setup().await;
        let name_str = String::from_str("CompoundV");
        emit_src20_events(&user.compv).await;

        let compv_name = name(&user.compv, AssetId::default()).await.unwrap();
        
        assert_eq!(
            name_str,
            Ok(compv_name)
        );
    }

    #[tokio::test]
    async fn can_get_symbol() {
        let (user, _) = setup().await;
        let symbol_str = String::from_str("COMPV");
        emit_src20_events(&user.compv).await;

        let compv_symbol = symbol(&user.compv, AssetId::default()).await.unwrap();
        
        assert_eq!(
            symbol_str,
            Ok(compv_symbol)
        );
    }
}