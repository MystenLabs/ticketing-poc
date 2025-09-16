module ticketing_poc::loyalty_tests;

use sui::{clock, test_utils::assert_eq};
use ticketing_poc::{
    loyalty::{Self, Loyalty, EPermitDomainMismatch, EInvalidLoyaltyId},
    utils::{Self, setup, cleanup}
};

#[test]
fun mint_loyalty() {
    let (scenario, registry, loyalty) = setup(utils::admin_address());

    assert_eq(loyalty.tenure_date(), 0);
    assert_eq(loyalty.loyalty_points(), 0);

    cleanup(scenario, registry, loyalty);
}

#[test]
fun updates_loyalty_points() {
    let (mut scenario, mut registry, mut loyalty) = setup(utils::admin_address());

    assert_eq(loyalty.id(), utils::admin_loyalty_id());
    assert_eq(loyalty.loyalty_points(), 0);

    let permit = loyalty::new_loyalty_point_permit(
        &mut registry,
        utils::admin_loyalty_point_bytes(),
        utils::admin_loyalty_point_signature(),
        scenario.ctx(),
    );
    loyalty.add_points(permit);
    assert_eq(loyalty.loyalty_points(), 500);

    cleanup(scenario, registry, loyalty);
}

#[test, expected_failure(abort_code = EPermitDomainMismatch)]
fun updates_loyalty_points_domain_mismatch() {
    let (mut scenario, mut registry, _loyalty) = setup(utils::admin_address());

    let _permit = loyalty::new_loyalty_point_permit(
        &mut registry,
        utils::admin_loyalty_point_bytes_domain_mismatch(),
        utils::admin_loyalty_point_signature_domain_mismatch(),
        scenario.ctx(),
    );

    abort
}

#[test, expected_failure(abort_code = EInvalidLoyaltyId)]
fun updates_loyalty_points_loyalty_id_mismatch() {
    let (mut scenario, mut registry, _loyalty) = setup(utils::admin_address());
    let clock = clock::create_for_testing(scenario.ctx());
    loyalty::mint(&clock, scenario.ctx());
    scenario.next_tx(utils::admin_address());
    let mut loyalty2 = scenario.take_from_sender<Loyalty>();

    let permit = loyalty::new_loyalty_point_permit(
        &mut registry,
        utils::admin_loyalty_point_bytes(),
        utils::admin_loyalty_point_signature(),
        scenario.ctx(),
    );

    loyalty2.add_points(permit);

    abort
}
