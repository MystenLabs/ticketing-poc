"use client";

import { useContext, useMemo } from "react";
import { NotificationsContext } from "../contexts/notifications/NotificationsContext";

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  return context;
};
