import { getLoyaltyCardTiresDetails } from "@/app/helpers/getLoyaltyCardTiresDetails";
import { useLoyalty } from "@/app/hooks/useLoyalty";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { displayLargeNumber } from "@/app/helpers/displayLargeNumber";
import { LoyaltyStepper } from "./LoyaltyStepper";
import Link from "next/link";
import { Waves } from "../general/Waves";

interface LoyaltyCardProps {
  size?: "sm" | "md";
}

export const LoyaltyCard = ({ size = "md" }: LoyaltyCardProps) => {
  const { loyalty } = useLoyalty();
  const { currentTier, pointsToNextTier, nextTier } =
    getLoyaltyCardTiresDetails(loyalty?.loyalty_points || 0);

  return (
    <Link
      className={`relative overflow-hidden px-5 ${
        size === "md" ? "py-3 space-y-5" : "py-3 space-y-2"
      } rounded-xl border-rounded-xl flex flex-col items-center`}
      style={{
        background:
          "linear-gradient(142.43deg, #FFD6B0 -11.13%, #D7A04F 87.84%), linear-gradient(142.43deg, #FFE9B0 -11.13%, #D7B34F 87.84%), linear-gradient(128.85deg, #FFFFFF 7.83%, rgba(255, 255, 255, 0) 97.86%)",
        border: "2px solid",
        borderRadius: "20px",
        borderColor: "transparent",
      }}
      href="/profile?tab=rewards"
    >
      <Waves />
      <div className="flex flex-col space-y-1 items-center text-warning-extra-dark">
        <div className="flex justify-center space-x-1">
          <Image
            src="/points_icon_dark.svg"
            alt="points"
            width={15}
            height={15}
          />
          <div className="text-3xl font-bold">
            {displayLargeNumber(loyalty?.loyalty_points || 0)}
          </div>
          <div className="text-xs text-center flex items-center opacity-70">
            pts
          </div>
        </div>
        {!!currentTier && (
          <div className="text-xs font-bold">{currentTier?.name} Tier</div>
        )}
      </div>
      <LoyaltyStepper loyaltyPoints={loyalty?.loyalty_points || 0} />
      <hr className="w-full border-warning-foreground" />
      <div
        className={`flex ${
          size === "md" ? "justify-between" : "justify-center"
        } items-center w-full`}
      >
        <div className="text-xs opacity-60">
          {!!nextTier && (
            <>
              <span>{displayLargeNumber(pointsToNextTier)} points to </span>
              <span className="font-semibold">{nextTier?.name} Tier</span>
            </>
          )}
        </div>
        {size === "md" && (
          <div className="text-xs font-semibold text-gray-700 bg-warning-foreground/60 px-2 py-1 rounded">
            Details
          </div>
        )}
      </div>
    </Link>
  );
};
