import Image from "next/image";
import React from "react";

interface LoyaltyPointsChipProps {
  points: number;
  darkText?: boolean;
}

export const LoyaltyPointsChip = ({
  points,
  darkText = true,
}: LoyaltyPointsChipProps) => {
  return (
    <div
      className={`text-xs px-2 py-[2px] bg-warning ${
        darkText ? "text-warning-dark font-700" : "text-warning-foreground"
      } rounded-md font-bold flex justify-center items-center space-x-1`}
    >
      <Image
        src={darkText ? "/points_icon_dark.svg" : "points_icon_light.svg"}
        alt="points"
        width={11}
        height={11}
      />
      <div>{points}+</div>
    </div>
  );
};
