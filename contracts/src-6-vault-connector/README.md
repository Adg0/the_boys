<p align="center">
    <h1 align="center">Vault-Connector</h1>
</p>

<p align="center">
    <a href="https://crates.io/crates/forc/0.64.0" alt="forc">
        <img src="https://img.shields.io/badge/forc-v0.64.0-orange" />
    </a>
    <a href="https://crates.io/crates/fuel-core/0.36.0" alt="fuel-core">
        <img src="https://img.shields.io/badge/fuel--core-v0.36.0-yellow" />
    </a>
    <a href="https://crates.io/crates/fuels/0.66.1" alt="forc">
        <img src="https://img.shields.io/badge/fuels-v0.66.1-blue" />
    </a>
</p>

## Overview

SVC is a [Native Asset](https://docs.fuel.network/docs/sway/blockchain-development/native_assets) on the Fuel Network.

The owner is initialized with a `constructor` and the `minting` role is OwnerOnly.

## Standards Implementations

The project implements and follows the [SRC-6; Vault](https://github.com/FuelLabs/sway-standards/blob/master/docs/src/src-6-vault.md), [SRC-20; Native Asset](https://github.com/FuelLabs/sway-standards/blob/master/docs/src/src-20-native-asset.md), [SRC-5; Ownership Standard](https://github.com/FuelLabs/sway-standards/blob/master/docs/src/src-5-ownership.md) and [SRC-3; Mint and Burn](https://github.com/FuelLabs/sway-standards/blob/master/docs/src/src-3-minting-and-burning.md) standards. It also uses the [Native Asset Library](https://docs.fuel.network/docs/sway/blockchain-development/native_assets/) to implement the basic functionality behind the standards.

### SRC-6

a standard API for asset vaults such as yield-bearing asset vaults or asset wrappers. This standard is an add-on to the SRC-20 standard.

The [SRC-6](https://docs.fuel.network/docs/sway-standards/src-6-vault/) ABI defined below has also been implemented.

```sway
abi SRC20 {
    #[payable]
    #[storage(read, write)]
    fn deposit(receiver: Identity, vault_sub_id: SubId) -> u64;
    #[payable]
    #[storage(read, write)]
    fn withdraw(
        receiver: Identity,
        underlying_asset: AssetId,
        vault_sub_id: SubId,
    ) -> u64;
    #[storage(read)]
    fn managed_assets(underlying_asset: AssetId, vault_sub_id: SubId) -> u64;
    #[storage(read)]
    fn max_depositable(
        receiver: Identity,
        underlying_asset: AssetId,
        vault_sub_id: SubId,
    ) -> Option<u64>;
    #[storage(read)]
    fn max_withdrawable(underlying_asset: AssetId, vault_sub_id: SubId) -> Option<u64>;
}
```

## Project structure

The project consists of a smart contract, and unit tests with Fuel Rust-sdk

<!--Only show most important files e.g. script to run, build etc.-->

```sh
src-6-vault-connector
├── src
│   ├── errors.sw
│   ├── events.sw
│   ├── interface.sw
│   └── main.sw
├── tests
│   ├── functions/borrow_asset.rs
│   ├── functions/configure_compv.rs
│   ├── functions/deposit_collateral.rs
│   ├── functions/deposit.rs
│   ├── functions/mod.rs
│   ├── functions/setup.rs
│   ├── functions/total_assets.rs
│   └── harness.rs
├── README.md
└── Forc.toml
```

## Running the project

### Project

#### Program compilation

```bash
forc build
```

#### Running the tests

Before running the tests the programs must be compiled with the command above.

> Note: Copy Comp-v and Oracle ABI

```bash
cp -r ../comp-v/out/debug/* ./out/debug/

cp -r ../oracle/out/debug/* ./out/debug/
```

Run the test with log output.

```bash
cargo test -- --nocapture
```
