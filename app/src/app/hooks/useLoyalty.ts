import { useContext } from "react";
import { LoyaltyContext } from "../contexts/loyalty/LoyaltyContext";

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  return context;
};
