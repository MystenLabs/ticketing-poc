import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NotificationsContext } from "./NotificationsContext";
import { useServiceWorker } from "@/app/hooks/useServiceWorker";

export interface SendNotificationProps {
  title: string;
  body?: string;
  url?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface NotificationsProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  const { registration, handleRefreshServiceWorker } = useServiceWorker();
  const [canReceiveNotifications, setCanReceiveNotifications] = useState(false);
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [hasGivenPermission, setHasGivenPermission] = useState(false);

  useEffect(() => {
    setCanReceiveNotifications("Notification" in window);
    setHasServiceWorker("serviceWorker" in navigator);
  }, []);

  useEffect(() => {
    if (canReceiveNotifications || hasServiceWorker) {
      setHasGivenPermission(Notification.permission === "granted");
    } else {
      setHasGivenPermission(false);
    }
  }, [canReceiveNotifications, hasServiceWorker]);

  const handleRequestNotificationPermission = () => {
    if (!canReceiveNotifications && !hasServiceWorker) {
      toast.error("Install the app to receive notifications");
      return;
    }
    // toast.success("Asking");
    // toast.success("Notification.permission:" + Notification.permission);
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // User has granted permission
        localStorage.setItem("notificationsPermission", "granted");
        // handleRefreshServiceWorker();
        // window.location.reload();
        navigator.serviceWorker.getRegistration().then((registration) => {
          registration?.update();
        });
        setHasGivenPermission(true);
        toast.success("Notifications enabled!");
      } else if (permission === "denied") {
        // User has denied permission
      } else {
        // Permission request ignored
      }
    });
  };

  const sendNotification = ({
    title = "PoC Template NextJS",
    body = "This is a test notification",
    url = "/",
    actions = [],
  }: SendNotificationProps) => {
    if (!canReceiveNotifications || !hasServiceWorker) {
      toast.error("Notifications not supported...");
    }

    const customPushData = {
      title,
      body,
      icon: "/logo_square.png",
      badge: "/logo_square.png",
      data: {
        url,
      },
    };

    if ("serviceWorker" in navigator && "MessageChannel" in window) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        registration?.showNotification(title, customPushData);
      });
    }
  };

  const sendTestNotification = () => {
    sendNotification({
      title: "PoC Template NextJS",
      body: "Open this notification to be redirected to the home page",
      actions: [],
    });
  };

  return (
    <NotificationsContext.Provider
      value={{
        canReceiveNotifications,
        hasGivenPermission,
        hasServiceWorker,
        sendNotification,
        sendTestNotification,
        handleRequestNotificationPermission,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
