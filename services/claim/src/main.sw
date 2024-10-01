predicate;

use std::{
    identity::Identity,
    block::{ height, timestamp },
    auth::msg_sender,
    constants::*,
};

struct Slot0 {
    epochId: u16, // intentionally overflowable
    initPrice: u64,
    startTime: u64,
}

configurable {
    epochPeriod: u64 = timestamp() + 2_628_000,
    priceMultiplier: u64 = 12 * 10 ** 17,
    minInitPrice: u64 = 10**7,
    // sale: Slot0 = Slot0 {
    //     epochId: 0,
    //     initPrice: 1,
    //     startTime: timestamp(),
    // },
}

fn main() -> bool {
    const MIN_EPOCH_PERIOD = 3_600; // 1 hour
    const MAX_EPOCH_PERIOD = 31_536_000; // 365 days
    const MIN_PRICE_MULTIPLIER = 11*10**17; // Should at least be 110% of settlement price
    const MAX_PRICE_MULTIPLIER = 3*10**18; // Should not exceed 300% of settlement price
    const ABS_MIN_INIT_PRICE = 10**6; // Minimum sane value for init price
    const ABS_MAX_INIT_PRICE = 10**10; // chosen so that initPrice * priceMultiplier does not overflow
    const PRICE_MULTIPLIER_SCALE = 10**18;

    // check & revert if time has passed deadline
    // check & revert if no assets are being claimed
    // check & revert if epochId doesn't match

    // let sender: Identity = msg_sender().unwrap();
    let mut sale = Slot0 {
        epochId: 0,
        initPrice: 1,
        startTime: timestamp(),
    };

    let timePassed: u64 = timestamp() - sale.startTime;

    let mut paymentAmount: u64 = sale.initPrice - sale.initPrice * timePassed / epochPeriod;
   
    if (timePassed > epochPeriod || paymentAmount < 0) {
        return false;
    }


    // check & revert if payment amount would overflow

   /* if (paymentAmount > 0) {
        // Transfer full balance to buyer
        // transfer(sender, asset_id, paymentAmount);
    }*/

    // Setup new auction
    let mut newInitPrice: u64 = paymentAmount * priceMultiplier / PRICE_MULTIPLIER_SCALE;

    if (newInitPrice > ABS_MAX_INIT_PRICE) {
        newInitPrice = ABS_MAX_INIT_PRICE;
    } else if (newInitPrice < minInitPrice) {
        newInitPrice = minInitPrice;
    }

    sale.epochId = sale.epochId+1;
    sale.initPrice = newInitPrice;
    sale.startTime = timestamp();

    true
}

fn get_price_from_cache(slot0: Slot0) -> u64 {
    let timePassed: u64 = timestamp() - slot0.startTime;

    if (timePassed > epochPeriod) {
        return 0;
    }

    slot0.initPrice - slot0.initPrice * timePassed / epochPeriod
}
