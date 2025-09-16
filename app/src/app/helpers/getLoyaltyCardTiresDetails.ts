export interface TierProps {
  lowerLimit: number;
  upperLimit: number;
  name: string;
  reward: string;
}

export const getLoyaltyCardTiresDetails = (loyaltyPoints: number) => {
  const tiers = [
    {
      lowerLimit: 1000,
      upperLimit: 2500,
      name: "Bronze",
      reward: "Small Beverage",
    },
    {
      lowerLimit: 2500,
      upperLimit: 5000,
      name: "Silver",
      reward: "Large Drink / Snack",
    },
    {
      lowerLimit: 5000,
      upperLimit: 10000,
      name: "Gold",
      reward: "Entree ($15 limit)",
    },
    {
      lowerLimit: 10000,
      upperLimit: 25000,
      name: "Platinum",
      reward: "Club Lounge Access",
    },
  ];

  const diamondTier = {
    lowerLimit: 25000,
    upperLimit: 100000,
    name: "Diamond",
    reward: "Seating Upgrade",
  };

  const currentTier = tiers.find(
    (tier) =>
      loyaltyPoints >= tier.lowerLimit && loyaltyPoints < tier.upperLimit,
  );

  const nextTier = !currentTier
    ? tiers[0]
    : [...tiers, diamondTier].find((tier) => loyaltyPoints < tier.lowerLimit);
  const nextTiers = [...tiers, diamondTier].filter(
    (tier) => loyaltyPoints < tier.lowerLimit,
  );

  return {
    currentTier,
    nextTier,
    nextTiers,
    pointsToNextTier: nextTier ? nextTier.lowerLimit - loyaltyPoints : 0,
    limits: [1000, ...tiers.map(({ upperLimit }) => upperLimit)],
  };
};
