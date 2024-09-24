use fuels::{prelude::*, types::{ContractId,Bits256}};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/lending-market-abi.json"
));


async fn get_contract_instance() -> (MyContract<WalletUnlocked>, Bech32ContractId, WalletUnlocked) {
    let base_asset_id: AssetId =
    "0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c".parse().unwrap();
    let asset_ids = [AssetId::zeroed(), base_asset_id];
    let asset_configs = asset_ids
    .map(|id| AssetConfig {
        id,num_coins: 1,
        coin_amount: 1_000_000,
    })
    .into();
 
    let wallet_config = WalletsConfig::new_multiple_assets(1, asset_configs);
    
    // Launch a local network and deploy the contract
    let wallets = launch_custom_provider_and_get_wallets(
        wallet_config,
        None,
        None,
    )
    .await.unwrap();
    let wallet = &wallets[0];

    let id = Contract::load_from(
        "./out/debug/lending-market.bin",
        LoadConfiguration::default(),
    ).unwrap()
    .deploy(wallet, TxPolicies::default())
    .await.unwrap();

    let instance = MyContract::new(id.clone(), wallet.clone());

    (instance, id, wallet.clone())
}

#[tokio::test]
async fn can_get_contract_id() {
    let (_instance, _id, wallet) = get_contract_instance().await;
    let base_asset_id: AssetId =
    "0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c".parse().unwrap();
    // Now you have an instance of your contract you can use to test each function
    
    let deposit_amount = 1_000_000;
    let call_params = CallParameters::default()
        .with_amount(deposit_amount)
        .with_asset_id(base_asset_id);
         
    let response = _instance
        .methods()
        .deposit(wallet.address().into())
        .call_params(call_params).unwrap()
        .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
        .call()
        .await.unwrap();
    let logs = response.decode_logs();
    println!("{:?}", logs);

    // Withdraw
    println!("Running withdraw...");
    let lp_asset_id = _id.asset_id(&Bits256::zeroed());
    let lp_token_balance = wallet.get_asset_balance(&lp_asset_id).await.unwrap();
 
    let call_params = CallParameters::default()
    .with_amount(lp_token_balance)
    .with_asset_id(lp_asset_id);
 
    let response = _instance
    .methods()
    .withdraw(wallet.address().into())
    .call_params(call_params).unwrap()
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await.unwrap();
 
    let base_balance = wallet.get_asset_balance(&base_asset_id).await.unwrap();
    let logs = response.decode_logs();
    println!("{:?}", logs);
    assert_eq!(base_balance, deposit_amount);
}
