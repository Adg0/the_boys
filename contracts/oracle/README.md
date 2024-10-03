<p align="center">
    <h1 align="center">Oracle</h1>
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

Oracles provide blockchain applications access to off-chain information such as asset prices, and verifiable random numbers. Oracles allow blockchain applications to react to real-world events such as a price drop in collateral. This oracle provides price data about for multiple assets through mapping `price_of(asset)`, and assumes a decimal precision of 1e9.

## Project structure

The project consists of an oracle smart contract and an oracle node which interacts with the oracle.

<!--Only show most important files e.g. script to run, build etc.-->

```sh
oracle
├── src
│   ├── data_structures.sw
│   ├── errors.sw
│   ├── events.sw
│   ├── interface.sw
│   └── main.sw
├── tests
│   ├── functions/get_price.rs
│   ├── functions/mod.rs
│   ├── functions/owner.rs
│   ├── functions/price.rs
│   ├── functions/set_price.rs
│   └── harness.rs
└── README.md
```

## Running the project

### Oracle contract

#### Program compilation

```bash
forc build
```

#### Running the tests

Before running the tests the programs must be compiled with the command above.

```bash
cargo test -- --nocapture
```
