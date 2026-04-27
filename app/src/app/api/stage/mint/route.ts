import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64, toBase64 } from "@mysten/sui/utils";
import { SponsorTxRequestBody } from "@/app/types/SponsorTx";
import { enokiClient } from "../../EnokiClient";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { getAllowedMoveCallTargets } from "@/app/lib/helpers-onchain";
interface MintStageRequest {
  ticketId: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const { ticketId }: MintStageRequest = await request.json();

    if (!ticketId) {
      return NextResponse.json(
        { error: "Missing required fields: ticketId" },
        { status: 400 }
      );
    }

    const packageId = process.env.NEXT_PUBLIC_PACKAGE;
    if (!packageId) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_PACKAGE not configured" },
        { status: 500 }
      );
    }

    const registryId = process.env.NEXT_PUBLIC_KEY_REGISTRY;
    if (!registryId) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_KEY_REGISTRY not configured" },
        { status: 500 }
      );
    }
    // Get private key from environment variables
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY_ED25519;
    if (!adminPrivateKey) {
      return NextResponse.json(
        { error: "ADMIN_PRIVATE_KEY_ED25519 not configured" },
        { status: 500 }
      );
    }

    const keypair = Ed25519Keypair.fromSecretKey(adminPrivateKey);
    const sender = keypair.getPublicKey().toSuiAddress();

    // Build transaction
    const tx = new Transaction();

    // Call ticket_stage::mint to create the stage transition for each stage and
    // transfer them to the ticket object
    const [attendedStage] = tx.moveCall({
      target: `${packageId}::ticket_stage::mint_attended`,
      arguments: [tx.object(registryId)],
    });

    const [collectibleStage] = tx.moveCall({
      target: `${packageId}::ticket_stage::mint_collectible`,
      arguments: [tx.object(registryId)],
    });

    // Transfer the stage transition to the ticket object
    tx.transferObjects(
      [attendedStage, collectibleStage],
      tx.pure.address(ticketId)
    );

    tx.setSender(sender);

    // Build transaction bytes
    const txBytes = await tx.build({
      client: new SuiGrpcClient({
        baseUrl: "https://fullnode.testnet.sui.io:443",
        network: "testnet",
      }),
      onlyTransactionKind: true,
    });

    // Create sponsored transaction
    const sponsorTxBody: SponsorTxRequestBody = {
      network: "testnet",
      txBytes: toBase64(txBytes),
      sender,
      allowedAddresses: [sender, ticketId],
    };
    const sponsorResponse = await enokiClient.createSponsoredTransaction({
      network: sponsorTxBody.network,
      transactionKindBytes: sponsorTxBody.txBytes,
      sender: sponsorTxBody.sender,
      allowedAddresses: sponsorTxBody.allowedAddresses,
      allowedMoveCallTargets: getAllowedMoveCallTargets(),
    });

    const { signature } = await keypair.signTransaction(
      fromBase64(sponsorResponse.bytes)
    );
    const executeResponse = await enokiClient.executeSponsoredTransaction({
      digest: sponsorResponse.digest,
      signature,
    });

    return NextResponse.json(executeResponse, { status: 200 });
  } catch (error) {
    console.error("Error creating stage mint transaction:", error);
    return NextResponse.json(
      {
        error: "Failed to create stage mint transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
