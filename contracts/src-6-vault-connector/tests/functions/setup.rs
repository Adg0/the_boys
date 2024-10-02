pub use fuels::{
    prelude::*,
    accounts::wallet::{Wallet, WalletUnlocked},
    programs::responses::*,
    types::{Identity,AssetId,ContractId,Bytes32,Bits256},
    macros::{Parameterize,Tokenizable}
};
use sha2::{Digest, Sha256};
use std::{string::String,str::FromStr};

abigen!(Contract(
    name = "Compv",
    abi = "out/debug/comp-v-abi.json"
),Contract(
    name = "VaultConnector",
    abi = "out/debug/src-6-vault-connector-abi.json"
));

pub struct Metadata {
    pub vaultconn: VaultConnector<WalletUnlocked>,
    pub compv: Compv<WalletUnlocked>,
    pub wallet: Wallet,
}

pub mod paths {
    pub const COMPV_CONTRACT_BINARY_PATH: &str =
        "./out/debug/comp-v.bin";
    pub const VAULT_CONTRACT_BINARY_PATH: &str =
        "./out/debug/src-6-vault-connector.bin";
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

    pub async fn set_decimals(contract: &Compv<WalletUnlocked>,asset: AssetId, decimals: u8) -> CallResponse<()> {
        contract.methods().set_decimals(asset,decimals).call().await.unwrap()
    }

    pub async fn setup_compv(contract: &Compv<WalletUnlocked>, recipient: Identity, sub_id: Bits256, asset: AssetId, name: String, symbol: String, decimals: u8) {
        contract
            .methods()
            .mint(recipient,Some(sub_id),1)
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await
            .unwrap();
        contract.methods().set_name(asset,name).call().await.unwrap();
        contract.methods().set_symbol(asset,symbol).call().await.unwrap();
        contract.methods().set_decimals(asset,decimals).call().await.unwrap();
    }

    pub async fn configure_compv(contract: &VaultConnector<WalletUnlocked>, contract_id: ContractId) {
        contract.methods().configure_compv(contract_id).with_contract_ids(&[contract_id.clone().into()]).call().await.unwrap().value
    }

    pub async fn deposit_collateral(contract: &VaultConnector<WalletUnlocked>, user: Identity, asset_id: AssetId, amount: u64) -> u64 {
        contract
            .methods()
            .deposit_collateral(user.clone())
            .call_params(
                CallParameters::default()
                .with_amount(amount)
                .with_asset_id(asset_id)
            )
            .unwrap()
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await.unwrap().value
    }

    pub async fn borrow_a(contract: &VaultConnector<WalletUnlocked>, user: Identity, asset_id: AssetId, borrow_asset_id: AssetId, amount: u64) -> u64 {
        contract
            .methods()
            .borrow_a(user.clone(), borrow_asset_id)
            .call_params(
                CallParameters::default()
                .with_amount(amount)
                .with_asset_id(asset_id)
            )
            .unwrap()
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await.unwrap().value
    }

    pub async fn deposit(contract: &VaultConnector<WalletUnlocked>, receiver: Identity, vault_sub_id: Bits256, asset_id: AssetId, amount: u64) -> u64 {
        contract
            .methods()
            .deposit(receiver.clone(), vault_sub_id)
            .call_params(
                CallParameters::default()
                .with_amount(amount)
                .with_asset_id(asset_id)
            )
            .unwrap()
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await.unwrap().value
    }
}

pub mod test_helpers {

    use super::*;
    use paths::{COMPV_CONTRACT_BINARY_PATH,VAULT_CONTRACT_BINARY_PATH};

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
        
        // Deploy Native asset contracts
        let compv_id =
            Contract::load_from(COMPV_CONTRACT_BINARY_PATH, LoadConfiguration::default())
                .unwrap()
                .deploy(&wallets[0], TxPolicies::default())
                .await
                .unwrap();

        
        // Configure Asset Ids for Vault-Connector
        let configurables = VaultConnectorConfigurables::default()
            .with_COMPV_CONTRACT_ID(compv_id.clone().into()).unwrap();

        // Deploy vault-connector
        let vault_id =
            Contract::load_from(VAULT_CONTRACT_BINARY_PATH, LoadConfiguration::default().with_configurables(configurables))
                .unwrap()
                .deploy(&wallets[0], TxPolicies::default())
                .await
                .unwrap();

        let user = Metadata {
            vaultconn: VaultConnector::new(vault_id, wallets[0].clone()),
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
    use super::{test_helpers::{setup,get_asset_id}, abi_calls::{owner,constructor,name,set_name,setup_compv}, *};

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

        set_name(&user.compv, AssetId::default(), String::from("Compound V")).await;
        assert_eq!(
            name(&user.compv, AssetId::default()).await,
            Some(String::from("Compound V"))
        );
    }

    #[tokio::test]
    async fn can_setup_compv() {
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

        
        let sub_id_1 = Bytes32::from([1u8; 32]);
        let asset_id = get_asset_id(sub_id_1,user.compv.contract_id().into());
        let recipient = Identity::Address(_wallets[1].address().into());
        
        assert_eq!(name(&user.compv, asset_id).await, None);

        setup_compv(
            &user.compv,
            recipient,
            Bits256(*sub_id_1),
            asset_id,
            String::from("Compound V"),
            String::from("COMPV"),
            9u8
        ).await;

        assert_eq!(
            name(&user.compv, asset_id).await,
            Some(String::from("Compound V"))
        );
    }
}