############################# HELP MESSAGE #############################
# Make sure the help command stays first, so that it's printed by default when `make` is called without arguments
.PHONY: help tests
help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

-----------------------------: ## 
__NOTE__: ## Build contracts before tests, and cp-build-out before vault-connector test
-----------------------------: ## 
___CONTRACTS___: ## 

build-contracts: ## builds all contracts
	cd contracts && forc build

build-comp-v: ## builds Asset contract
	cd contracts/comp-v && forc build

build-oracle: ## builds Oracle contract
	cd contracts/oracle && forc build

build-src-6-vault-connector: ## builds Vault-Connector contract
	cd contracts/src-6-vault-connector && forc build

-----------------------------: ## 
_____HELPER_____: ## 
cp-build-out: ## copies comp-v, oracle build for vault-connector
	cp -r contracts/comp-v/out/debug/* contracts/src-6-vault-connector/out/debug/
	cp -r contracts/oracle/out/debug/* contracts/src-6-vault-connector/out/debug/

test-comp-v: ## Run Comp-v Native asset test
	./contracts/comp-v-test.sh

test-oracle: ## runs all unit tests for oracle
	cd contracts/oracle && cargo test

test-vault-connector: ## runs all unit tests for src-6-vault-connector
	cd contracts/src-6-vault-connector && cargo test

tests-unit: ## runs all unit tests
	cd contracts && cargo test -- --nocapture

-----------------------------: ## 

____OFFCHAIN_SOFTWARE___: ## 

tests-integration: ## runs all integration tests
	echo "TODO..."
