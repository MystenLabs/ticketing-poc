# Ticketing App

A decentralized ticketing application built with Next.js and the Sui blockchain.

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Configure your `.env` file with:
- `NEXT_PUBLIC_PACKAGE` - Your deployed package address
- `ADMIN_PRIVATE_KEY_ED25519` - Private key for admin operations
- `ENOKI_SECRET_KEY` & `NEXT_PUBLIC_ENOKI_API_KEY` - For sponsored transactions
- `KV_REST_API_TOKEN`, `KV_REST_API_URL`, `KV_URL` - For Vercel KV database
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - For Google OAuth

For detailed setup instructions and project information, see the [main README](../README.md).
