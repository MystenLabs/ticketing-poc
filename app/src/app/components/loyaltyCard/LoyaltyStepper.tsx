import { getLoyaltyCardTiresDetails } from "@/app/helpers/getLoyaltyCardTiresDetails";
import React from "react";

interface LoyaltyStepperProps {
  loyaltyPoints: number;
}

interface DotProps {
  isActive: boolean;
}

const Dot = ({ isActive }: DotProps) => {
  return (
    <div
      className={`w-6 h-6 rounded-full ${
        isActive ? "bg-white" : "bg-warning-foreground"
      }`}
    ></div>
  );
};

interface LineProps {
  coverage: number;
}

const Line = ({ coverage }: LineProps) => {
  return (
    <div className="h-1 bg-gray-300 w-full bg-warning-foreground overflow-hidden mt-[15px]">
      <div
        className="h-full bg-white"
        style={{ width: `${coverage * 100}%` }}
      ></div>
    </div>
  );
};

export const LoyaltyStepper = ({ loyaltyPoints }: LoyaltyStepperProps) => {
  const { limits } = getLoyaltyCardTiresDetails(loyaltyPoints);

  return (
    <div className="flex justify-between w-full">
      {limits.map((limit, index) => {
        const distanceToCover = limit - limits[index - 1];
        const distanceCovered = loyaltyPoints - limits[index - 1];
        let coverage =
          loyaltyPoints > limit
            ? 1
            : loyaltyPoints < limits[index - 1]
              ? 0
              : distanceCovered / distanceToCover;
        return (
          <div
            key={index}
            className={`text-center flex items-center justify-end ${
              index > 0 ? "w-full" : "auto"
            }`}
          >
            {index > 0 && <Line coverage={coverage} />}
            <div className="flex flex-col space-y-1">
              <div className="text-xs text-gray-500">{`${limit / 1000}k`}</div>
              <Dot isActive={Number(limit) <= loyaltyPoints} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
