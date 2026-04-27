export type EnokiNetwork = "mainnet" | "testnet" | "devnet";

export interface SponsorTxRequestBody {
  network: EnokiNetwork;
  txBytes: string;
  sender: string;
  allowedAddresses?: string[];
}
