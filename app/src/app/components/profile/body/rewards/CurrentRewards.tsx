import { Button } from "@/app/components/ui/button";
import { getLoyaltyCardTiresDetails } from "@/app/helpers/getLoyaltyCardTiresDetails";
import { useLoyalty } from "@/app/hooks/useLoyalty";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

export const CurrentReward = () => {
  const { loyalty } = useLoyalty();
  const currentReward = useMemo(
    () =>
      getLoyaltyCardTiresDetails(loyalty?.loyalty_points || 0).currentTier
        ?.reward,
    [loyalty?.loyalty_points],
  );

  if (!currentReward) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sui-steel-80 text-sm">Current Reward</div>
        <Link
          href="#"
          className="flex space-x-1 text-primary text-sm items-center font-bold"
        >
          <span>History</span>
          <Image
            src="/arrow_top_right.svg"
            alt="arrow-top-right"
            width={11}
            height={11}
          />
        </Link>
      </div>
      <div
        className="flex space-x-2 justify-between items-center bg-white px-3 py-1 rounded-3xl w-full"
        style={{
          border: "2px solid",
          borderImageSource:
            "linear-gradient(168.79deg, #FFFFFF 27.28%, #B38429 170.86%)",
          background:
            "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(168.79deg, #FFFFFF 27.28%, #B38429 170.86%)",
        }}
      >
        <div className="flex space-x-2 items-center">
          <Image
            src="/present.svg"
            alt="present"
            width={50}
            height={50}
            className="rounded-full p-4 bg-[#F8E7C7] mt-1"
          />
          <div className="flex flex-col text-start flex-1">
            <div className="text-sui-steel-80 font-[400] text-xs">Reward</div>
            <div className="font-[700] text-sui-greys-90 text-base">
              {currentReward}
            </div>
          </div>
        </div>
        <Button size={"sm"} className="text-white rounded-3xl bg-info">
          Redeem
        </Button>
      </div>
    </div>
  );
};
