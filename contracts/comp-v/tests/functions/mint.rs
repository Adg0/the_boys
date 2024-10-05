use crate::functions::setup::{test_helpers::{setup,get_asset_id},abi_calls::{constructor,owner,mint,burn}};
use fuels::types::{Identity,Bits256,AssetId,Bytes32};

mod success {
    use super::*;
    use crate::functions::setup::abigen_bindings::compv_mod::standards::{src5::State,src20::TotalSupplyEvent}; // Import `src5::State`

    #[tokio::test]
    async fn can_mint_asset() {
        let (user, _wallets) = setup().await;
        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        

        let recipient = Identity::Address(_wallets[1].address().into());
        let sub_id_1 = Bytes32::from([1u8; 32]);
        let mint_amount = 100;

        let minted = mint(&user.compv, recipient, Bits256(*sub_id_1), mint_amount).await;
        let log = minted
                .decode_logs_with_type::<TotalSupplyEvent>()
                .unwrap();
        let event = log.first().unwrap();
        // println!("{:?}", event);
    
            assert_eq!(
                *event, TotalSupplyEvent {
                    asset: get_asset_id(sub_id_1,user.compv.contract_id().into()),
                    supply: mint_amount,
                    sender: Identity::Address(user.wallet.address().into()),
                }
            );
    }

}