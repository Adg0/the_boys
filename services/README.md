# Fee converter

Protocols in decentralised finance (DeFi) often generate revenues by accruing fees across a range of markets in a variety of different asset types. The default behaviour of the protocol will typically be to hold all these asset types on the protocol’s balance sheet as protocol-owned liquidity (POL). However, this will often be a suboptimal use of accrued fees.

## Dutch Auction

The mechanism involves a Dutch auction where the price starts high and decreases over time. The first person to pay the auction price at a certain point is allowed to claim all the assets in the treasury. 

![dutch-auction][def1]

### Equation

Initial price starts high and as time passes the price drops by a factor of the maximum period(epochPeriod).

$$ price = initPrice - initPrice * timePassed / epochPeriod $$

## Indexer

Installation:
```bash
$ cd vault-indexer
$ pnpm codegen
$ pnpm dev
```

## Claim Revenue

Similar to fee converter but the assets are held in a predicate.

![Compound-V][def]

[def]: ../docs/compv.png
[def1]: ../docs/dutch.png