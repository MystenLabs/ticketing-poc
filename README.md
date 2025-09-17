# Ticketing PoC

A decentralized ticketing and loyalty platform built on Sui.

## Features

- **ZkLogin Authentication**: Secure sign-in with Google to get a Sui wallet
- **On-chain Loyalty Cards**: Create and manage loyalty cards as Sui objects  
- **NFT Tickets**: Mint event tickets as NFTs and earn loyalty points
- **Push Notifications**: Automatic time-based notifications for ticket updates
- **Sponsored Transactions**: Gasless transactions for seamless user experience

### Basic Development Setup

> **Note**: This setup will start the frontend, but full functionality requires smart contract deployment and Vercel KV setup (see sections below).

1. `cd app`
2. `pnpm i`
3. `pnpm run dev`

For a complete working setup, you'll need to:
- Deploy the Move smart contracts (see [Smart Contract Configuration](#smart-contract-configuration))
- Set up Vercel KV and environment variables (see [Local development with Vercel KV](#local-development-with-vercel-kv))

### Directories structure

- move: the Move code of the smart contracts
- app: the Typescript NextJS App

### Smart Contract Configuration

Before deploying the Move smart contracts, you need to configure the admin Ed25519 keypair for signature verification:

#### Setup Admin Keypair

1. List your keypairs to get the Ed25519 key you want to use as admin
```bash
sui keytool list
╭────────────────────────────────────────────────────────────────────────────────────────────╮
│ ╭─────────────────┬──────────────────────────────────────────────────────────────────────╮ │
│ │ alias           │  YOUR_ALIAS                                                          │ │
│ │ suiAddress      │  YOUR_ADDRESS                                                        │ │
│ │ publicBase64Key │  YOUR_BASE64_KEY                                                     │ │
│ │ keyScheme       │  ed25519                                                             │ │
│ │ flag            │  0                                                                   │ │
│ │ peerId          │  YOUR_PEER_ID                                                        │ │
│ ╰─────────────────┴──────────────────────────────────────────────────────────────────────╯ │
╰────────────────────────────────────────────────────────────────────────────────────────────╯
```

2. Convert the public key to hex format
```bash
echo "YOUR_BASE64_KEY" | base64 -d | xxd -p -c 256 | sed 's/^00//'
```

3. Update `DEFAULT_PK` in `move/sources/init.move` with your Ed25519 public key
```move
const DEFAULT_PK: vector<u8> = x"YOUR_PUBLIC_KEY_HEX_HERE";
```

4. Export the private key for the application environment variable
```bash
sui keytool export --key-identity YOUR_ALIAS
```

5. Publish the package using the publish script:
```bash
./publish.sh
```

### Local development with Vercel KV

To run the full application with Vercel KV storage, you'll need to set up your own Vercel project:

1. **Create a Vercel account** and install the Vercel CLI
2. **Create a new Vercel project** and link it to your repository
3. **Add a Vercel KV database** to your project in the Vercel dashboard
4. **Set up environment variables**:
   - Copy the KV environment variables from your Vercel dashboard
   - Create `app/.env.development.local` with the KV connection details
   - The file should include variables like `KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc. (see `app/.env.development.local.example`)
   - Set `ADMIN_PRIVATE_KEY_ED25519` to the private key from step 4 of the Smart Contract Configuration above
5. **Start the development server**:
   - Run `pnpm run dev` inside the app directory
   - Or use `vercel dev` in the project's root directory for full Vercel integration
6. **Test the connection** by visiting `http://localhost:3000/api/visits` to see the page visit counter increment

Note: The application will run without Vercel KV, but some features like visit tracking may not work.
