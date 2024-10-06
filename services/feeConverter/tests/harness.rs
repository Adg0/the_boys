use fuels::{prelude::*, types::ContractId};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/feeConverter-abi.json"
));

async fn get_contract_instance() -> (MyContract<WalletUnlocked>, ContractId, WalletUnlocked) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./out/debug/feeConverter.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MyContract::new(id.clone(), wallet.clone());

    let (_tx_id, _receipts) = wallet
            .force_transfer_to_contract(
                &id.clone(),
                1_000_000,
                AssetId::zeroed(),
                TxPolicies::default(),
            )
            .await.unwrap();
    let contract_balances = wallet
            .try_provider().unwrap()
            .get_contract_balances(&id.clone())
            .await.unwrap();
    println!("Starting Contract balance = {:?}", contract_balances);
    let balance: u64 = wallet.get_asset_balance(&AssetId::zeroed()).await.unwrap();
    println!("Starting wallet Balance: {:?}", balance);
    (instance, id.into(), wallet)
}

#[tokio::test]
async fn can_get_contract_id() {
    let (instance, _id, wallet) = get_contract_instance().await;

    // Now you have an instance of your contract you can use to test each function
    let call_params = CallParameters::default()
        .with_amount(1_000_000)
        .with_asset_id(AssetId::zeroed());
    let mut asset_ids: Vec<AssetId> = Vec::new();
    asset_ids.push(AssetId::zeroed());

    let auction = instance.methods()
        .buy(asset_ids.clone())
        .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
        .call_params(call_params.clone()).unwrap().call().await;
    let contract_balances =wallet
        .try_provider().unwrap()
        .get_contract_balances(&_id.clone().into())
        .await.unwrap();
    // assert!(contract_balances.is_empty());

    let log = auction.expect("REASON").decode_logs_with_type::<Slot>();
    println!("Logs: {:?}", log);

    // println!("Return Auction: {:?}", auction);
    println!("Contract Balance: {:?}", contract_balances);
    let balance: u64 = wallet.get_asset_balance(&AssetId::zeroed()).await.unwrap();
    println!("Wallet Balance: {:?}", balance);
}
