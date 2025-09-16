"use client";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoyaltyProvider } from "./loyalty/LoyaltyProvider";
import { NotificationsProvider } from "./notifications/NotificationsProvider";
import { Notifications } from "../components/notifications/Notifications";
import { Navbar } from "../components/navbar/Navbar";
import { ServiceWorkerProvider } from "./serviceWorker/ServiceWorkerProvider";
import { PWADownload } from "../components/pwaDownload/PWADownload";
import { RegisterEnokiWallets } from "@/app/contexts/RegisterEnokiWallets";

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

export default function GlobalContexts({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined" && !("Notification" in window)) {
    return (
      <main>
        <PWADownload />
      </main>
    );
  }

  const queryClient = new QueryClient();

  return (
    <ServiceWorkerProvider>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <RegisterEnokiWallets />
          <WalletProvider autoConnect>
            <NotificationsProvider>
              <LoyaltyProvider>
                <Notifications>
                  <main className="relative space-y-3 flex flex-col justify-between min-h-[-webkit-fill-available] md:min-h-[100vh] bg-gray-100">
                    {children}
                    <Navbar />
                  </main>
                </Notifications>
                <Toaster position="bottom-center" />
              </LoyaltyProvider>
            </NotificationsProvider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ServiceWorkerProvider>
  );
}
