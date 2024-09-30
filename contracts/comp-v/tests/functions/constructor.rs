use crate::functions::setup::{test_helpers::setup,abi_calls::{constructor,owner}};
use fuels::types::Identity;

mod success {
    use super::*;
    use crate::functions::setup::abigen_bindings::compv_mod::standards::src5::State; // Import the `src5::State`

    #[tokio::test]
    async fn can_set_owner() {
        let (user, _wallets) = setup().await;
        

        constructor(&user.compv, Identity::Address(_wallets[1].address().into())).await;
        
        let response: State = owner(&user.compv).await;
        
        // Use pattern matching to extract the Identity from the Initialized state
        if let State::Initialized(identity) = response {
            // Check if the extracted Identity matches the expected wallet address
            assert_eq!(
                identity,
                Identity::Address(_wallets[1].address().into())
            );
        } else {
            panic!("The state is not Initialized with an Identity");
        }        
    }
}