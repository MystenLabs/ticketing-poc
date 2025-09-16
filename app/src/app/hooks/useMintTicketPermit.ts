import { useState } from "react";
import { TicketMintRequest, TicketMintResponse } from "@/app/types/TicketMint";

interface UseMintTicketPermitResult {
  createMintPermit: (
    ticketData: TicketMintRequest,
  ) => Promise<TicketMintResponse>;
  isLoading: boolean;
  error: string | null;
}

export const useMintTicketPermit = (): UseMintTicketPermitResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMintPermit = async (
    ticketData: TicketMintRequest,
  ): Promise<TicketMintResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/permit/mint-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const mintPermit: TicketMintResponse = await response.json();
      return mintPermit;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create mint permit";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMintPermit,
    isLoading,
    error,
  };
};
