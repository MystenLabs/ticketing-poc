import { NextRequest, NextResponse } from "next/server";
import { bcs } from "@mysten/sui/bcs";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { toHex } from "@mysten/bcs";
import {
  LoyaltyPointRequest,
  LoyaltyPointResponse,
} from "@/app/types/LoyaltyPoint";
import { generateNonce, stringToBytes } from "@/app/helpers/crypto";

const LOYALTY_POINT_PERMIT_DOMAIN = "LoyaltyPointPermit";

export const POST = async (request: NextRequest) => {
  try {
    const pointData: LoyaltyPointRequest = await request.json();

    // Get private key from environment variables
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY_ED25519;
    if (!adminPrivateKey) {
      return NextResponse.json(
        { error: "ADMIN_PRIVATE_KEY_ED25519 not configured" },
        { status: 500 },
      );
    }
    const keypair = Ed25519Keypair.fromSecretKey(adminPrivateKey);
    const nonce = generateNonce();

    const bcsData = {
      domain: stringToBytes(LOYALTY_POINT_PERMIT_DOMAIN),
      nonce,
      loyalty_id: pointData.loyalty_id,
      points_to_add: BigInt(pointData.points_to_add),
    };

    const loyaltyPointPermitBCS = bcs.struct("LoyaltyPointPermit", {
      domain: bcs.vector(bcs.u8()),
      nonce: bcs.u64(),
      loyalty_id: bcs.Address,
      points_to_add: bcs.u64(),
    });
    const bytesToSign = loyaltyPointPermitBCS.serialize(bcsData).toBytes();
    const signature = await keypair.sign(bytesToSign);

    // Return response
    const response: LoyaltyPointResponse = {
      signature: toHex(signature),
      bytes: toHex(bytesToSign),
      nonce: nonce.toString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error creating loyalty point mint permit:", error);
    return NextResponse.json(
      {
        error: "Failed to create loyalty point mint permit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
