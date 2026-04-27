import React from "react";
import { GeneralCard } from "../../general/GeneralCard";
import Image from "next/image";
import { formatAddress } from "@mysten/sui/utils";
import Link from "next/link";
import { getNetworkName } from "@/app/helpers/getNetworkName";
import { useSession } from "@/app/hooks/useSession";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

export const GeneralAccountInformation = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;

  if (isSessionLoading || !session?.jwt) return null;

  return (
    <div className="space-y-2">
      <div className="text-gray-500 text-sm">General</div>
      <div className="space-y-1">
        <GeneralCard
          icon={
            <Image src="/password.svg" alt="Password" height={5} width={5} />
          }
          title={"SUI Address"}
          subtitle={address ? formatAddress(address) : "No address"}
          action={
            <Link
              href={`https://suiexplorer.com/address/${address}?network=${getNetworkName()}`}
              target="_blank"
              rel="noopenner oreferrer"
            >
              <Image
                src="/arrow_right.svg"
                alt="arrow-right"
                width={6}
                height={6}
              />
            </Link>
          }
        />
        <GeneralCard
          icon={
            <Image src="/password.svg" alt="Password" height={5} width={5} />
          }
          title={"Password"}
          subtitle={"Updated 1 day ago"}
          action={
            <Image
              src="/arrow_right.svg"
              alt="arrow-right"
              width={6}
              height={6}
            />
          }
        />
      </div>
    </div>
  );
};
