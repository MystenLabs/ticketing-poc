import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSui } from "./useSui";
import { SponsorTxRequestBody } from "../types/SponsorTx";
import { toBase64 } from "@mysten/sui/utils";
import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";

interface CreateSponsoredTransactionResponse {
  bytes: string;
  digest: string;
}

interface ExecuteSponsoredTransactionInput {
  signature: string;
  digest: string;
}

type TransactionInclude = {
  balanceChanges?: boolean;
  effects?: boolean;
  events?: boolean;
  objectTypes?: boolean;
  transaction?: boolean;
  bcs?: boolean;
};

type TransactionResult = {
  Transaction?: {
    status: { success: boolean; error: { message?: string } | null };
    effects?: {
      changedObjects: Array<{ objectId: string; idOperation: string }>;
    };
    objectTypes?: Record<string, string>;
  };
  FailedTransaction?: {
    status: { success: boolean; error: { message?: string } | null };
    effects?: {
      changedObjects: Array<{ objectId: string; idOperation: string }>;
    };
    objectTypes?: Record<string, string>;
  };
};

export const useSponsorSignAndExecute = () => {
  const [isLoading, setIsLoading] = useState(false);
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const dAppKit = useDAppKit();
  const { suiClient } = useSui();

  const sponsorSignAndExecute = async ({
    tx,
    include,
  }: {
    tx: Transaction;
    include: TransactionInclude;
  }): Promise<TransactionResult | undefined> => {
    setIsLoading(true);
    try {
      const txBytes = await tx.build({
        client: suiClient,
        onlyTransactionKind: true,
      });
      if (!address) {
        throw new Error("No address available");
      }

      const sponsorTxBody: SponsorTxRequestBody = {
        network: "testnet",
        txBytes: toBase64(txBytes),
        sender: address,
        allowedAddresses: [address],
      };
      const sponsorResponse: AxiosResponse<CreateSponsoredTransactionResponse> =
        await axios.post("/api/sponsor", sponsorTxBody);
      const { bytes, digest: sponsorDigest } = sponsorResponse.data;
      const { signature } = await dAppKit.signTransaction({
        transaction: bytes,
      });
      const executeSponsoredTxBody: ExecuteSponsoredTransactionInput = {
        signature,
        digest: sponsorDigest,
      };
      const executeResponse: AxiosResponse<{ digest: string }> =
        await axios.post("/api/execute", executeSponsoredTxBody);
      const digest = executeResponse.data.digest;
      await suiClient.waitForTransaction({ digest, timeout: 5_000 });
      return suiClient.getTransaction({
        digest,
        include,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to sponsor and execute transaction block");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, sponsorSignAndExecute };
};
