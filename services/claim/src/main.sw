predicate;

fn main() -> bool {
    let b256_address = 0x74a8fe8189007f645896d752b4019032473d44526ce251d2e4fa001cf3942291;
    let claim_controller = Identity::Address(Address::from(b256_address));
    if msg_sender().unwrap() == claim_controller {
        return true;
    }
    false
}
