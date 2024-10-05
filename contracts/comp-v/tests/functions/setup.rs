pub use fuels::{
    prelude::*,
    accounts::wallet::{Wallet, WalletUnlocked},
    // programs::call_response::FuelCallResponse,
    programs::responses::*,
    types::{Identity,AssetId,ContractId,Bytes32,Bits256},
    macros::{Parameterize,Tokenizable}
};
use sha2::{Digest, Sha256};
use std::{string::String,str::FromStr};

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

    pub async fn total_assets(contract: &Compv<WalletUnlocked>) -> u64 {
        contract.methods().total_assets().call().await.unwrap().value
    }

    pub async fn total_supply(contract: &Compv<WalletUnlocked>, asset: AssetId) -> Option<u64> {
        contract.methods().total_supply(asset).call().await.unwrap().value
    }

    pub async fn name(contract: &Compv<WalletUnlocked>, asset: AssetId) -> Option<String> {
        contract.methods().name(asset).call().await.unwrap().value
    }
    
    pub async fn symbol(contract: &Compv<WalletUnlocked>, asset: AssetId) -> Option<String> {
        contract.methods().symbol(asset).call().await.unwrap().value
    }

    pub async fn decimals(contract: &Compv<WalletUnlocked>, asset: AssetId) -> Option<u8> {
        contract.methods().decimals(asset).call().await.unwrap().value
    }

    pub async fn mint(contract: &Compv<WalletUnlocked>, recipient: Identity,sub_id: Bits256, amount: u64) -> CallResponse<()> {
        contract
            .methods()
            .mint(recipient,Some(sub_id),amount)
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await
            .unwrap()
    }

    pub async fn burn(contract: &Compv<WalletUnlocked>,asset_id: AssetId, sub_id: Bits256, amount: u64) -> CallResponse<()> {
        contract
            .methods()
            .burn(sub_id,amount)
            .with_tx_policies(TxPolicies::default().with_script_gas_limit(2_000_000))
            .call_params(CallParameters::new(amount, asset_id, 1_000_000))
            .unwrap()
            .call()
            .await
            .unwrap()
    }

    pub async fn owner(contract: &Compv<WalletUnlocked>) -> State {
        contract.methods().owner().call().await.unwrap().value
    }

    pub async fn constructor(contract: &Compv<WalletUnlocked>, owner: Identity) {
        contract.methods().constructor(owner).call().await.unwrap().value
    }

    pub async fn set_name(contract: &Compv<WalletUnlocked>,asset: AssetId, name: String) -> CallResponse<()> {
        contract.methods().set_name(asset,name).call().await.unwrap()
    }

    pub async fn set_symbol(contract: &Compv<WalletUnlocked>,asset: AssetId, symbol: String) -> CallResponse<()> {
        contract.methods().set_symbol(asset,symbol).call().await.unwrap()
    }
}

pub mod test_helpers {

    use super::*;
    use paths::COMPV_CONTRACT_BINARY_PATH;

    pub fn get_asset_id(sub_id: Bytes32, contract: ContractId) -> AssetId {
        let mut hasher = Sha256::new();
        hasher.update(*contract);
        hasher.update(*sub_id);
        AssetId::new(*Bytes32::from(<[u8; 32]>::from(hasher.finalize())))
    }

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

    pub async fn get_wallet_balance(wallet: &WalletUnlocked, asset: &AssetId) -> u64 {
        wallet.get_asset_balance(asset).await.unwrap()
    }
}

mod success {
    use super::{test_helpers::setup, abi_calls::{owner,constructor,name,set_name}, *};

    #[tokio::test]
    async fn can_setup() {
        let (user, _wallets) = setup().await;
        constructor(&user.compv, Identity::Address(user.wallet.address().into())).await;
        
        let response: State = owner(&user.compv).await;
        
        // Use pattern matching to extract the Identity from the Initialized state
        if let State::Initialized(identity) = response {
            // Check if the extracted Identity matches the expected wallet address
            assert_eq!(
                identity,
                Identity::Address(user.wallet.address().into())
            );
        } else {
            panic!("The state is not Initialized with an Identity");
        } 

        assert_eq!(name(&user.compv, AssetId::default()).await, None);

        set_name(&user.compv, AssetId::default(), String::from("Fuel Asset 1")).await;
        assert_eq!(
            name(&user.compv, AssetId::default()).await,
            Some(String::from("Fuel Asset 1"))
        );
    }
}