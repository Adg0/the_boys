use crate::functions::setup::{test_helpers::{setup,get_asset_id},abi_calls::{total_supply,constructor,mint}};
use fuels::types::{Identity,Bytes32,Bits256};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_get_total_supply() {
        let (user, _wallets) = setup().await;
        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        let sub_id_1 = Bytes32::from([1u8; 32]);
        
        let asset_id = get_asset_id(sub_id_1,user.compv.contract_id().into());
        let assets = total_supply(&user.compv, asset_id).await;
        assert_eq!(
            assets,
            None
        );
        
        let recipient = Identity::Address(_wallets[1].address().into());
        let mint_amount = 100;
    
        mint(&user.compv, recipient, Bits256(*sub_id_1), mint_amount).await;
        
        let assets = total_supply(&user.compv, asset_id).await;
        assert_eq!(
            assets,
            Some(mint_amount)
        );
    }
}