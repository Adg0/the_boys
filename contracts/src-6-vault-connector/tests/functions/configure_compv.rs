use crate::functions::setup::{test_helpers::{setup,get_asset_id},abi_calls::{configure_compv, owner}};
use fuels::types::{Bits256,Identity,Bytes32,ContractId};

mod success {
    use super::*;
    use crate::functions::setup::abigen_bindings::compv_mod::standards::{src5::State,};

    #[tokio::test]
    async fn can_configure_compv() {
        let (user, _wallets) = setup().await;
        let contract_id = Identity::ContractId(user.vaultconn.contract_id().into());
        let user_id = Identity::Address(user.wallet.address().into());
        // println!("ContractId: {:?}",contract_id);
        // println!("User: {:?}",user_id);

        
        configure_compv(&user.vaultconn, user.compv.contract_id().into()).await;
        let response: State = owner(&user.compv).await;

        // Use pattern matching to extract the Identity from the Initialized state
        if let State::Initialized(identity) = response {
            // Check if the extracted Identity matches the expected wallet address
            assert_eq!(
                identity,
                contract_id
            );
        } else {
            panic!("The state is not Initialized with an Identity");
        } 
    }

}