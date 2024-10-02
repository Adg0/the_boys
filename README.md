# The Boys DeFi - Fuel hackathon

:warning: *This is a proof of concept, not to be used in production environment.*

## Summary

The Boys is an onchain DeFi borrow/lend platform.

Borrowers are incentivized with Compound-V token.

The utility of Compound-V token is a share of protocol revenue.

The project is implemented using ERC-4626 vaults, predicates and envio indexer.

## Claim and Fee converter

Protocols in decentralised finance (DeFi) often generate revenues by accruing fees across a range of markets in a variety of different asset types. The default behaviour of the protocol will typically be to hold all these asset types on the protocol’s balance sheet as protocol-owned liquidity (POL). However, this will often be a suboptimal use of accrued fees.

### Dutch Auction

The mechanism involves a Dutch auction where the price starts high and decreases over time. The first person to pay the auction price at a certain point is allowed to claim all the assets in the treasury. 

![Compound-V][def]

## Equation

$$ initPrice - initPrice * timePassed / epochPeriod $$

## Gallery

![Vault][def1]
![Borrowing Flow][def2]
![Liquidation Flow][def3]
![Temp-V][def4]

[def]: ./docs/compv.png
[def1]: ./docs/vault.png
[def2]: ./docs/borrow.png
[def3]: ./docs/liquidation.png
[def4]: ./docs/tempv.png