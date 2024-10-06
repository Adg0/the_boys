contract;

use std::{
    asset::transfer,
    call_frames::msg_asset_id,
    context::{
        msg_amount,
        this_balance,
    },
    block::{ height, timestamp },
    hash::Hash,
};

abi FeeConverter {
    fn get_price(initPrice: u64, startTime: u64) -> u64;
    #[payable]
    #[storage(read,write)]
    fn buy(asset_ids: Vec<AssetId>) -> u64;
}

pub struct Slot {
    pub epochId: u16, // intentionally overflowable
    pub initPrice: u64,
    pub startTime: u64,
}

storage {
    pricing: StorageMap<u16, Slot> = StorageMap {},
    epoch: u16 = 0,
}

configurable {
    INITIAL_PRICE: u64 = 1_000_000,
    START_TIME: u64 = 4_611_686_020_155_630_920,
    EPOCH_PERIOD: u64 = 8_640_000,
    PRICE_MULTIPLIER: u64 = 11,
    MIN_INIT_PRICE: u64 = 1_000,
    MAX_INIT_PRICE: u64 = 1_000_000_000_000,
}

impl FeeConverter for Contract {
    fn get_price(initPrice: u64, startTime: u64) -> u64 {
        // time_passed
        let time_passed = timestamp() - startTime;
        if time_passed > EPOCH_PERIOD {
            return 0;
        }
        (initPrice - ((initPrice * time_passed)/ EPOCH_PERIOD))
    }

    #[payable]
    #[storage(read,write)]
    fn buy(asset_ids: Vec<AssetId>) -> u64 {

        let _epoch = storage.epoch.read();
        let mut buy_price = match storage.pricing.get(_epoch).try_read() {
            Some(buy_price) => buy_price,
            None => Slot {
                epochId: _epoch,
                initPrice: INITIAL_PRICE,
                startTime: START_TIME,
            },
        };

        let price = get_price(buy_price.initPrice, buy_price.startTime);
        let amount = msg_amount();
        // assert msg_amount() >= price


        let sender = msg_sender().unwrap();
        for asset_id in asset_ids.iter() {
            // Transfer full balance to buyer
            let balance = this_balance(asset_id);
            transfer(sender, asset_id, balance);
        }

        // Setup new auction
        let mut newInitPrice: u64 = amount * PRICE_MULTIPLIER/10;
        if newInitPrice > MAX_INIT_PRICE {
            newInitPrice = MAX_INIT_PRICE;
        } else if newInitPrice < MIN_INIT_PRICE {
            newInitPrice = MIN_INIT_PRICE;
        }

        // update storages
        buy_price.epochId = buy_price.epochId + 1;
        buy_price.initPrice = newInitPrice;
        buy_price.startTime = timestamp();
        // write to storage
        storage.pricing.insert(buy_price.epochId, buy_price);
        storage.epoch.write(buy_price.epochId);

        log(Slot{
                epochId: buy_price.epochId,
                initPrice: buy_price.initPrice,
                startTime: buy_price.startTime,
            });
        amount
    }
}

fn get_price(initPrice: u64, startTime: u64) -> u64 {
        // time_passed
        let time_passed = timestamp() - startTime;
        if time_passed > EPOCH_PERIOD {
            return 0;
        }
        (initPrice - ((initPrice * time_passed)/ EPOCH_PERIOD))
}
