import { LoyaltyContextProps } from "@/app/types/LoyaltyContextProps";
import { createContext } from "react";

export const LoyaltyContext = createContext<LoyaltyContextProps>({
  loyalty: null,
  reFetchLoyalty: () => {},
});
