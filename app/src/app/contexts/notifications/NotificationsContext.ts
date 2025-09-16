import { NotificationContextProps } from "@/app/types/NotificationsContextProps";
import React, { createContext } from "react";

export const NotificationsContext = createContext<NotificationContextProps>({
  canReceiveNotifications: false,
  hasGivenPermission: false,
  hasServiceWorker: false,
  sendNotification: () => {},
  sendTestNotification: () => {},
  handleRequestNotificationPermission: () => {},
});
