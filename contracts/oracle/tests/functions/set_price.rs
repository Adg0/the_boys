use crate::functions::owner::{ test_helpers::setup, abi_calls::{ price, set_price}};
// use fuels::macros::{Parameterize,Tokenizable};

mod success {
    use super::*;
    // use ::events::PriceUpdateEvent;
    /// Event for when the price of an asset is updated.
    // #[derive(Debug, PartialEq, Parameterize, Tokenizable)]
    // struct PriceUpdateEvent {
    //     /// Updated price.
    //     pub price: u64,
    // }

    #[tokio::test]
    async fn can_set_price() {
        let (user, _) = setup().await;
        let set_price_amount: u64 = 1000;

        let response = set_price(&user.oracle, set_price_amount).await;
        let price = price(&user.oracle).await;

        let log = response
            // .decode_logs();
            // .decode_logs_with_type::<PriceUpdateEvent>()
            .decode_logs_with_type::<u64>()
            .unwrap();
        
        // println!("{:?}", log);
        let event = log.first().unwrap();
        // println!("{:?}", event);
        assert_eq!(
            *event, set_price_amount
        );
        // assert_eq!(
        //     *event, PriceUpdateEvent {
        //         price: set_price_amount
        //     }
        // );
        assert_eq!(price, Some(set_price_amount));
    }
}

mod revert {
    use super::*;

    #[tokio::test]
    #[should_panic(expected = "NotOwner")]
    async fn when_not_owner() {
        let (user, wallets) = setup().await;
        user.oracle
            .with_account(wallets[1].clone())
            .methods()
            .set_price(1000)
            .call()
            .await
            .unwrap();
    }
}
