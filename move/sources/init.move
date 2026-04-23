/// This module handles the initialization of the entire ticketing system package.
/// It sets up the core infrastructure including:
/// - Package publisher capabilities
/// - Display metadata for NFTs
/// - Cryptographic key registry for secure operations
module ticketing_poc::init;

use sui::package;
use ticketing_poc::display;
use ticketing_poc::key_registry;

/// One-time witness for package initialization
/// This struct can only be created once during package deployment
public struct INIT has drop {}

/// Default Ed25519 public key for the key registry
/// This key will be used to verify signatures for all permit operations
/// In production, this should be replaced with the actual service's public key
const DEFAULT_PK: vector<u8> = x"42296d88a9f466fbeea18064f6ee1821dc47b404f6fd0599e5709777cc9599df";

/// Package initialization function
/// Called automatically when the package is published to Sui network
///
/// Setup Process
/// 1. Claims package publisher capability using the one-time witness
/// 2. Creates display metadata templates for tickets, loyalty objects, and stage updates
/// 3. Transfers display objects to the package deployer for management
/// 4. Initializes and shares the key registry with the default public key
fun init(otw: INIT, ctx: &mut TxContext) {
    // Claim package publisher capability
    let pub = package::claim(otw, ctx);

    // Create display metadata templates for all NFT types
    let (
        ticket_display,
        loyalty_display,
        ticket_stage_display_purchased,
        ticket_stage_display_attended,
        ticket_stage_display_collectible,
    ) = display::create(&pub, ctx);

    // Transfer display objects to the package deployer for management
    transfer::public_transfer(ticket_display, ctx.sender());
    transfer::public_transfer(loyalty_display, ctx.sender());
    transfer::public_transfer(ticket_stage_display_purchased, ctx.sender());
    transfer::public_transfer(ticket_stage_display_attended, ctx.sender());
    transfer::public_transfer(ticket_stage_display_collectible, ctx.sender());
    transfer::public_transfer(pub, ctx.sender());

    // Initialize and share the key registry with default public key
    // This registry will be used to verify signatures for all permit operations
    key_registry::new(DEFAULT_PK, ctx).share();
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    INIT {}.init(ctx);
}
