import { getLoyaltyCardTiresDetails } from "@/app/helpers/getLoyaltyCardTiresDetails";
import { useLoyalty } from "@/app/hooks/useLoyalty";
import React from "react";
import { TierCard } from "./TierCard";

export const NextTiers = () => {
  const { loyalty } = useLoyalty();

  const { nextTiers } = getLoyaltyCardTiresDetails(
    loyalty?.loyalty_points || 0,
  );

  if (!nextTiers?.length) return null;

  return (
    <div className="space-y-2">
      <div className="text-sui-steel-80 text-sm">Next Tiers</div>
      <div className="grid grid-cols-2 w-full gap-3">
        {nextTiers.map((tier) => (
          <TierCard key={tier.name} {...tier} />
        ))}
      </div>
    </div>
  );
};
