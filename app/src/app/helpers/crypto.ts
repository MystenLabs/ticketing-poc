import { randomBytes } from "crypto";

// Generate nonce based on current timestamp
export function generateNonce(): bigint {
  return randomBytes(8).readBigUInt64BE(0);
}

// Convert string to UTF-8 byte array
export function stringToBytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str));
}
