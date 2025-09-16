import { SendNotificationProps } from "../contexts/notifications/NotificationsProvider";

export interface NotificationContextProps {
  canReceiveNotifications: boolean;
  hasGivenPermission: boolean;
  hasServiceWorker: boolean;
  sendNotification: (props: SendNotificationProps) => void;
  sendTestNotification: () => void;
  handleRequestNotificationPermission: () => void;
}
