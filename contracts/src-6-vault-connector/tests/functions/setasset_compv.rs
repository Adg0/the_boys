use crate::functions::setup::{test_helpers::{setup,get_asset_id},abi_calls::{configure_compv, name, setasset_compv}};
use fuels::types::{Bits256,Identity,Bytes32,ContractId};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_setasset_compv() {
        let (user, _wallets) = setup().await;
        let contract_id = Identity::ContractId(user.vaultconn.contract_id().into());
        let user_id = Identity::Address(user.wallet.address().into());
        
        configure_compv(&user.vaultconn, user.compv.contract_id().into()).await;
        
        let recipient = Identity::Address(_wallets[1].address().into());
        let sub_id_1 = Bytes32::from([1u8; 32]);
        let asset_id = get_asset_id(sub_id_1,user.compv.contract_id().into());
            
        setasset_compv(&user.vaultconn, user.compv.contract_id().into(),asset_id).await;

        assert_eq!(
            name(&user.compv, asset_id).await,
            Some(String::from("Compound V"))
        );
    }

}