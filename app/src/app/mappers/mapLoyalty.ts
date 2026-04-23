import { Loyalty, OnChainLoyalty } from "../types/Loyalty";

export const mapLoyalty = (loyalty: OnChainLoyalty): Loyalty => {
  const loyaltyId =
    typeof loyalty.id === "string" ? loyalty.id : loyalty.id.id;
  return {
    id: loyaltyId,
    loyalty_points: parseInt(loyalty.loyalty_points),
    tenure_date: parseInt(loyalty.tenure_date),
  };
};
