use crate::functions::setup::{test_helpers::{setup,get_asset_id},abi_calls::{deposit_collateral,constructor,mint}};
use fuels::types::{Bits256,Identity,Bytes32};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_deposit_collateral() {
        let (user, _wallets) = setup().await;
        let sender = Identity::Address(user.wallet.address().into());
        constructor(&user.compv, sender).await;
        
        let sub_id_1 = Bytes32::from([2u8; 32]);
        let asset_id = get_asset_id(sub_id_1,user.compv.contract_id().into());
        let recipient = Identity::Address(user.wallet.address().into());
        let amount = 100;
        
        mint(&user.compv, recipient, Bits256(*sub_id_1), amount).await;

        let collateral = deposit_collateral(&user.vaultconn, recipient, asset_id, amount).await;
        assert_eq!(
            collateral,
            amount
        );

    }

}