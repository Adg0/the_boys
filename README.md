<p align="center">
  <img src="./docs/vaught.png" width="20%" alt="THE_BOYS-logo">
</p>
<p align="center">
    <h1 align="center">THE_BOYS</h1>
</p>
<p align="center">
    <em><code>❯ :warning: *This is a proof of concept, not to be used in production environment.*</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/Adg0/the_boys?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Adg0/the_boys?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Adg0/the_boys?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Adg0/the_boys?style=flat&color=0080ff" alt="repo-language-count">
</p>
<p align="center">
		<em>Built with the tools and technologies:</em>
</p>
<p align="center">
	<a href="https://crates.io/crates/forc/0.64.0" alt="forc">
        <img src="https://img.shields.io/badge/forc-v0.64.0-orange" />
    </a>
    <a href="https://crates.io/crates/fuel-core/0.36.0" alt="fuel-core">
        <img src="https://img.shields.io/badge/fuel--core-v0.36.0-yellow" />
    </a>
	<img src="https://img.shields.io/badge/GraphQL-E10098.svg?style=flat&logo=GraphQL&logoColor=white" alt="GraphQL">
	<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
	<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" alt="YAML">
	<br>
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/Rust-000000.svg?style=flat&logo=Rust&logoColor=white" alt="Rust">
</p>

<br>

##### Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
  - [ Prerequisites](#-prerequisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Tests](#-tests)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

---

## Overview

<p>
The Boys is an onchain DeFi borrow/lend platform.

Borrowers are incentivized with Compound-V token.

The utility of Compound-V token is a share of protocol revenue.

The project is implemented using SRC6 vaults, predicates and envio indexer.</p>

---

## Repository Structure

```sh
└── the_boys/
    ├── README.md
    ├── contracts
    │   ├── asset_lib
    │   ├── comp-v
    │   ├── lending-market
    │   ├── oracle
    │   ├── oracle_lib
    │   └── src-6-vault-connector
    ├── docs
    │   ├── ...
    ├── frontend
    │   ├── .gitignore
    │   ├── README.md
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── images
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── public
    │   ├── src
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    └── services
        ├── claim
        ├── feeConverter
        └── vault-indexer
```

---

## Modules

<details closed><summary>services.claim</summary>

| File                                                                         | Summary                               |
| ---------------------------------------------------------------------------- | ------------------------------------- |
| [claim](https://github.com/Adg0/the_boys/blob/main/services/claim/README.md) | <code>❯ Instructions for setup</code> |

</details>

<details closed><summary>services.claim.src</summary>

| File                                                                             | Summary                                |
| -------------------------------------------------------------------------------- | -------------------------------------- |
| [main.sw](https://github.com/Adg0/the_boys/blob/main/services/claim/src/main.sw) | <code>❯ predicate main function</code> |

</details>

<details closed><summary>services.indexer.abi</summary>

| File                                                                                                                             | Summary                                |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [src-6-vault-connector-abi.json](https://github.com/Adg0/the_boys/blob/main/services/indexer/abi/src-6-vault-connector-abi.json) | <code>❯ Json abi file for envio</code> |
| [lending-market-abi.json](https://github.com/Adg0/the_boys/blob/main/services/indexer/abi/lending-market-abi.json)               | <code>❯ Json abi file for envio</code> |

</details>

<details closed><summary>services.indexer.vault-indexer</summary>

| File                                                                                                       | Summary                                  |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [schema.graphql](https://github.com/Adg0/the_boys/blob/main/services/indexer/vault-indexer/schema.graphql) | <code>❯ vault schema</code>              |
| [.env.example](https://github.com/Adg0/the_boys/blob/main/services/indexer/vault-indexer/.env.example)     | <code>❯ .env cp for vault-indexer</code> |

</details>

<details closed><summary>services.indexer.vault-indexer.abis</summary>

| File                                                                                                        | Summary                            |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [svc-abi.json](https://github.com/Adg0/the_boys/blob/main/services/indexer/vault-indexer/abis/svc-abi.json) | <code>❯ vault-connector abi</code> |

</details>

<details closed><summary>services.indexer.vault-indexer.test</summary>

| File                                                                                              | Summary                               |
| ------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Test.ts](https://github.com/Adg0/the_boys/blob/main/services/indexer/vault-indexer/test/Test.ts) | <code>❯ Test for vault-indexer</code> |

</details>

<details closed><summary>services.feeConverter</summary>

| File                                                                                  | Summary                   |
| ------------------------------------------------------------------------------------- | ------------------------- |
| [build.rs](https://github.com/Adg0/the_boys/blob/main/services/feeConverter/build.rs) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>frontend</summary>

| File                                                                    | Summary                          |
| ----------------------------------------------------------------------- | -------------------------------- |
| [Readme](https://github.com/Adg0/the_boys/blob/main/frontend/README.md) | <code>❯ Setup instruction</code> |

</details>

<details closed><summary>contracts.asset_lib.src</summary>

| File                                                                                | Summary                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [lib.sw](https://github.com/Adg0/the_boys/blob/main/contracts/asset_lib/src/lib.sw) | <code>❯ Library for ownership based multi-asset SRC20</code> |

</details>

<details closed><summary>contracts.oracle_lib</summary>

| File                                                                                   | Summary                                        |
| -------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [README.md](https://github.com/Adg0/the_boys/blob/main/contracts/oracle_lib/README.md) | <code>❯ See README for test instruction</code> |

</details>

<details closed><summary>contracts.oracle_lib.src</summary>

| File                                                                                 | Summary                                                   |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| [lib.sw](https://github.com/Adg0/the_boys/blob/main/contracts/oracle_lib/src/lib.sw) | <code>❯ Library for Oracle, to import in contracts</code> |

</details>

<details closed><summary>contracts.comp-v.src</summary>

| File                                                                                         | Summary                       |
| -------------------------------------------------------------------------------------------- | ----------------------------- |
| [interface.sw](https://github.com/Adg0/the_boys/blob/main/contracts/comp-v/src/interface.sw) | <code>❯ ABI's </code>         |
| [main.sw](https://github.com/Adg0/the_boys/blob/main/contracts/comp-v/src/main.sw)           | <code>❯ Contract code </code> |
| [events.sw](https://github.com/Adg0/the_boys/blob/main/contracts/comp-v/src/events.sw)       | <code>❯ LogEvents </code>     |
| [errors.sw](https://github.com/Adg0/the_boys/blob/main/contracts/comp-v/src/errors.sw)       | <code>❯ Error </code>         |

</details>

<details closed><summary>contracts.oracle.src</summary>

| File                                                                                                     | Summary                  |
| -------------------------------------------------------------------------------------------------------- | ------------------------ |
| [interface.sw](https://github.com/Adg0/the_boys/blob/main/contracts/oracle/src/interface.sw)             | <code>❯ ABI's</code>     |
| [data_structures.sw](https://github.com/Adg0/the_boys/blob/main/contracts/oracle/src/data_structures.sw) | <code>❯ Structs </code>  |
| [main.sw](https://github.com/Adg0/the_boys/blob/main/contracts/oracle/src/main.sw)                       | <code>❯ Contract</code>  |
| [events.sw](https://github.com/Adg0/the_boys/blob/main/contracts/oracle/src/events.sw)                   | <code>❯ LogEvents</code> |
| [errors.sw](https://github.com/Adg0/the_boys/blob/main/contracts/oracle/src/errors.sw)                   | <code>❯ Errors </code>   |

</details>

<details closed><summary>contracts.src-6-vault-connector.src</summary>

| File                                                                                                        | Summary                                |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [interface.sw](https://github.com/Adg0/the_boys/blob/main/contracts/src-6-vault-connector/src/interface.sw) | <code>❯ ABI for Vault-connector</code> |
| [main.sw](https://github.com/Adg0/the_boys/blob/main/contracts/src-6-vault-connector/src/main.sw)           | <code>❯ Contract</code>                |
| [events.sw](https://github.com/Adg0/the_boys/blob/main/contracts/src-6-vault-connector/src/events.sw)       | <code>❯ LogEvents</code>               |

</details>

---

## Getting Started

### Prerequisites

**Forc**: `>0.64.0`

**Node**: `v20.12.2`

**Rust**: `rustc 1.81.0`

### Installation

Build the project from source:

1. Clone the the_boys repository:

```sh
❯ git clone https://github.com/Adg0/the_boys
```

2. Navigate to the project directory:

```sh
❯ cd the_boys
```

3. Run Makefile:

```sh
❯ make
```

### Usage

To run the project, execute the following command:

```sh
❯ make build_frontend
```

### Tests

Execute the test suite using the following command:

```sh
❯ make test
```

---

## Project Roadmap

- [x] **`Task 1`**: <strike>Complete contract codes.</strike>
- [ ] **`Task 2`**: Integrate contract with frontend.

---

## Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/Adg0/the_boys/issues)**: Submit bugs found or log feature requests for the `the_boys` project.
- **[Submit Pull Requests](https://github.com/Adg0/the_boys/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/Adg0/the_boys/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Adg0/the_boys
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'new: Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Adg0/the_boys/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Adg0/the_boys">
   </a>
</p>
</details>

---

## Features

### Fee converter

Protocols in decentralised finance (DeFi) often generate revenues by accruing fees across a range of markets in a variety of different asset types. The default behaviour of the protocol will typically be to hold all these asset types on the protocol’s balance sheet as protocol-owned liquidity (POL). However, this will often be a suboptimal use of accrued fees.

#### Dutch Auction

The mechanism involves a Dutch auction where the price starts high and decreases over time. The first person to pay the auction price at a certain point is allowed to claim all the assets in the treasury. 

![dutch-auction][def0]

#### Equation

Initial price starts high and as time passes the price drops by a factor of the maximum period(epochPeriod).

$$ price = initPrice - initPrice * timePassed / epochPeriod $$

### Indexer

Installation:
```bash
$ cd vault-indexer
$ pnpm codegen
$ pnpm dev
```

### Claim Revenue

Similar to fee converter but the assets are held in a predicate.

![Compound-V][def]

### Gallery

![Vault][def1]
![Borrowing Flow][def2]
![Liquidation Flow][def3]
![Temp-V][def4]

[def]: ./docs/compv.png
[def1]: ./docs/vault.png
[def2]: ./docs/borrow.png
[def3]: ./docs/liquidation.png
[def4]: ./docs/tempv.png

---

## License

This project is `unlicense` License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/unlicense/) file.

---
