import { useEffect, useState } from "react";
import { LoyaltyContext } from "./LoyaltyContext";
import { useSui } from "@/app/hooks/useSui";
import { Loyalty, OnChainLoyalty } from "@/app/types/Loyalty";
import { mapLoyalty } from "@/app/mappers/mapLoyalty";
import { toast } from "react-hot-toast";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useSponsorSignAndExecute } from "@/app/hooks/useSponsorSignAndExecute";

interface LoyaltyProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const LoyaltyProvider = ({ children }: LoyaltyProviderProps) => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;
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
      .getOwnedObjects({
        owner,
        options: {
          showType: true,
          showContent: true,
        },
      })
      .then((resp) => {
        const loyaltyOnChainObject = resp.data.find((object) => {
          return (
            object.data?.type ===
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
        const loyaltyObject = mapLoyalty(
          (loyaltyOnChainObject as any).data.content.fields as OnChainLoyalty,
        );
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
      options: { showObjectChanges: true, showEffects: true },
    })
      .then((resp) => {
        const createdLoyalty = resp!.objectChanges?.find(
          ({ type, objectType }: any) =>
            type === "created" &&
            objectType ===
              `${process.env.NEXT_PUBLIC_PACKAGE}::loyalty::Loyalty`,
        );
        if (!createdLoyalty) {
          throw new Error("Error minting new loyalty");
        }
        const loyaltyId = (createdLoyalty as any)?.objectId;
        toast.success("Welcome, we just created a new loyalty card for you!");
        setTimeout(() => {
          reFetchLoyalty(owner, false);
        }, 5000);
      })
      .catch((err) => {});
  };

  return (
    <LoyaltyContext.Provider value={{ loyalty, reFetchLoyalty }}>
      {children}
    </LoyaltyContext.Provider>
  );
};
