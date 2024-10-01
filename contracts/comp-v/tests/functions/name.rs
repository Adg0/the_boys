use crate::functions::setup::{test_helpers::setup,abi_calls::{name,symbol,constructor,owner,set_name,set_symbol}};
use fuels::types::{AssetId,Identity};
use std::{string::String,str::FromStr};

mod success {
    use super::*;
    // use crate::functions::setup::abigen_bindings::compv_mod::standards::src5::State; // Import `src5::State`

    #[tokio::test]
    async fn test_name() {
        let (user, _) = setup().await;
        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        // let response: State = owner(&user.compv).await;
        
        // // Use pattern matching to extract the Identity from the Initialized state
        // if let State::Initialized(identity) = response {
        //     // Check if the extracted Identity matches the expected wallet address
        //     assert_eq!(
        //         identity,
        //         Identity::Address(user.wallet.address().into())
        //     );
        // } else {
        //     panic!("The state is not Initialized with an Identity");
        // } 

        assert_eq!(name(&user.compv, AssetId::default()).await, None);

        set_name(&user.compv, AssetId::default(), String::from("CompoundV 1")).await;
        assert_eq!(
            name(&user.compv, AssetId::default()).await,
            Some(String::from("CompoundV 1"))
        );
    }

    #[tokio::test]
    async fn test_symbol() {
        let (user, _) = setup().await;
        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        // let response: State = owner(&user.compv).await;
        
        // // Use pattern matching to extract the Identity from the Initialized state
        // if let State::Initialized(identity) = response {
        //     // Check if the extracted Identity matches the expected wallet address
        //     assert_eq!(
        //         identity,
        //         Identity::Address(user.wallet.address().into())
        //     );
        // } else {
        //     panic!("The state is not Initialized with an Identity");
        // } 

        assert_eq!(symbol(&user.compv, AssetId::default()).await, None);

        set_symbol(&user.compv, AssetId::default(), String::from("COMPV")).await;
        assert_eq!(
            symbol(&user.compv, AssetId::default()).await,
            Some(String::from("COMPV"))
        );
    }
}