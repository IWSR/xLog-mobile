import { createContext } from "react";

import type * as Notifications from "expo-notifications";

interface NotificationContextType {
  expoPushToken?: string
  notification?: Notifications.Notification
  requestPermissions: () => Promise<string>
}

export const NotificationContext = createContext<NotificationContextType | null>(null);
