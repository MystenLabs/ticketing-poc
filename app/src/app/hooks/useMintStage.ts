import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";

interface CreateSponsoredTransactionResponse {
  digest: string;
}

interface UseMintStageResult {
  mintStage: (ticketId: string) => Promise<string | undefined>;
  isLoading: boolean;
  error: string | null;
}

export const useMintStage = (): UseMintStageResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentAccount = useCurrentAccount();

  const mintStage = async (ticketId: string): Promise<string | undefined> => {
    if (!currentAccount?.address) {
      setError("Address not found");
      toast.error("You need to be signed in to mint a stage");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the API to create sponsored transaction
      const response: AxiosResponse<CreateSponsoredTransactionResponse> =
        await axios.post("/api/stage/mint", {
          ticketId,
        });

      const { digest } = response.data;

      return digest;
    } catch (err) {
      console.error("Error minting stage:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mint stage";
      setError(errorMessage);
      toast.error(`Failed to mint stages: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { mintStage, isLoading, error };
};
