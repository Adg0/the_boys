use fuels::{prelude::*, types::{ContractId,Bits256,AssetId,Identity}};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/src-6-vault-connector-abi.json"
));

async fn get_contract_instance() -> (MyContract<WalletUnlocked>, ContractId, WalletUnlocked, WalletUnlocked) {
    let base_asset_id: AssetId =
    "0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c".parse().unwrap();
    let asset_ids = [AssetId::zeroed(), base_asset_id];
    let asset_configs = asset_ids
    .map(|id| AssetConfig {
        id,num_coins: 1,
        coin_amount: 1_000_000_000,
    })
    .into();
 
    let wallet_config = WalletsConfig::new_multiple_assets(2, asset_configs);
    
    // Launch a local network and deploy the contract
    let wallets = launch_custom_provider_and_get_wallets(
        wallet_config,
        None,
        None,
    )
    .await.unwrap();
    let wallet = &wallets[0];
    let lpwallet = &wallets[1];

    let id = Contract::load_from(
        "./out/debug/src-6-vault-connector.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = MyContract::new(id.clone(), wallet.clone());

    (instance, id.into(), wallet.clone(), lpwallet.clone())
}

#[tokio::test]
async fn can_get_contract_id() {
    let (_instance, _id, _wallet, _lpwallet) = get_contract_instance().await;
    // Now you have an instance of your contract you can use to test each function

    println!("Contract deployed @ {_id}");
}

#[tokio::test]
async fn test_deposit_collateral() -> Result<()> {
    let (_instance, _id, wallet, _lpwallet) = get_contract_instance().await;
    
    // Define the user
    let user = Identity::Address(wallet.address().into());
    // Define sub_id and recipient
    let sub_id_array = [1u8; 32];
    let sub_id = Bits256(sub_id_array);

    let base_asset_id: AssetId =
    "0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c".parse()?;
    
 

    let deposit_amount = 1_000_000;
    let call_params = CallParameters::default()
        .with_amount(deposit_amount)
        .with_asset_id(base_asset_id);
         
    let response = _instance
        .methods()
        .deposit_collateral(user.clone())
        .call_params(call_params)?
        .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
        .call()
        .await?;
    let logs = response.decode_logs();
    println!("{:?}", logs);
    // Check the result for the number of minted shares
    let collateral = response.value;
    // assert!(collateral > 0, "Collateral deposit should be greater than 0");
    println!("Collateral-1: {collateral}");
    let lp_asset_id = AssetId::zeroed();

    let lp_token_balance = _instance.methods()
    .get_balance(lp_asset_id)
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await?
    .value;
    println!("Asset balance-1: {lp_token_balance}");

    let deposit_amount = 1_000;
    let call_params = CallParameters::default()
        .with_amount(deposit_amount)
        .with_asset_id(AssetId::zeroed());
    let response = _instance
        .methods()
        .deposit(Identity::Address(_lpwallet.address().into()).clone(), sub_id)
        .call_params(call_params)?
        .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
        .call()
        .await?;
    let collateral = response.value;
    // assert!(collateral > 0, "Collateral deposit should be greater than 0");
    println!("Deposit to SRC6: {collateral}");
    let lp_token_balance = _instance.methods()
    .get_balance(lp_asset_id)
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await?
    .value;
    println!("Asset balance-2: {lp_token_balance}");

    let borrow_amount = 1_000;
    let call_params = CallParameters::default()
        .with_amount(borrow_amount)
        .with_asset_id(base_asset_id);
    let response = _instance
        .methods()
        .borrow_a(user.clone(),AssetId::zeroed())
        .call_params(call_params)?
        .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
        .call()
        .await?;
    let borrow = response.value;
    let logs = response.decode_logs();
    println!("{:?}", logs);
    println!("User debt: {borrow}");

    let lp_token_balance = _instance.methods()
    .get_balance(lp_asset_id)
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await?
    .value;
    println!("Asset balance-3: {lp_token_balance}");

    let repay_amount = 1_000;
    let call_params = CallParameters::default()
        .with_amount(repay_amount)
        .with_asset_id(AssetId::zeroed());
    let response = _instance
        .methods()
        .repay(user.clone())
        .call_params(call_params)?
        .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
        .call()
        .await?;
    let repay = response.value;
    let logs = response.decode_logs();
    println!("{:?}", logs);
    println!("Remaining debt: {repay}");

    let lp_token_balance = _instance.methods()
    .get_balance(lp_asset_id)
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await?
    .value;
    println!("Asset balance final: {lp_token_balance}");
    
    Ok(())
}

#[tokio::test]
async fn test_deposit_and_withdraw() -> Result<()> {
    let (_instance, _id, wallet, _lpwallet) = get_contract_instance().await;
    
    // Define the receiver and vault_sub_id
    let receiver = Identity::Address(wallet.address().into());
    // Define sub_id and recipient
    let sub_id_array = [1u8; 32];
    let sub_id = Bits256(sub_id_array);
    // let vault_sub_id = SubId::default();

    // let base_asset_id: AssetId =
    // "0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c".parse()?;
    // max_depositable
    println!("Running max_depositable ...");
    // let lp_asset_id = _id.asset_id(&Bits256::zeroed());
    // let lp_token_balance = wallet.get_asset_balance(&lp_asset_id).await.unwrap();
 
    let call_params = CallParameters::default()
    .with_asset_id(AssetId::zeroed());
 
    let response = _instance
    .methods()
    .max_depositable(receiver.clone(), AssetId::zeroed(), sub_id)
    .call_params(call_params).unwrap()
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await.unwrap();

    // Handle the Option<u64> result
    match response.value {
        Option::Some(value) => println!("Max_Deposit_Value: {}", value),
        Option::None => println!("No value returned"),
    }
 

    let deposit_amount = 1_000_000;
    let call_params = CallParameters::default()
        .with_amount(deposit_amount)
        .with_asset_id(AssetId::zeroed());
         
    let response = _instance
        .methods()
        .deposit(receiver.clone(), sub_id)
        .call_params(call_params)?
        .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
        .call()
        .await?;
    let logs = response.decode_logs();
    println!("{:?}", logs);
    // Check the result for the number of minted shares
    let minted_shares = response.value;
    assert!(minted_shares > 0, "Minted shares should be greater than 0");
    println!("Shares minted: {minted_shares}");

    // max_withdrawable
// println!("Running max_withdrawable ...");
// // let lp_asset_id = _id.asset_id(&Bits256::zeroed());
// // let lp_token_balance = wallet.get_asset_balance(&lp_asset_id).await.unwrap();

// let call_params = CallParameters::default()
// // .with_amount(lp_token_balance)
// .with_asset_id(AssetId::zeroed());

// let response = _instance
// .methods()
// .max_withdrawable(AssetId::zeroed(), sub_id)
// .call_params(call_params).unwrap()
// .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
// .call()
// .await.unwrap();

// // Handle the Option<u64> result
// match response.value {
//     Option::Some(value) => println!("Value_Max_Withdraw: {}", value),
//     Option::None => println!("No value returned"),
// }

// let base_balance = wallet.get_asset_balance(&base_asset_id).await.unwrap();
// let logs = response.decode_logs();
// println!("{:?}", logs);
// assert_eq!(base_balance, deposit_amount);
    let result = _instance
    .methods()
    .preview_share(AssetId::zeroed(),sub_id)
    // .call_params(CallParameters::default())?
    // .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await?;

    let (share_asset_id, _share_asset_vault_sub_id) = result.value;
    println!("Share AssetId: {}", share_asset_id);
    // println!("Share_asset Vault Sub_id: {}", _share_asset_vault_sub_id);
    let result = _instance
    .methods()
    .preview_wi(share_asset_id)
    .call_params(CallParameters::default().with_amount(100))?
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await?;
    println!("Share withdraw: {}", result.value);
    // let share_asset_id = _id.asset_id(&Bits256::zeroed());
    // let lp_token_balance = wallet.get_asset_balance(&lp_asset_id).await.unwrap();
    let call_params = CallParameters::default()
    .with_amount(deposit_amount)
    .with_asset_id(share_asset_id);
 
    let response = _instance
    .methods()
    .withdraw(receiver.clone(), AssetId::zeroed(), sub_id)
    .call_params(call_params)?
    .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
    .call()
    .await?;

    println!("Withdrawn: {}", response.value);

    // Handle the Option<u64> result
    // match response.value {
    //     Option::Some(value) => println!("Max_Deposit_Value: {}", value),
    //     Option::None => println!("No value returned"),
    // }

    Ok(())
}

// #[tokio::test]
// async fn test_deposit() -> Result<()> {
//     let (_instance, _id, wallet) = get_contract_instance().await;
    
//     // Define the receiver and vault_sub_id
//     let receiver = Identity::Address(wallet.address().into());
//     // Define sub_id and recipient
//     let sub_id_array = [1u8; 32];
//     let sub_id = Bits256(sub_id_array);
//     // let vault_sub_id = SubId::default();

//     // let base_asset_id: AssetId =
//     // "0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c".parse()?;
//     // max_depositable
//     println!("Running max_depositable ...");
 
//     let call_params = CallParameters::default()
//     .with_asset_id(AssetId::zeroed());
 
//     let response = _instance
//     .methods()
//     .max_depositable(receiver.clone(), AssetId::zeroed(), sub_id)
//     .call_params(call_params).unwrap()
//     .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
//     .call()
//     .await.unwrap();

//     // Handle the Option<u64> result
//     match response.value {
//         Option::Some(value) => println!("Max_Deposit_Value: {}", value),
//         Option::None => println!("No value returned"),
//     }
 

//     let deposit_amount = 1_000_000;
//     let call_params = CallParameters::default()
//         .with_amount(deposit_amount)
//         .with_asset_id(AssetId::zeroed());
         
//     let response = _instance
//         .methods()
//         .deposit(receiver.clone(), sub_id)
//         .call_params(call_params)?
//         .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
//         .call()
//         .await?;
//     let logs = response.decode_logs();
//     println!("{:?}", logs);
//     // Check the result for the number of minted shares
//     let minted_shares = response.value;
//     assert!(minted_shares > 0, "Minted shares should be greater than 0");

//     Ok(())
// }
