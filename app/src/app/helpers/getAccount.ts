import { jwtDecode } from "jwt-decode";
import { Account } from "../types/Account";

export const getAccount = (jwt: string): Account => {
  const decoded: any = jwtDecode(jwt);
  return {
    firstName: decoded["given_name"],
    lastName: decoded["family_name"],
    email: decoded["email"],
    picture: decoded["picture"],
  };
};
