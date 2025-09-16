import { Account } from "./Account";

export interface AccountContextProps {
  account: Account | null;
  setAccount: (account: Account | null) => void;
}
