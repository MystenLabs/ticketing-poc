import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

interface WayToEarnProps {
  loyaltyPoints: number;
  description: string;
  status: string | React.ReactNode;
}

export const HowToEarn = () => {
  const ways = useMemo<WayToEarnProps[]>(
    () => [
      {
        loyaltyPoints: 100,
        description: "For every $1 spent",
        status: "$150 Spent",
      },
      {
        loyaltyPoints: 20,
        description: "Login 7 Days in a Row",
        status: "Day 2 of 7",
      },
      {
        loyaltyPoints: 50,
        description: "Refer your friends!",
        status: (
          <Link href="#" className="p-0 text-primary font-semibold">
            Invite
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-2">
      <div className="text-sui-steel-80 text-sm">How to Earn</div>
      <div className="space-y-3 py-3 rounded-xl bg-white">
        {ways.map(({ loyaltyPoints, description, status }, index) => (
          <div key={index} className="flex justify-between items-center px-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-[50px]">
                <Image
                  src="/points_icon_light.svg"
                  alt="points"
                  width={14}
                  height={14}
                />
                <div className="font-[700] !text-sui-greys-90 text-sm">
                  {loyaltyPoints}
                </div>
              </div>
              <div className="text-sui-greys-90 font-[400] text-xs">
                {description}
              </div>
            </div>
            <div className="text-sui-steel-60 text-xs">{status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
