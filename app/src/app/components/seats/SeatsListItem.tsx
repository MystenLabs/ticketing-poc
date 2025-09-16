import { Seat } from "@/app/types/Seat";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

export const SeatsListItem = ({
  price,
  name,
  seatsLeftNumber,
  loyaltyPoints,
}: Seat) => {
  return (
    <div className="flex justify-between items-center space-x-3">
      <div className="rounded-lg border-[1px] border-sui-steel-40 px-[20px] py-[10px] text-sui-greys-90 font-bold">
        ${price}
      </div>
      <div className="flex-1 text-start">
        <div className="text-sui-greys-90 font-[590] text-sm">{name}</div>
        <div className="text-sm text-sui-steel-80 text-xs">
          {seatsLeftNumber} seats
        </div>
        <div className="text-sm text-warning-foreground flex items-center space-x-2">
          <Image
            src={"/points_icon_light.svg"}
            alt="points"
            width={10}
            height={10}
          />
          <div className="text-xs">{loyaltyPoints} loyalty points</div>
        </div>
      </div>
      <Image src={"/arrow_right.svg"} alt="arrow" width={6} height={6} />
    </div>
  );
};
