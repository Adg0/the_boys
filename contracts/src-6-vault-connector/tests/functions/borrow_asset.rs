use crate::functions::setup::{test_helpers::{setup,get_asset_id},abi_calls::{deposit_collateral,constructor,mint,deposit,borrow_a}};
use fuels::types::{Bits256,Identity,Bytes32};

mod success {
    use super::*;
    use crate::functions::setup::abigen_bindings::compv_mod::standards::{src5::State,src20::TotalSupplyEvent};

    #[tokio::test]
    async fn can_borrow_asset() {
        let (user, _wallets) = setup().await;
        let sender = Identity::Address(user.vaultconn.contract_id().into());
        
        constructor(&user.compv, sender).await;
        
        let sub_id_1 = Bytes32::from([1u8; 32]);
        let asset_id = get_asset_id(sub_id_1,user.compv.contract_id().into());
        let recipient = Identity::Address(user.wallet.address().into());
        let amount = 100;
        
        // mint(&user.compv, recipient, Bits256(*sub_id_1), amount).await;
        let mint_amount = 100;

        let minted = mint(&user.compv, recipient, Bits256(*sub_id_1), mint_amount).await;
        let log = minted
                .decode_logs_with_type::<TotalSupplyEvent>()
                .unwrap();
        let event = log.first().unwrap();
        println!("{:?}", event);

        assert_eq!(
            *event, TotalSupplyEvent {
                asset: get_asset_id(sub_id_1,user.compv.contract_id().into()),
                supply: mint_amount,
                sender: Identity::Address(user.vaultconn.contract_id().into()),
            }
        );

        
        // let vault_sub_id = Bytes32::from([1u8; 32]);
        // let sub_id_2 = Bytes32::from([2u8; 32]);
        // let borrow_asset_id = get_asset_id(sub_id_2,user.compv.contract_id().into());
        // let amount_2 = 1_000;
        
        // mint(&user.compv, recipient, Bits256(*sub_id_2), amount_2).await;
        // let share = deposit(&user.vaultconn, sender, Bits256(*vault_sub_id), borrow_asset_id, amount_2).await;
        
        // assert_eq!(
        //     share,
        //     amount_2
        // );
        
        // let collateral = deposit_collateral(&user.vaultconn, recipient, asset_id, amount).await;
        // assert_eq!(
        //     collateral,
        //     amount
        // );

        // let borrow = borrow_a(&user.vaultconn, recipient, asset_id, borrow_asset_id, 50).await;
        // assert_eq!(
        //     borrow,
        //     50
        // );
    }

}