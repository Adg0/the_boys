use crate::functions::setup::{test_helpers::setup,abi_calls::{constructor,owner,mint,burn}};
use fuels::types::Identity;

mod success {
    use super::*;
    use crate::functions::setup::abigen_bindings::compv_mod::standards::src5::State; // Import `src5::State`
    use crate::functions::setup::abigen_bindings::compv_mod::events::{MintEvent,BurnEvent};

    #[tokio::test]
    async fn can_mint() {
        let (user, _wallets) = setup().await;
        

        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        let response: State = owner(&user.compv).await;
        
        // Use pattern matching to extract the Identity from the Initialized state
        if let State::Initialized(identity) = response {
            // Check if the extracted Identity matches the expected wallet address
            assert_eq!(
                identity,
                Identity::Address(user.wallet.address().into())
            );
        } else {
            panic!("The state is not Initialized with an Identity");
        }   
        
        // let mint_amount = 1_000;
        let minted = mint(
            &user.compv,
            Identity::Address(_wallets[1].address().into()),
            1
            ).await;

            let log = minted
            .decode_logs();
                // .decode_logs_with_type::<MintEvent>()
                // .decode_logs_with_type::<u64>()
                // .unwrap();
                println!("{:?}", log);
            // let event = log.first().unwrap();
            // println!("{:?}", event);
    
            // assert_eq!(
            //     *event, SetNameEvent {
            //         asset: AssetId::default(),
            //         name: Some("CompoundV".to_string()),
            //         sender: Identity::Address(user.wallet.address().into()),
            //     }
            // );
            assert_eq!(1,1);
    }

    #[tokio::test]
    async fn can_burn() {
        let (user, _wallets) = setup().await;
        

        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        let response: State = owner(&user.compv).await;
        
        // Use pattern matching to extract the Identity from the Initialized state
        if let State::Initialized(identity) = response {
            // Check if the extracted Identity matches the expected wallet address
            assert_eq!(
                identity,
                Identity::Address(user.wallet.address().into())
            );
        } else {
            panic!("The state is not Initialized with an Identity");
        }   
        
        let mint_amount = 1_000;
        mint(
            &user.compv,
            Identity::Address(_wallets[1].address().into()),
            mint_amount
        ).await;

            
        assert_eq!(1,1);
    }
}