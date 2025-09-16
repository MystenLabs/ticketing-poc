import { NextRequest, NextResponse } from "next/server";
import { bcs } from "@mysten/sui/bcs";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { toHex } from "@mysten/bcs";
import { TicketMintRequest, TicketMintResponse } from "@/app/types/TicketMint";
import { generateNonce, stringToBytes } from "@/app/helpers/crypto";

const MINT_PERMIT_DOMAIN = "TicketMintPermit";

export const POST = async (request: NextRequest) => {
  try {
    const ticketData: TicketMintRequest = await request.json();

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

    // Prepare data for BCS encoding
    const bcsData = {
      domain: stringToBytes(MINT_PERMIT_DOMAIN),
      nonce,
      owner: ticketData.owner,
      event_id: stringToBytes(ticketData.event_id),
      event_date: BigInt(ticketData.event_date),
      event_location: stringToBytes(ticketData.event_location),
      venue: stringToBytes(ticketData.venue),
      section: stringToBytes(ticketData.section),
      seats: ticketData.seats.map((seat) => stringToBytes(seat)),
      loyalty_points: BigInt(ticketData.loyalty_points),
      event_description: stringToBytes(ticketData.event_description),
      event_name: stringToBytes(ticketData.event_name),
      price: BigInt(ticketData.price),
    };

    const ticketMintPermitBCS = bcs.struct("TicketMintPermit", {
      domain: bcs.vector(bcs.u8()),
      nonce: bcs.u64(),
      owner: bcs.Address,
      event_id: bcs.vector(bcs.u8()),
      event_date: bcs.u64(),
      event_location: bcs.vector(bcs.u8()),
      venue: bcs.vector(bcs.u8()),
      section: bcs.vector(bcs.u8()),
      seats: bcs.vector(bcs.vector(bcs.u8())),
      loyalty_points: bcs.u64(),
      event_description: bcs.vector(bcs.u8()),
      event_name: bcs.vector(bcs.u8()),
      price: bcs.u64(),
    });
    const bytesToSign = ticketMintPermitBCS.serialize(bcsData).toBytes();
    const signature = await keypair.sign(bytesToSign);

    // Return response
    const response: TicketMintResponse = {
      signature: toHex(signature),
      bytes: toHex(bytesToSign),
      nonce: nonce.toString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error creating ticket mint permit:", error);
    return NextResponse.json(
      {
        error: "Failed to create ticket mint permit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
