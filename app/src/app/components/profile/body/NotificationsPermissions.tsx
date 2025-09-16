import React from "react";
import { GeneralCard } from "../../general/GeneralCard";
import Image from "next/image";
import { Switch } from "../../ui/switch";
import { useNotifications } from "@/app/hooks/useNotifications";
import toast from "react-hot-toast";

export const NotificationsPermissions = () => {
  const { hasGivenPermission, handleRequestNotificationPermission } =
    useNotifications();

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      handleRequestNotificationPermission();
    }
  };

  const handleShowComingSoon = () => {
    toast.error("Coming soon...");
  };

  return (
    <div className="space-y-2">
      <div className="text-gray-500 text-sm">Notifications</div>
      <div className="space-y-1">
        <GeneralCard
          icon={
            <Image
              src="/blue_tickets.svg"
              width={18}
              height={18}
              alt="tickets"
            />
          }
          title={"Ticket Updates"}
          subtitle={""}
          action={
            <Switch
              checked={hasGivenPermission}
              onCheckedChange={handleCheckedChange}
            />
          }
          iconPadding={2}
        />
        <GeneralCard
          icon={
            <Image src="/blue_star.svg" width={10} height={10} alt="events" />
          }
          title={"New Events Near You"}
          subtitle={""}
          action={
            <Switch checked={false} onCheckedChange={handleShowComingSoon} />
          }
        />
        <GeneralCard
          icon={
            <Image
              src="/points_icon_blue.svg"
              width={10}
              height={10}
              alt="points"
            />
          }
          title={"Points and Rewards Reminders"}
          subtitle={""}
          action={
            <Switch checked={false} onCheckedChange={handleShowComingSoon} />
          }
          iconPadding={6}
        />
      </div>
    </div>
  );
};
