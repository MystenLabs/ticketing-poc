import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSui } from "./useSui";
import { SponsorTxRequestBody } from "../types/SponsorTx";
import { toB64, fromB64 } from "@mysten/sui/utils";
import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";
import axios, { AxiosResponse } from "axios";
import {
  CreateSponsoredTransactionApiResponse,
  ExecuteSponsoredTransactionApiInput,
} from "@mysten/enoki/dist/cjs/EnokiClient/type";
import { SuiTransactionBlockResponseOptions } from "@mysten/sui/client";
import toast from "react-hot-toast";

export const useSponsorSignAndExecute = () => {
  const [isLoading, setIsLoading] = useState(false);
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { mutateAsync: signTransaction } = useSignTransaction();
  const { suiClient } = useSui();

  const sponsorSignAndExecute = async ({
    tx,
    options,
  }: {
    tx: Transaction;
    options: SuiTransactionBlockResponseOptions;
  }) => {
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
        txBytes: toB64(txBytes),
        sender: address,
        allowedAddresses: [address],
      };
      const sponsorResponse: AxiosResponse<CreateSponsoredTransactionApiResponse> =
        await axios.post("/api/sponsor", sponsorTxBody);
      const { bytes, digest: sponsorDigest } = sponsorResponse.data;
      const { signature } = await signTransaction({
        transaction: bytes,
        account: currentAccount!,
      });
      const signatureString =
        typeof signature === "string" ? signature : toB64(signature);
      const executeSponsoredTxBody: ExecuteSponsoredTransactionApiInput = {
        signature: signatureString,
        digest: sponsorDigest,
      };
      const executeResponse: AxiosResponse<{ digest: string }> =
        await axios.post("/api/execute", executeSponsoredTxBody);
      let digest = executeResponse.data.digest;
      await suiClient.waitForTransaction({ digest, timeout: 5_000 });
      return suiClient.getTransactionBlock({
        digest,
        options,
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
