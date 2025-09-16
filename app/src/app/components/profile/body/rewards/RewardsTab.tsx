import React from "react";
import { CurrentReward } from "./CurrentRewards";
import { NextTiers } from "./NextTiers";
import { HowToEarn } from "./HowToEarn";

export const RewardsTab = () => {
  return (
    <div className="space-y-3">
      <CurrentReward />
      <NextTiers />
      <HowToEarn />
    </div>
  );
};
