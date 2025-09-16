import { Loyalty } from "./Loyalty";

export interface LoyaltyContextProps {
  loyalty: Loyalty | null;
  reFetchLoyalty: (owner: string) => void;
}
