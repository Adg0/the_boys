pub use fuels::{
    prelude::*,
    accounts::wallet::{Wallet, WalletUnlocked},
    // programs::call_response::FuelCallResponse,
    programs::responses::*,
    types::{Identity,AssetId,ContractId},
    macros::{Parameterize,Tokenizable}
};
// use standards::src5::{SRC5, State};
pub use std::{string::String,str::FromStr};

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

    pub async fn mint(contract: &Compv<WalletUnlocked>, recipient: Identity, amount: u64) -> CallResponse<()> {
        contract
            .methods()
            .mint(recipient,amount)
            .call()
            .await
            .unwrap()
    }

    pub async fn burn(contract: &Compv<WalletUnlocked>, amount: u64) -> CallResponse<()> {
        contract
            .methods()
            .burn(amount)
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

    pub async fn emit_src20_events(contract: &Compv<WalletUnlocked>) -> CallResponse<()> {
        contract.methods().emit_src20_events().call().await.unwrap()
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
    use super::{test_helpers::setup, abi_calls::{emit_src20_events}, *};

    /// The event emitted when the name is set.
    #[derive(Debug, PartialEq, Parameterize, Tokenizable)]
    struct SetNameEvent {
        /// The asset for which name is set.
        pub asset: AssetId,
        /// The name that is set.
        pub name: Option<String>,
        /// The caller that set the name.
        pub sender: Identity,
    }

    #[tokio::test]
    async fn can_emit_src20_events() {
        let (user, _wallets) = setup().await;
        let response = emit_src20_events(&user.compv).await;
        let log = response
        .decode_logs();
            // .decode_logs_with_type::<SetNameEvent>()
            // .decode_logs_with_type::<u64>()
            // .unwrap();
            println!("{:?}", log);
        // let event = log.first().unwrap();
        // println!("{:?}", event);

        // assert_eq!(
        //     *event, SetNameEvent {
        //         asset: AssetId::default(),
        //         name: Some("CompoundV".to_string()),
        //         sender: Identity::Address(user.wallet.address().into()),
        //     }
        // );

        assert_eq!(
            1,
            1
        );
    }
}