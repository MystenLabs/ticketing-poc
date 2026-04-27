import { useCurrentClient } from "@mysten/dapp-kit-react";

export const useSui = () => {
  const suiClient = useCurrentClient();

  return {
    suiClient,
  };
};
