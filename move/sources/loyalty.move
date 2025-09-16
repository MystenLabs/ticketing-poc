/// This module implements a customer loyalty program with point-based rewards.
/// Customers receive loyalty objects upon signup and earn points through various
/// activities like purchasing tickets.
module ticketing_poc::loyalty;

use std::string::String;
use sui::{bcs, clock::Clock};
use ticketing_poc::key_registry::KeyRegistry;

// ===== Error Codes =====
const ELeftoverBytesDetected: u64 = 0;
const EPermitDomainMismatch: u64 = 1;
const EInvalidLoyaltyId: u64 = 2;

/// Domain identifier for loyalty point permits
/// Used to prevent permits from being used across different operations
const LOYALTY_POINT_PERMIT_DOMAIN: vector<u8> = b"LoyaltyPointPermit";

/// Loyalty membership object transferred to customers on signup
/// This is an owned object that tracks a customer's loyalty program
/// membership and accumulated points.
public struct Loyalty has key {
    id: UID,
    /// Timestamp in msec when customer joined the loyalty program
    tenure_date: u64,
    /// Current loyalty point balance
    loyalty_points: u64,
}

/// Permit for adding loyalty points to a specific loyalty object.
/// This struct contains cryptographically verified data for adding points
/// to a loyalty account. It must be created through signature verification
/// and can only be used once due to nonce protection.
public struct LoyaltyPointPermit {
    domain: String,
    nonce: u64,
    loyalty_id: ID,
    points_to_add: u64,
}

/// Creates a new loyalty membership for a customer.
/// Mints a new loyalty object with the current timestamp as the tenure date
/// and transfers it to the transaction sender.
public fun mint(clock: &Clock, ctx: &mut TxContext) {
    let loyalty = Loyalty {
        id: object::new(ctx),
        tenure_date: clock.timestamp_ms(),
        loyalty_points: 0,
    };

    transfer::transfer(loyalty, ctx.sender());
}

/// Creates a loyalty point permit from signed data.
/// Verifies a cryptographic signature and parses the permit data to create
/// a LoyaltyPointPermit that can be used to add points to a loyalty account.
///
/// Permit Data Format (BCS encoded)
/// 1. `domain`: String - must be "LoyaltyPointPermit"
/// 2. `nonce`: u64 - unique value for replay protection
/// 3. `loyalty_id`: address - target loyalty object ID
/// 4. `points_to_add`: u64 - number of points to add
///
/// Security Checks
/// - Verifies Ed25519 signature against registry's public key
/// - Ensures permit domain matches expected value
/// - Consumes nonce to prevent replay attacks
/// - Validates all bytes are consumed during parsing
public fun new_loyalty_point_permit(
    registry: &mut KeyRegistry,
    bytes: vector<u8>,
    signature: vector<u8>,
    ctx: &mut TxContext,
): LoyaltyPointPermit {
    // Verify the signature against the permit data
    registry.assert_signature(signature, bytes);

    // Parse the BCS-encoded permit data
    let mut bytes = bcs::new(bytes);
    let (domain, nonce, loyalty_id, points_to_add) = (
        bytes.peel_vec_u8().to_string(),
        bytes.peel_u64(),
        object::id_from_address(bytes.peel_address()),
        bytes.peel_u64(),
    );

    // Ensure all bytes were consumed (no unexpected data)
    assert!(bytes.into_remainder_bytes().length() == 0, ELeftoverBytesDetected);

    // Verify this permit is for loyalty point operations
    assert!(domain == LOYALTY_POINT_PERMIT_DOMAIN.to_string(), EPermitDomainMismatch);

    // Prevent replay attacks by consuming the nonce
    registry.consume_nonce(nonce, ctx);

    LoyaltyPointPermit { domain, nonce, loyalty_id, points_to_add }
}

/// Adds loyalty points using a verified permit.
/// Consumes a LoyaltyPointPermit and adds the specified points to the
/// target loyalty object. Verifies that the permit targets this specific
/// loyalty object before adding points.
public fun add_points(loyalty: &mut Loyalty, permit: LoyaltyPointPermit) {
    // Verify the permit targets this specific loyalty object
    assert!(loyalty.id.to_inner() == permit.loyalty_id, EInvalidLoyaltyId);

    // Extract point amount from permit and consume it
    let LoyaltyPointPermit { points_to_add, .. } = permit;

    // Add points to the loyalty balance
    loyalty.update_points(points_to_add);
}

/// Internal function for updating loyalty points.
public(package) fun update_points(loyalty: &mut Loyalty, points_to_add: u64) {
    loyalty.loyalty_points = loyalty.loyalty_points + points_to_add;
}

/// Returns the loyalty object's ID.
public(package) fun id(loyalty: &Loyalty): ID { loyalty.id.to_inner() }

/// Returns when the customer joined the loyalty program.
public fun tenure_date(loyalty: &Loyalty): u64 { loyalty.tenure_date }

/// Returns the customer's current loyalty point balance.
public fun loyalty_points(loyalty: &Loyalty): u64 { loyalty.loyalty_points }
