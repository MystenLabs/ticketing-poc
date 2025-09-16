module ticketing_poc::ticket_tests;

use sui::{test_scenario as ts, test_utils::assert_eq};
use ticketing_poc::{
    key_registry::{Self, KeyRegistry},
    loyalty::Loyalty,
    ticket::{Self, Ticket, EPermitOwnerMismatch, EPermitDomainMismatch},
    ticket_stage::{Self, Attended, Collectible},
    utils::{Self, setup, cleanup}
};

public fun create_ticket(
    registry: &mut KeyRegistry,
    loyalty: &mut Loyalty,
    ctx: &mut TxContext,
): Ticket {
    let permit = ticket::new_mint_permit(
        registry,
        utils::admin_ticket_mint_bytes(),
        utils::admin_ticket_mint_signature(),
        ctx,
    );
    let ticket = ticket::mint(
        permit,
        loyalty,
        ctx,
    );

    ticket
}

#[test]
fun creates_ticket() {
    let (mut scenario, mut registry, mut loyalty) = setup(utils::admin_address());

    scenario.next_tx(utils::ticket_minter_address());
    let ticket = create_ticket(&mut registry, &mut loyalty, scenario.ctx());

    let (purchased, _, _) = ticket::stages();
    assert_eq(ticket.loyalty_id(), loyalty.id());
    assert_eq(ticket.loyalty_points(), 250);
    assert_eq(ticket.event_id(), b"3".to_string());
    assert_eq(ticket.event_date(), 1733428800000);
    assert_eq(ticket.event_location(), b"Venice, Italy".to_string());
    assert_eq(ticket.venue(), b"Royal Masked Hall".to_string());
    assert_eq(ticket.section(), b"Section 03".to_string());
    assert_eq(ticket.seats(), vector[b"U5".to_string()]);
    assert_eq(
        ticket.event_description(),
        b"Step into a world of mystery and elegance at our grand masquerade ball.".to_string(),
    );
    assert_eq(ticket.event_name(), b"Magic Light in IT".to_string());
    assert_eq(ticket.stage(), purchased);
    assert_eq(ticket.price(), 40);
    transfer::public_transfer(ticket, utils::ticket_minter_address());

    cleanup(scenario, registry, loyalty);
}

#[test]
fun updates_ticket_stage() {
    let (mut scenario, mut registry, mut loyalty) = setup(utils::admin_address());

    scenario.next_tx(utils::ticket_minter_address());
    let mut ticket = create_ticket(&mut registry, &mut loyalty, scenario.ctx());
    let (purchased, attended, collectible) = ticket::stages();
    assert_eq(ticket.stage(), purchased);

    scenario.next_tx(utils::admin_address());
    let purchased_transition = ticket_stage::mint_purchased(&registry, scenario.ctx());
    let attended_transition = ticket_stage::mint_attended(&registry, scenario.ctx());
    let collectible_transition = ticket_stage::mint_collectible(&registry, scenario.ctx());
    let (attended_id, collectible_id) = (attended_transition.id(), collectible_transition.id());
    transfer::public_transfer(purchased_transition, object::id_address(&ticket));
    transfer::public_transfer(attended_transition, object::id_address(&ticket));
    transfer::public_transfer(collectible_transition, object::id_address(&ticket));

    scenario.next_tx(utils::ticket_minter_address());
    ticket.update_stage<Attended>(ts::receiving_ticket_by_id(attended_id));
    assert_eq(ticket.stage(), attended);
    ticket.update_stage<Collectible>(ts::receiving_ticket_by_id(collectible_id));
    assert_eq(ticket.stage(), collectible);

    transfer::public_transfer(ticket, utils::ticket_minter_address());

    cleanup(scenario, registry, loyalty);
}

#[test, expected_failure(abort_code = key_registry::EInvalidSignature)]
fun creates_ticket_invalid_signature() {
    let (mut scenario, mut registry, _loyalty) = setup(utils::admin_address());

    scenario.next_tx(utils::ticket_minter_address());
    let mut signature = utils::admin_ticket_mint_signature();
    signature.append(x"01");
    let _permit = ticket::new_mint_permit(
        &mut registry,
        utils::admin_ticket_mint_bytes(),
        signature,
        scenario.ctx(),
    );

    abort
}

#[test, expected_failure(abort_code = key_registry::ENonceAlreadyUsed)]
fun creates_ticket_nonce_already_used() {
    let (mut scenario, mut registry, mut loyalty) = setup(utils::admin_address());

    scenario.next_tx(utils::ticket_minter_address());
    let _ticket = create_ticket(&mut registry, &mut loyalty, scenario.ctx());
    let _ticket2 = create_ticket(&mut registry, &mut loyalty, scenario.ctx());

    abort
}

#[test, expected_failure(abort_code = EPermitOwnerMismatch)]
fun creates_ticket_permit_owner_mismatch() {
    let (mut scenario, mut registry, mut loyalty) = setup(utils::admin_address());

    scenario.next_tx(@0xA);
    let _ticket = create_ticket(&mut registry, &mut loyalty, scenario.ctx());

    abort
}

#[test, expected_failure(abort_code = EPermitDomainMismatch)]
fun creates_ticket_permit_domain_mismatch() {
    let (mut scenario, mut registry, _loyalty) = setup(utils::admin_address());

    scenario.next_tx(utils::ticket_minter_address());
    let _permit = ticket::new_mint_permit(
        &mut registry,
        utils::admin_ticket_mint_bytes_domain_mismatch(),
        utils::admin_ticket_mint_signature_domain_mismatch(),
        scenario.ctx(),
    );

    abort
}
