use crate::functions::setup::{test_helpers::setup,abi_calls::{total_assets,constructor,mint}};
use fuels::types::{Bits256,Identity,Bytes32};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_get_total_assets() {
        let (user, _wallets) = setup().await;
        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        let assets = total_assets(&user.compv).await;
        assert_eq!(
            assets,
            0
        );

    }

    #[tokio::test]
    async fn test_change_total_assets() {
        let (user, _wallets) = setup().await;
        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        let assets = total_assets(&user.compv).await;
        assert_eq!(
            assets,
            0
        );

        let recipient = Identity::Address(_wallets[1].address().into());
        let sub_id_1 = Bytes32::from([1u8; 32]);
    
        mint(&user.compv, recipient, Bits256(*sub_id_1), 100).await;
        
        let assets = total_assets(&user.compv).await;
        // println!("Assets: {assets}");
        assert_eq!(assets, 1);
    }

}