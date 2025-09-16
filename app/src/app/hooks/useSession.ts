import { useCurrentWallet } from "@mysten/dapp-kit";
import { getSession } from "@mysten/enoki";
import { useEffect, useState } from "react";

/**
 * Custom hook to get session data with proper wallet context
 * Handles async getSession() that may require a wallet parameter
 */
export const useSession = () => {
  const { currentWallet } = useCurrentWallet();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      if (!currentWallet) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        let sessionData = await getSession(currentWallet);
        setSession(sessionData);
      } catch (error) {
        console.warn("Failed to get session:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [currentWallet]);

  return { session, isLoading };
};
