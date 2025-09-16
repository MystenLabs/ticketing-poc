/// This module provides cryptographic signature verification for the ticketing system.
/// It maintains a registry with an Ed25519 public key and manages nonce-based replay
/// protection for all permit operations.
///
/// The key registry forms the security foundation of the ticketing system by:
/// - Storing a trusted Ed25519 public key for signature verification
/// - Managing nonce-based replay protection to prevent duplicate permit usage
/// - Providing address derivation from public keys following Sui standards
/// - Offering administrative functions for key management and nonce cleanup
///
/// All permit operations (ticket minting, loyalty point updates, etc.) must:
/// 1. Include a cryptographic signature from the registered key
/// 2. Use a unique nonce to prevent replay attacks
/// 3. Pass signature verification before execution
///
/// Nonces prevent replay attacks by ensuring each permit can only be used once.
/// The system tracks used nonces with their epoch for potential cleanup.
module ticketing_poc::key_registry;

use sui::{
    address,
    ed25519,
    hash,
    package::Publisher,
    table::{Self, Table},
    versioned::{Self, Versioned}
};

/// Current version of the KeyRegistryInner structure
const VERSION: u64 = 1;

/// Expected Ed25519 public key length in bytes
const ED25519_PUBLIC_KEY_LENGTH: u64 = 32;

// ===== Error Codes =====
const ENotAuthorized: u64 = 0;
const EWrongInnerVersion: u64 = 1;
const EInvalidSignature: u64 = 2;
const ENonceAlreadyUsed: u64 = 3;
const ESenderNotKeyOwner: u64 = 4;
const EInvalidPublicKeyLength: u64 = 5;

/// Main key registry object that stores cryptographic keys and nonce state.
/// This is a shared object that can be accessed by all users but only
/// modified through controlled functions that verify permissions.
public struct KeyRegistry has key {
    id: UID,
    /// Versioned storage for upgrade compatibility
    inner: Versioned,
}

/// Inner data structure for the key registry.
/// Uses versioned storage pattern to allow for future upgrades
/// while maintaining backward compatibility.
public struct KeyRegistryInner has store {
    /// Ed25519 public key used for signature verification (32 bytes)
    pk: vector<u8>,
    /// Table tracking used nonces to prevent replay attacks
    /// Maps nonce -> epoch when it was used
    used_nonces: Table<u64, u64>,
}

/// Creates a new key registry with the specified public key.
/// This function is only callable from within the package during initialization.
/// The registry starts with an empty nonce table and the provided public key.
public(package) fun new(pk: vector<u8>, ctx: &mut TxContext): KeyRegistry {
    assert!(pk.length() == ED25519_PUBLIC_KEY_LENGTH, EInvalidPublicKeyLength);
    let registry = KeyRegistry {
        id: object::new(ctx),
        inner: versioned::create(
            VERSION,
            KeyRegistryInner { pk, used_nonces: table::new(ctx) },
            ctx,
        ),
    };

    registry
}

/// Shares the key registry as a shared object
public(package) fun share(registry: KeyRegistry) {
    transfer::share_object(registry);
}

/// Verifies an Ed25519 signature against the stored public key.
/// This is the core security function that validates all permit signatures.
/// It uses the Ed25519 signature scheme to verify that the signature was
/// created by the holder of the private key corresponding to the stored public key.
public(package) fun assert_signature(
    registry: &KeyRegistry,
    signature: vector<u8>,
    bytes: vector<u8>,
) {
    assert!(
        ed25519::ed25519_verify(
            &signature,
            &registry.pk(),
            &bytes,
        ),
        EInvalidSignature,
    );
}

/// Consumes a nonce to prevent replay attacks.
/// Records that a specific nonce has been used in the current epoch.
/// This prevents the same permit from being used multiple times.
/// Nonces should be unique values.
public fun consume_nonce(registry: &mut KeyRegistry, nonce: u64, ctx: &mut TxContext) {
    assert!(!registry.inner().used_nonces.contains(nonce), ENonceAlreadyUsed);
    registry.inner_mut().used_nonces.add(nonce, ctx.epoch());
}

/// Removes old nonces from the registry to free up storage.
/// This administrative function allows the key owner to clean up
/// old nonces that are no longer needed for replay protection.
/// Typically used to remove nonces from previous epochs.
/// Only the key owner (derived from the stored public key) can call this function.
public fun cleanup_nonces(
    registry: &mut KeyRegistry,
    nonces_to_cleanup: vector<u64>,
    ctx: &mut TxContext,
) {
    registry.assert_sender_is_key_owner(ctx);
    nonces_to_cleanup.destroy!(|nonce| {
        if (registry.used_nonces().contains(nonce)) {
            registry.inner_mut().used_nonces.remove(nonce);
        }
    });
}

/// Updates the public key stored in the registry.
/// Only the package publisher can update the public key.
public fun set_pk(registry: &mut KeyRegistry, pub: &Publisher, pk: vector<u8>) {
    assert!(pub.from_package<KeyRegistry>(), ENotAuthorized);
    assert!(pk.length() == ED25519_PUBLIC_KEY_LENGTH, EInvalidPublicKeyLength);
    registry.inner_mut().pk = pk;
}

/// Verifies that the transaction sender corresponds to the stored public key.
/// This function derives the Sui address from the stored public key and
/// compares it with the transaction sender. Used to verify that administrative
/// operations are being performed by the key owner.
public fun assert_sender_is_key_owner(registry: &KeyRegistry, ctx: &TxContext) {
    let expected_address = derive_address_from_pk(&registry.pk());
    assert!(ctx.sender() == expected_address, ESenderNotKeyOwner);
}

/// Derives a Sui address from an Ed25519 public key.
/// Implements the Sui address derivation algorithm:
/// 1. Prepend Ed25519 flag byte (0x00) to the public key
/// 2. Hash the combined bytes using Blake2b-256
/// 3. Take the first 32 bytes as the address
public fun derive_address_from_pk(pk: &vector<u8>): address {
    let mut bytes_to_hash = vector[0x00]; // Ed25519 signature scheme flag
    bytes_to_hash.append(*pk);
    let hash_result = hash::blake2b256(&bytes_to_hash);
    address::from_bytes(hash_result)
}

/// Returns the stored public key.
public fun pk(registry: &KeyRegistry): vector<u8> {
    registry.inner().pk
}

/// Returns a reference to the used nonces table
public fun used_nonces(registry: &KeyRegistry): &Table<u64, u64> {
    &registry.inner().used_nonces
}

/// Accesses the inner data structure with version checking
fun inner(registry: &KeyRegistry): &KeyRegistryInner {
    assert!(registry.inner.version() == VERSION, EWrongInnerVersion);
    registry.inner.load_value<KeyRegistryInner>()
}

/// Accesses the inner data structure mutably with version checking
fun inner_mut(registry: &mut KeyRegistry): &mut KeyRegistryInner {
    assert!(registry.inner.version() == VERSION, EWrongInnerVersion);
    registry.inner.load_value_mut<KeyRegistryInner>()
}
