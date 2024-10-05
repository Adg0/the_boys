contract;

mod data_structures;
mod errors;
mod events;
mod interface;

use ::data_structures::State;
use ::errors::AccessError;
use ::events::{PriceOfUpdateEvent, PriceUpdateEvent};
use ::interface::Oracle;
use std::hash::Hash;

/// The Owner of this contract at deployment.
#[allow(dead_code)]
const INITIAL_OWNER: Address = Address::from(0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db);

configurable {
    /// Owner of the contract.
    OWNER: Identity = Identity::Address(INITIAL_OWNER),
}

storage {
    /// Current price of tracked asset.
    price: Option<u64> = Option::None,
    /// Current price of mapped asset
    price_of: StorageMap<AssetId, u64> = StorageMap {},
}

impl Oracle for Contract {
    fn owner() -> Identity {
        OWNER
    }

    #[storage(read)]
    fn price() -> Option<u64> {
        match storage.price.try_read() {
            Option::Some(price) => price,
            Option::None => Option::None,
        }
    }

    #[storage(write)]
    fn set_price_of(price: u64, asset_id: AssetId) {
        require(msg_sender().unwrap() == OWNER, AccessError::NotOwner);

        storage.price_of.insert(asset_id, price);

        log(price);
        log(PriceOfUpdateEvent {
            price,
            asset: asset_id,
        });
    }

    #[storage(read)]
    fn get_price_of(asset_id: AssetId) -> u64 {
        storage.price_of.get(asset_id).read()
    }

    #[storage(write)]
    fn set_price(price: u64) {
        require(msg_sender().unwrap() == OWNER, AccessError::NotOwner);

        storage.price.write(Option::Some(price));

        log(PriceUpdateEvent { price });
    }
}
