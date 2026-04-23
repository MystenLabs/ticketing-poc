"use client";

import {
  DAppKitProvider,
} from "@mysten/dapp-kit-react";
import { Toaster } from "react-hot-toast";
import { LoyaltyProvider } from "./loyalty/LoyaltyProvider";
import { NotificationsProvider } from "./notifications/NotificationsProvider";
import { Notifications } from "../components/notifications/Notifications";
import { Navbar } from "../components/navbar/Navbar";
import { ServiceWorkerProvider } from "./serviceWorker/ServiceWorkerProvider";
import { PWADownload } from "../components/pwaDownload/PWADownload";
import { RegisterEnokiWallets } from "@/app/contexts/RegisterEnokiWallets";
import { dAppKit } from "@/app/lib/dappKit";

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

  return (
    <ServiceWorkerProvider>
      <DAppKitProvider dAppKit={dAppKit}>
        <RegisterEnokiWallets />
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
      </DAppKitProvider>
    </ServiceWorkerProvider>
  );
}
