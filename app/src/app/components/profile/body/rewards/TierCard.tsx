import { displayLargeNumber } from "@/app/helpers/displayLargeNumber";
import { TierProps } from "@/app/helpers/getLoyaltyCardTiresDetails";
import Image from "next/image";
import React from "react";

export const TierCard = ({ name, lowerLimit, reward }: TierProps) => {
  return (
    <div className="flex flex-col space-y-1 items-center rounded-xl bg-white p-2">
      <div className="font-[700] text-sm text-sui-greys-90">{name}</div>
      <div className="flex justify-center space-x-1 text-warning-foreground">
        <Image
          src="/points_icon_light.svg"
          alt="points"
          width={15}
          height={15}
        />
        <div className="font-bold">{displayLargeNumber(lowerLimit || 0)}</div>
        <div className="text-xs text-center flex items-center text-[#BE8D00]">
          pts
        </div>
      </div>
      <div className="text-sui-steel-80 text-xs">{reward}</div>
    </div>
  );
};
