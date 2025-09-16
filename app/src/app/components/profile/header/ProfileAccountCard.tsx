import { displayLargeNumber } from "@/app/helpers/displayLargeNumber";
import { getLoyaltyCardTiresDetails } from "@/app/helpers/getLoyaltyCardTiresDetails";
import { useLoyalty } from "@/app/hooks/useLoyalty";
import Image from "next/image";
import React from "react";
import { Waves } from "../../general/Waves";
import { getAccount } from "@/app/helpers/getAccount";
import { useSession } from "@/app/hooks/useSession";

export const ProfileAccountCard = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { loyalty } = useLoyalty();
  const { currentTier } = getLoyaltyCardTiresDetails(
    loyalty?.loyalty_points || 0,
  );

  if (isSessionLoading || !session?.jwt) return null;

  const account = getAccount(session?.jwt);

  return (
    <div className="w-full">
      <div
        className="z-1 relative rounded-t-xl w-full h-[70px] overflow-hidden"
        style={{
          background:
            "linear-gradient(142.43deg, #FFD6B0 -11.13%, #D7A04F 87.84%), linear-gradient(142.43deg, #FFE9B0 -11.13%, #D7B34F 87.84%), linear-gradient(128.85deg, #FFFFFF 7.83%, rgba(255, 255, 255, 0) 97.86%)",
        }}
      >
        <Waves />
        <div className="flex justify-between items-center w-full py-2 px-2">
          <div className="flex justify-center space-x-1">
            <Image
              src="/points_icon_dark.svg"
              alt="points"
              width={15}
              height={5}
            />
            <div className="text-warning-extra-dark text-lg font-bold">
              {displayLargeNumber(loyalty?.loyalty_points || 0)}
            </div>
            <div className="text-xs text-center flex items-center">pts</div>
          </div>
          {!!currentTier && (
            <div className="text-xs font-semibold">
              {currentTier?.name} Tier
            </div>
          )}
        </div>
      </div>
      <div className="z-10 relative flex flex-col items-center bg-white rounded-xl mt-[-30px] w-full py-5 px-2 h-[170px]">
        <Image
          src={account.picture || "/user_profile_image.svg"}
          alt="user"
          width={80}
          height={80}
          className="bg-secondary rounded-full"
        />
        <div className="font-[700] text-sui-greys-90">
          {account.firstName} {account.lastName}
        </div>
        <div className="text-sm text-sui-steel-80 font-[400]">
          {account.email}
        </div>
      </div>
    </div>
  );
};
