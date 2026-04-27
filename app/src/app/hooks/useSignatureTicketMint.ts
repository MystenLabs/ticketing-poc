import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { TicketMintResponse } from "@/app/types/TicketMint";
import { useSponsorSignAndExecute } from "./useSponsorSignAndExecute";
import { fromHex } from "@mysten/bcs";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

interface UseSignatureTicketMintResult {
  mintWithSignature: (
    mintPermit: TicketMintResponse,
    loyaltyId: string,
  ) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useSignatureTicketMint = (): UseSignatureTicketMintResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sponsorSignAndExecute } = useSponsorSignAndExecute();
  const currentAccount = useCurrentAccount();

  const mintWithSignature = async (
    mintPermit: TicketMintResponse,
    loyaltyId: string,
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const packageId = process.env.NEXT_PUBLIC_PACKAGE;
      if (!packageId) {
        throw new Error("NEXT_PUBLIC_PACKAGE not configured");
      }
      const registryId = process.env.NEXT_PUBLIC_KEY_REGISTRY;
      if (!registryId) {
        throw new Error("NEXT_PUBLIC_KEY_REGISTRY not configured");
      }
      if (!currentAccount?.address) {
        throw new Error("Address not found");
      }
      const txb = new Transaction();

      const [permit] = txb.moveCall({
        target: `${packageId}::ticket::new_mint_permit`,
        arguments: [
          txb.object(registryId),
          txb.pure.vector("u8", fromHex(mintPermit.bytes)),
          txb.pure.vector("u8", fromHex(mintPermit.signature)),
        ],
      });

      const [ticket] = txb.moveCall({
        target: `${packageId}::ticket::mint`,
        arguments: [permit, txb.object(loyaltyId)],
      });

      txb.transferObjects([ticket], currentAccount?.address!);
      txb.setSender(currentAccount?.address!);

      const result = await sponsorSignAndExecute({
        tx: txb,
        include: { effects: true, objectTypes: true },
      });

      if (!result) {
        throw new Error("Transaction failed");
      }

      const txResult = result.Transaction ?? result.FailedTransaction;
      if (!txResult) {
        throw new Error("Transaction result missing");
      }
      if (!txResult.status.success) {
        throw new Error(txResult.status.error?.message || "Transaction failed");
      }

      const createdTicket = txResult.effects?.changedObjects.find(
        (change) =>
          change.idOperation === "Created" &&
          txResult.objectTypes?.[change.objectId]?.endsWith("::ticket::Ticket"),
      );
      const ticketId = createdTicket?.objectId;
      if (!ticketId) {
        throw new Error("Could not find created ticket object");
      }

      return ticketId;
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mint ticket with signature";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintWithSignature,
    isLoading,
    error,
  };
};
