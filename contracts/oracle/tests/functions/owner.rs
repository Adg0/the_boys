use fuels::{
    prelude::*,
    accounts::wallet::{Wallet, WalletUnlocked},
    // programs::call_response::FuelCallResponse,
    programs::responses::*,
    types::Identity,
};

abigen!(Contract(
    name = "Oracle",
    abi = "out/debug/oracle-abi.json"
));

pub struct Metadata {
    pub oracle: Oracle<WalletUnlocked>,
    pub wallet: Wallet,
}

pub mod paths {
    pub const ORACLE_CONTRACT_BINARY_PATH: &str =
        "./out/debug/oracle.bin";
}

pub mod abi_calls {
    use super::*;
    pub async fn owner(contract: &Oracle<WalletUnlocked>) -> Identity {
        contract.methods().owner().call().await.unwrap().value
    }
    pub async fn price(contract: &Oracle<WalletUnlocked>) -> Option<u64> {
        contract.methods().price().call().await.unwrap().value
    }

    pub async fn set_price(
        contract: &Oracle<WalletUnlocked>,
        new_price: u64,
    ) -> CallResponse<()> {
        contract
            .methods()
            .set_price(new_price)
            .call()
            .await
            .unwrap()
    }
}

pub mod test_helpers {

    use super::*;
    use paths::ORACLE_CONTRACT_BINARY_PATH;

    pub async fn setup() -> (Metadata, Vec<WalletUnlocked>) {
        let wallets = launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None)
            .await
            .unwrap();

        let oracle_id =
            Contract::load_from(ORACLE_CONTRACT_BINARY_PATH, LoadConfiguration::default())
                .unwrap()
                .deploy(&wallets[0], TxPolicies::default())
                .await
                .unwrap();

        let user = Metadata {
            oracle: Oracle::new(oracle_id, wallets[0].clone()),
            wallet: wallets[0].clone().lock(),
        };

        (user, wallets)
    }
}

mod success {
    use super::{test_helpers::setup, abi_calls::owner, *};

    #[tokio::test]
    async fn can_get_owner() {
        let (user, _) = setup().await;
        let owner = owner(&user.oracle).await;
        assert_eq!(
            owner,
            Identity::Address(Address::from(user.wallet.address()))
        );
    }
}
