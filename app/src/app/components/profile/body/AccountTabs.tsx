import React from "react";
import { GeneralAccountInformation } from "./GeneralAccountInformation";
import { NotificationsPermissions } from "./NotificationsPermissions";
import { Button } from "../../ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import { useCurrentWallet, useDisconnectWallet } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";

export const AccountTab = () => {
  const { currentWallet } = useCurrentWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const router = useRouter();

  const handleLogout = () => {
    disconnect();
    router.push("/");
  };

  return (
    <div className="space-y-3">
      <GeneralAccountInformation />
      <NotificationsPermissions />
      <Button
        onClick={handleLogout}
        className="flex items-center space-x-2 text-white w-full"
        size="lg"
      >
        <ExitIcon />
        <div>Logout</div>
      </Button>
    </div>
  );
};
