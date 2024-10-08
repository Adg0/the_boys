use fuels::{
    prelude::*,
    accounts::wallet::{Wallet, WalletUnlocked},
    programs::responses::*,
    types::{Identity,AssetId},
};

abigen!(Contract(
    name = "Oracle",
    abi = "./out/debug/oracle-abi.json"
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

    pub async fn get_price_of(contract: &Oracle<WalletUnlocked>, asset_id: AssetId) -> u64 {
        contract.methods().get_price_of(asset_id).call().await.unwrap().value
    }

    pub async fn set_price_of(
        contract: &Oracle<WalletUnlocked>,
        new_price: u64,
        asset_id: AssetId,
    ) -> CallResponse<()> {
        contract
            .methods()
            .set_price_of(new_price,asset_id)
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await
            .unwrap()
    }

    pub async fn set_price(
        contract: &Oracle<WalletUnlocked>,
        new_price: u64,
    ) -> CallResponse<()> {
        contract
            .methods()
            .set_price(new_price)
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
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
            
        // let new_owner_address = Address::from_str("0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db").unwrap();

        // let configurables = OracleConfigurables::default()
        //     .with_OWNER(Identity::Address(new_owner_address)).unwrap();
            
        let oracle_id =
            Contract::load_from(ORACLE_CONTRACT_BINARY_PATH, LoadConfiguration::default())//.with_configurables(configurables))
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