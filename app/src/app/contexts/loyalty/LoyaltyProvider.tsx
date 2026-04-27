import { useEffect, useState } from "react";
import { LoyaltyContext } from "./LoyaltyContext";
import { useSui } from "@/app/hooks/useSui";
import { Loyalty, OnChainLoyalty } from "@/app/types/Loyalty";
import { mapLoyalty } from "@/app/mappers/mapLoyalty";
import { toast } from "react-hot-toast";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { useSponsorSignAndExecute } from "@/app/hooks/useSponsorSignAndExecute";

interface LoyaltyProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const LoyaltyProvider = ({ children }: LoyaltyProviderProps) => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { suiClient } = useSui();
  const { sponsorSignAndExecute } = useSponsorSignAndExecute();
  const [loyalty, setLoyalty] = useState<Loyalty | null>(null);

  useEffect(() => {
    if (!!address) {
      reFetchLoyalty(address);
    } else {
      setLoyalty(null);
    }
  }, [address]);

  const reFetchLoyalty = async (
    owner: string,
    mintIfNotExists: boolean = true,
  ) => {
    return suiClient
      .listOwnedObjects({
        owner,
        include: {
          json: true,
        },
      })
      .then((resp) => {
        const loyaltyOnChainObject = resp.objects.find((object) => {
          return (
            object.type ===
            `${process.env.NEXT_PUBLIC_PACKAGE}::loyalty::Loyalty`
          );
        });
        if (!loyaltyOnChainObject) {
          setLoyalty(null);
          if (!!mintIfNotExists) {
            mintLoyalty(owner);
          }
          return;
        }
        const loyaltyObjectJson = loyaltyOnChainObject.json as any;
        const loyaltyFields = loyaltyObjectJson?.fields || loyaltyObjectJson;
        const loyaltyObject = mapLoyalty(loyaltyFields as OnChainLoyalty);
        setLoyalty(loyaltyObject);
      })
      .catch((err) => {
        setLoyalty(null);
        if (!!mintIfNotExists) {
          mintLoyalty(owner);
        }
      });
  };

  const mintLoyalty = async (owner: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::loyalty::mint`,
      arguments: [tx.object("0x6")],
    });
    tx.setSender(owner);

    sponsorSignAndExecute({
      tx,
      include: { objectTypes: true, effects: true },
    })
      .then((resp) => {
        if (!resp) {
          throw new Error("Error minting new loyalty");
        }
        const txResult = resp.Transaction ?? resp.FailedTransaction;
        if (!txResult) {
          throw new Error("Transaction result missing");
        }
        if (!txResult.status.success) {
          throw new Error(txResult.status.error?.message || "Transaction failed");
        }
        const createdLoyalty = txResult.effects?.changedObjects.find(
          (change) =>
            change.idOperation === "Created" &&
            txResult.objectTypes?.[change.objectId] ===
              `${process.env.NEXT_PUBLIC_PACKAGE}::loyalty::Loyalty`,
        );
        if (!createdLoyalty) {
          throw new Error("Error minting new loyalty");
        }
        toast.success("Welcome, we just created a new loyalty card for you!");
        setTimeout(() => {
          reFetchLoyalty(owner, false);
        }, 5000);
      })
      .catch(() => {});
  };

  return (
    <LoyaltyContext.Provider value={{ loyalty, reFetchLoyalty }}>
      {children}
    </LoyaltyContext.Provider>
  );
};
