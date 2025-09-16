import Image from "next/image";
import React from "react";
import { LoyaltyCard } from "../../loyaltyCard/LoyaltyCard";
import { getAccount } from "@/app/helpers/getAccount";
import { useSession } from "@/app/hooks/useSession";

export const ProfileRewardsCard = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  if (isSessionLoading || !session?.jwt) return null;
  const account = getAccount(session.jwt);

  return (
    <div className="w-full">
      <div className="z-1 relative rounded-t-xl w-full h-[70px] bg-white">
        <div className="flex justify-between items-center w-full py-2 px-2">
          <div className="flex items-center space-x-1">
            <Image
              src={account.picture || "/user_profile_image.svg"}
              alt="user"
              width={25}
              height={25}
              className="rounded-full"
            />
            <div className="text-sui-greys-90 text-base font-[700]">
              {account.firstName} {account.lastName}
            </div>
          </div>
          <div className="text-sui-steel-80 font-[400] text-xs">
            {account.email}
          </div>
        </div>
      </div>
      <div className="mt-[-30px]">
        <LoyaltyCard size="sm" />
      </div>
    </div>
  );
};
