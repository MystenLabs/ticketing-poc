module ticketing_poc::key_registry_tests;

use sui::{package::Publisher, test_utils::assert_eq};
use ticketing_poc::{
    key_registry::{Self, ESenderNotKeyOwner, EInvalidPublicKeyLength},
    ticket_tests,
    utils::{Self, setup, cleanup}
};

public struct KEY_REGISTRY_TESTS has drop ()

#[test]
fun derive_address_from_pk() {
    assert_eq(key_registry::derive_address_from_pk(&utils::admin_pk()), utils::admin_address());
}

#[test]
fun assert_sender_is_key_owner() {
    let (mut scenario, registry, _loyalty) = setup(utils::admin_address());
    key_registry::assert_sender_is_key_owner(&registry, scenario.ctx());
    cleanup(scenario, registry, _loyalty);
}

#[test, expected_failure(abort_code = ESenderNotKeyOwner)]
fun assert_sender_is_key_owner_fails() {
    let (mut scenario, registry, _loyalty) = setup(@0x0);
    key_registry::assert_sender_is_key_owner(&registry, scenario.ctx());

    abort
}

#[test]
fun set_pk() {
    let (scenario, mut registry, _loyalty) = setup(utils::admin_address());
    let publisher = scenario.take_from_sender<Publisher>();
    assert_eq(registry.pk(), utils::admin_pk());
    key_registry::set_pk(
        &mut registry,
        &publisher,
        x"0000000000000000000000000000000000000000000000000000000000000000",
    );
    assert_eq(registry.pk(), x"0000000000000000000000000000000000000000000000000000000000000000");

    scenario.return_to_sender(publisher);
    cleanup(scenario, registry, _loyalty);
}

#[test, expected_failure(abort_code = EInvalidPublicKeyLength)]
fun set_pk_invalid_length() {
    let (scenario, mut registry, _loyalty) = setup(utils::admin_address());
    let publisher = scenario.take_from_sender<Publisher>();
    key_registry::set_pk(&mut registry, &publisher, vector[0]);
    abort
}

#[test]
fun cleanup_nonces() {
    let (mut scenario, mut registry, mut loyalty) = setup(utils::admin_address());
    scenario.next_tx(utils::ticket_minter_address());
    assert_eq(registry.used_nonces().length(), 0);
    let ticket = ticket_tests::create_ticket(&mut registry, &mut loyalty, scenario.ctx());
    transfer::public_transfer(ticket, utils::ticket_minter_address());

    let target_nonce = utils::admin_ticket_mint_nonce();
    assert_eq(*registry.used_nonces().borrow(target_nonce), 0);
    assert_eq(registry.used_nonces().length(), 1);

    scenario.next_tx(utils::admin_address());
    key_registry::cleanup_nonces(&mut registry, vector[target_nonce], scenario.ctx());
    assert_eq(registry.used_nonces().length(), 0);
    assert_eq(registry.used_nonces().contains(target_nonce), false);
    cleanup(scenario, registry, loyalty);
}

#[test, expected_failure(abort_code = ESenderNotKeyOwner)]
fun cleanup_nonces_unauthorized() {
    let (mut scenario, mut registry, _loyalty) = setup(utils::admin_address());
    scenario.next_tx(utils::ticket_minter_address());
    key_registry::cleanup_nonces(
        &mut registry,
        vector[utils::admin_ticket_mint_nonce()],
        scenario.ctx(),
    );

    abort
}
