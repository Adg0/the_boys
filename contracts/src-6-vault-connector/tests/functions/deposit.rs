use crate::functions::setup::{test_helpers::{setup,get_asset_id},abi_calls::{constructor,mint,deposit}};
use fuels::types::{Bits256,Identity,Bytes32};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_deposit_asset() {
        let (user, _wallets) = setup().await;
        let sender = Identity::Address(user.wallet.address().into());
        constructor(&user.compv, sender).await;
        
        let vault_sub_id = Bytes32::from([1u8; 32]);
        let sub_id_1 = Bytes32::from([2u8; 32]);
        let asset_id = get_asset_id(sub_id_1,user.compv.contract_id().into());
        let recipient = Identity::Address(user.wallet.address().into());
        let amount = 1_000;
        
        mint(&user.compv, recipient, Bits256(*sub_id_1), amount).await;

        let share = deposit(&user.vaultconn, sender, Bits256(*vault_sub_id), asset_id, amount).await;

        assert_eq!(
            share,
            amount
        );
    }

}