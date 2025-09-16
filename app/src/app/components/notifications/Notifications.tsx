import { useNotifyForTicketUpdates } from "@/app/hooks/useNotifyForTicketUpdates";
import React from "react";

interface NotificationsProps {
  children: React.ReactNode | React.ReactNode[];
}
export const Notifications = ({ children }: NotificationsProps) => {
  const _ = useNotifyForTicketUpdates();

  return children;
};
