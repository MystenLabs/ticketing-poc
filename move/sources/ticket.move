/// This module implements the core ticketing functionality for the event system.
/// It handles ticket minting, lifecycle management, and integration with the
/// loyalty program.
///
/// Security Model
/// - Ticket minting requires signed permits to prevent unauthorized creation
/// - Stage transitions require admin privileges through the key registry
/// - All operations include replay protection via nonce system
module ticketing_poc::ticket;

use std::string::String;
use sui::{bcs, transfer::Receiving};
use ticketing_poc::{
    key_registry::KeyRegistry,
    loyalty::Loyalty,
    ticket_stage::{Self, StageTransition}
};

// ===== Error Codes =====
const EPermitDomainMismatch: u64 = 0;
const EPermitOwnerMismatch: u64 = 1;
const ELeftoverBytesDetected: u64 = 2;

/// Domain identifier for ticket mint permits
/// Used to prevent permits from being used across different operations
const MINT_PERMIT_DOMAIN: vector<u8> = b"TicketMintPermit";

/// Ticket NFT representing an event ticket with full metadata.
/// Each ticket is a unique NFT that contains all the information about
/// an event purchase including seating, pricing, and loyalty information.
/// Tickets progress through lifecycle stages as events occur.
public struct Ticket has key, store {
    id: UID,
    /// ID of the customer's loyalty object
    loyalty_id: ID,
    /// ID of the event
    event_id: String,
    /// Timestamp of the event (milliseconds)
    event_date: u64,
    /// Location where the event takes place
    event_location: String,
    /// Venue name
    venue: String,
    /// Seating section identifier
    section: String,
    /// List of specific seat identifiers
    seats: vector<String>,
    /// Loyalty points awarded for this purchase
    loyalty_points: u64,
    /// Full description of the event
    event_description: String,
    /// Name/title of the event
    event_name: String,
    /// Current lifecycle stage of the ticket
    stage: Stage,
    /// Original purchase price
    price: u64,
}

/// Permit for minting a new ticket.
/// Contains cryptographically verified data for creating a new ticket.
/// All fields are validated against the signature before ticket creation.
/// Can only be used once due to nonce protection.
public struct TicketMintPermit {
    domain: String,
    nonce: u64,
    owner: address,
    event_id: String,
    event_date: u64,
    event_location: String,
    venue: String,
    section: String,
    seats: vector<String>,
    loyalty_points: u64,
    event_description: String,
    event_name: String,
    price: u64,
}

/// Ticket lifecycle stages.
/// Represents the current state of a ticket in its lifecycle.
/// - `Purchased`: Initial state after minting/payment
/// - `Attended`: Updated after customer attends event
/// - `Collectible`: Final state for special collectible tickets
public enum Stage has copy, drop, store {
    Purchased,
    Attended,
    Collectible,
}

/// Creates a ticket mint permit from signed data.
/// Verifies a cryptographic signature and parses permit data to create
/// a TicketMintPermit that can be used to mint a new ticket NFT.
///
/// Permit Data Format (BCS encoded)
/// 1. `domain`: String - must be "TicketMintPermit"
/// 2. `nonce`: u64 - unique value for replay protection
/// 3. `owner`: address - must match transaction sender
/// 4. `event_id`: String - ID of the event
/// 5. `event_date`: u64 - timestamp of the event
/// 6. `event_location`: String - where the event takes place
/// 7. `venue`: String - venue name
/// 8. `section`: String - seating section
/// 9. `seats`: vector<String> - specific seat identifiers
/// 10. `loyalty_points`: u64 - points to award for this purchase
/// 11. `event_description`: String - detailed event description
/// 12. `event_name`: String - name of the event
/// 13. `price`: u64 - ticket price
///
/// Security Checks
/// - Verifies Ed25519 signature against registry's public key
/// - Ensures permit domain matches expected value
/// - Verifies owner matches transaction sender
/// - Consumes nonce to prevent replay attacks
/// - Validates all bytes are consumed during parsing
public fun new_mint_permit(
    registry: &mut KeyRegistry,
    bytes: vector<u8>,
    signature: vector<u8>,
    ctx: &mut TxContext,
): TicketMintPermit {
    // Verify the signature against the permit data
    registry.assert_signature(signature, bytes);

    // Parse the BCS-encoded permit data
    let mut bytes = bcs::new(bytes);
    let (
        domain,
        nonce,
        owner,
        event_id,
        event_date,
        event_location,
        venue,
        section,
        seats,
        loyalty_points,
        event_description,
        event_name,
        price,
    ) = (
        bytes.peel_vec_u8().to_string(),
        bytes.peel_u64(),
        bytes.peel_address(),
        bytes.peel_vec_u8().to_string(),
        bytes.peel_u64(),
        bytes.peel_vec_u8().to_string(),
        bytes.peel_vec_u8().to_string(),
        bytes.peel_vec_u8().to_string(),
        bytes.peel_vec_vec_u8().map!(|seat| seat.to_string()),
        bytes.peel_u64(),
        bytes.peel_vec_u8().to_string(),
        bytes.peel_vec_u8().to_string(),
        bytes.peel_u64(),
    );

    // Ensure all bytes were consumed (no unexpected data)
    assert!(bytes.into_remainder_bytes().length() == 0, ELeftoverBytesDetected);

    // Verify this permit is for ticket minting operations
    assert!(domain == MINT_PERMIT_DOMAIN.to_string(), EPermitDomainMismatch);

    // Ensure the permit is for the current transaction sender
    assert!(owner == ctx.sender(), EPermitOwnerMismatch);

    // Prevent replay attacks by consuming the nonce
    registry.consume_nonce(nonce, ctx);

    TicketMintPermit {
        domain,
        nonce,
        owner: ctx.sender(),
        event_id,
        event_date,
        event_location,
        venue,
        section,
        seats,
        loyalty_points,
        event_description,
        event_name,
        price,
    }
}

