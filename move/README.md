# Ticketing PoC - Move Smart Contracts

A secure, NFT-based ticketing and loyalty system built on Sui blockchain.

## Overview

This Move package implements a comprehensive ticketing system with:
- **NFT Tickets**: Event tickets as unique, transferable NFTs
- **SBT-based Loyalty Program**: Point-based rewards for customer engagement  
- **Ticket Lifecycle**: Automated stage transitions (Purchased → Attended → Collectible)
- **Cryptographic Security**: Ed25519 signature verification for all operations
- **Replay Protection**: Nonce-based system prevents duplicate transactions

## Architecture

### Core Modules

- **`ticket.move`**: Main ticket NFT functionality and lifecycle management
- **`loyalty.move`**: Customer loyalty program with point rewards
- **`ticket_stage.move`**: Secure stage transition system for tickets
- **`key_registry.move`**: Cryptographic signature verification and nonce management
- **`display.move`**: NFT metadata and visual configuration
- **`init.move`**: Package initialization and setup

## Security Model

### Signed Permits
All sensitive operations require cryptographically signed permits:
- **Ticket Minting**: `TicketMintPermit` with event details and pricing
- **Loyalty Points**: `LoyaltyPointPermit` for adding points

### Key Registry
- Stores trusted Ed25519 public key for signature verification
- Manages nonce-based replay protection
- Derives admin addresses from public keys
- Enables secure key rotation via package publisher

### Replay Protection
- Each permit includes a unique nonce
- Used nonces are tracked to prevent reuse
- Cleanup functions available for storage management

## Ticket Lifecycle

### 1. **Purchased** (Initial)
- Ticket minted after payment verification
- Loyalty points awarded automatically
- Full event metadata stored on-chain

### 2. **Attended**  
- Updated when customer attends event
- Triggered by admin-created stage transitions
- Unlocks additional functionality

### 3. **Collectible** (Final)
- Special commemorative status
- Enhanced display properties
- Permanent collectible value

## Usage Patterns

### Ticket Purchase Flow
1. Backend creates signed `TicketMintPermit` 
2. Client calls `new_mint_permit()` with signature
3. Client calls `mint()` with permit + loyalty object
4. Ticket NFT created and loyalty points awarded

### Stage Transitions
1. Admin creates `StageTransition<T>` object
2. Object sent to ticket via Transfer-to-Object (TTO)
3. Ticket owner calls `update_stage()` to apply transition
4. Ticket stage updated, transition object consumed

### Loyalty Points
1. Backend creates signed `LoyaltyPointPermit`
2. Client calls `new_loyalty_point_permit()` 
3. Client calls `add_points()` to update balance

## Deployment

### Prerequisites
- Sui CLI installed and configured
- Ed25519 key pair for signature verification

### Publishing
```bash
sui client publish
```

OR using the `../publish.sh` script in the root directory (recommended)
```bash
./publish.sh
```

### Configuration

For detailed setup instructions including how to configure the `DEFAULT_PK` with your Ed25519 public key, see the **Smart Contract Configuration** section in the [main README](../README.md#smart-contract-configuration).

## Testing

Run the comprehensive test suite:
```bash
sui move test
```
