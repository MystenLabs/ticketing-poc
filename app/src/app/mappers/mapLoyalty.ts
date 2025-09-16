import { Loyalty, OnChainLoyalty } from "../types/Loyalty";

export const mapLoyalty = (loyalty: OnChainLoyalty): Loyalty => {
  return {
    id: loyalty.id.id,
    loyalty_points: parseInt(loyalty.loyalty_points),
    tenure_date: parseInt(loyalty.tenure_date),
  };
};
