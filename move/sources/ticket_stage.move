/// This module manages the lifecycle transitions of tickets through different stages.
/// It provides secure, admin-controlled stage transition objects that can update
/// ticket states from Purchased → Attended → Collectible.
///
/// Stage Lifecycle
/// 1. **Purchased**: Initial state when ticket is first minted
/// 2. **Attended**: Set after customer attends the event
/// 3. **Collectible**: Final state for special tickets that become collectible NFTs
///
/// Security Model
/// Only authorized administrators (verified through the key registry) can create
/// stage transition objects. This ensures ticket stages can only be updated by
/// legitimate event staff or automated systems with proper credentials.
///
/// Usage Pattern
/// 1. Admin creates StageTransition object for specific stage type
/// 2. StageTransition is sent to the ticket's object address via Transfer To Object (TTO)
/// 3. Ticket object receives and applies the transition to its stage
/// 4. Transition object is consumed and ticket stage is updated
module ticketing_poc::ticket_stage;

use ticketing_poc::key_registry::KeyRegistry;

/// Generic stage transition object.
/// Represents a transition to a specific ticket stage. The phantom type parameter
/// determines which stage this transition leads to. These objects are created by
/// admins and sent to ticket's object address to update its stage.
public struct StageTransition<phantom T> has key, store {
    id: UID,
}

/// Marker type for "Purchased" stage transitions
public struct Purchased has drop ()

/// Marker type for "Attended" stage transitions
public struct Attended has drop ()

/// Marker type for "Collectible" stage transitions
public struct Collectible has drop ()

/// Creates a stage transition to "Purchased" state.
/// Mints a StageTransition<Purchased> object that can be used to set
/// a ticket's stage to Purchased.
/// Requires admin privileges verified through the key registry.
public fun mint_purchased(registry: &KeyRegistry, ctx: &mut TxContext): StageTransition<Purchased> {
    mint<Purchased>(registry, ctx)
}

/// Creates a stage transition to "Attended" state.
/// Requires admin privileges verified through the key registry.
public fun mint_attended(registry: &KeyRegistry, ctx: &mut TxContext): StageTransition<Attended> {
    mint<Attended>(registry, ctx)
}

/// Creates a stage transition to "Collectible" state.
/// Requires admin privileges verified through the key registry.
public fun mint_collectible(
    registry: &KeyRegistry,
    ctx: &mut TxContext,
): StageTransition<Collectible> {
    mint<Collectible>(registry, ctx)
}

/// Internal function for creating stage transition objects.
///
/// Creates a new StageTransition of the specified type after verifying
/// that the transaction sender is authorized through the key registry.
/// Only administrators with the correct private key can create transitions.
///
/// Security Check
/// Verifies that the transaction sender's address matches the address
/// derived from the public key stored in the registry.
fun mint<T: drop>(registry: &KeyRegistry, ctx: &mut TxContext): StageTransition<T> {
    // Verify that the sender is the registered admin
    registry.assert_sender_is_key_owner(ctx);

    // Create and return the stage transition object
    StageTransition<T> { id: object::new(ctx) }
}

/// Destroys a consumed stage transition object.
/// Called by the ticket module after successfully applying a stage transition.
/// This cleans up the transition object and prevents it from being reused.
public(package) fun delete<T: drop>(transition: StageTransition<T>) {
    let StageTransition { id } = transition;
    id.delete();
}

/// Test utility function for getting transition object ID.
#[test_only]
public fun id<T: drop>(transition: &StageTransition<T>): ID {
    transition.id.to_inner()
}
