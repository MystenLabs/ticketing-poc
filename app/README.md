# Ticketing App

A decentralized ticketing application built with Next.js and the Sui blockchain.

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the bootstrap script from the repository root (one-time):**
   ```bash
   cd ..
   bash ./bootstrap.sh
   cd app
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.development.local.example .env.development.local
   ```
   Then configure your `.env.development.local` file (see Environment Variables section below)

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Configure your `.env.development.local` file with:
- `NEXT_PUBLIC_PACKAGE` - Your deployed package address
- `ADMIN_PRIVATE_KEY_ED25519` - Private key for admin operations
- `ENOKI_SECRET_KEY` & `NEXT_PUBLIC_ENOKI_API_KEY` - For sponsored transactions
- `KV_REST_API_TOKEN`, `KV_REST_API_URL`, `KV_URL` - For Vercel KV database
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - For Google OAuth

For detailed setup instructions and project information, see the [main README](../README.md).