/// Mints a new ticket NFT using a verified permit.
/// Creates a new ticket object with all the details from the permit
/// and automatically awards loyalty points to the customer's account.
/// The ticket starts in the "Purchased" stage.
///
/// Process
/// 1. Extracts all ticket data from the consumed permit
/// 2. Creates new ticket NFT linked to customer's loyalty account
/// 3. Awards loyalty points for the purchase
/// 4. Returns the ticket (caller responsible for transfer)
public fun mint(permit: TicketMintPermit, loyalty: &mut Loyalty, ctx: &mut TxContext): Ticket {
    // Extract ticket data from permit and consume it
    let TicketMintPermit {
        ..,
        event_id,
        event_date,
        event_location,
        venue,
        section,
        seats,
        loyalty_points,
        event_description,
        event_name,
        price,
    } = permit;

    // Create new ticket NFT with permit data
    let ticket = Ticket {
        id: object::new(ctx),
        loyalty_id: loyalty.id(),
        event_id,
        event_date,
        event_location,
        venue,
        section,
        seats,
        loyalty_points,
        event_description,
        event_name,
        stage: Stage::Purchased, // All tickets start in purchased state
        price,
    };

    // Award loyalty points for this purchase
    loyalty.update_points(loyalty_points);

    ticket
}

/// Updates a ticket's lifecycle stage using a stage transition object.
/// Receives and consumes a StageTransition object to update the ticket's
/// current stage. This is how tickets progress through their lifecycle:
/// Purchased → Attended → Collectible.
///
/// Stage Transitions
/// - `StageTransition<Purchased>`: Sets stage to Purchased
/// - `StageTransition<Attended>`: Sets stage to Attended
/// - `StageTransition<Collectible>`: Sets stage to Collectible
///
/// Security
/// Stage transitions can only be created by admins through the key registry,
/// ensuring only authorized personnel can update ticket stages.
#[allow(deprecated_usage)]
public fun update_stage<T: drop>(ticket: &mut Ticket, stage: Receiving<StageTransition<T>>) {
    // Receive the stage transition object
    let stage_obj = transfer::public_receive(&mut ticket.id, stage);
    
    let type_name = std::type_name::get<StageTransition<T>>();

    // Determine the target stage based on transition type
    let to = if (type_name == std::type_name::get<StageTransition<ticket_stage::Purchased>>()) {
        Stage::Purchased
    } else if (type_name == std::type_name::get<StageTransition<ticket_stage::Attended>>()) {
        Stage::Attended
    } else if (type_name == std::type_name::get<StageTransition<ticket_stage::Collectible>>()) {
        Stage::Collectible
    } else {
        abort 0 // Should not happen if transitions are correctly minted
    };

    // Update the ticket's stage
    ticket.stage = to;

    // Clean up the consumed stage transition object
    ticket_stage::delete(stage_obj);
}

// ===== Getter Functions =====

/// Returns the ID of the loyalty account linked to this ticket
public fun loyalty_id(ticket: &Ticket): ID { ticket.loyalty_id }

/// Returns the loyalty points awarded for this ticket purchase
public fun loyalty_points(ticket: &Ticket): u64 { ticket.loyalty_points }

/// Returns the ID of the event
public fun event_id(ticket: &Ticket): String { ticket.event_id }

/// Returns the event date timestamp (milliseconds)
public fun event_date(ticket: &Ticket): u64 { ticket.event_date }

/// Returns the event location string
public fun event_location(ticket: &Ticket): String { ticket.event_location }

/// Returns the venue name
public fun venue(ticket: &Ticket): String { ticket.venue }

/// Returns the seating section identifier
public fun section(ticket: &Ticket): String { ticket.section }

/// Returns the list of seat identifiers
public fun seats(ticket: &Ticket): vector<String> { ticket.seats }

/// Returns the full event description
public fun event_description(ticket: &Ticket): String { ticket.event_description }

/// Returns the event name/title
public fun event_name(ticket: &Ticket): String { ticket.event_name }

/// Returns the current lifecycle stage of the ticket
public fun stage(ticket: &Ticket): Stage { ticket.stage }

/// Returns the original purchase price
public fun price(ticket: &Ticket): u64 { ticket.price }

/// Test utility function for creating stage enums.
#[test_only]
public fun stages(): (Stage, Stage, Stage) {
    (Stage::Purchased, Stage::Attended, Stage::Collectible)
}
