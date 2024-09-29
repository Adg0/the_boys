use fuels::{
    prelude::*,
    accounts::wallet::{Wallet, WalletUnlocked},
    // programs::call_response::FuelCallResponse,
    programs::responses::*,
    types::{Identity,AssetId,ContractId},
};
use std::str::FromStr;

abigen!(Contract(
    name = "Compv",
    abi = "out/debug/comp-v-abi.json"
));

pub struct Metadata {
    pub compv: Compv<WalletUnlocked>,
    pub wallet: Wallet,
}

pub mod paths {
    pub const COMPV_CONTRACT_BINARY_PATH: &str =
        "./out/debug/comp-v.bin";
}

pub mod abi_calls {
    use super::*;
    pub async fn total_assets(contract: &Compv<WalletUnlocked>) -> Identity {
        contract.methods().total_assets().call().await.unwrap().value
    }
    
}

pub mod test_helpers {

    use super::*;
    use paths::COMPV_CONTRACT_BINARY_PATH;

    pub async fn setup() -> (Metadata, Vec<WalletUnlocked>) {
        let wallets = launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None)
            .await
            .unwrap();
        
        // let new_minter_contract = ContractId::from_str("0x3ede62568a4600582c79d99abdddab8f625caed77454fc088856ebb086496c03").unwrap();

        // let configurables = CompvConfigurables::default()
        //     .with_MINTER(new_minter_contract).unwrap();
    
        let compv_id =
            Contract::load_from(COMPV_CONTRACT_BINARY_PATH, LoadConfiguration::default())//.with_configurables(configurables))
                .unwrap()
                .deploy(&wallets[0], TxPolicies::default())
                .await
                .unwrap();

        let user = Metadata {
            compv: Compv::new(compv_id, wallets[0].clone()),
            wallet: wallets[0].clone().lock(),
        };

        (user, wallets)
    }
}

mod success {
    use super::{test_helpers::setup, abi_calls::total_assets, *};

    #[tokio::test]
    async fn can_get_total_assets() {
        let (user, _) = setup().await;
        let assets = total_assets(&user.compv).await;
        assert_eq!(
            assets,
            1
        );
    }
}