import { Notifications } from "@prisma/client";

export type NotificationType =
  | "General"
  | "Task"
  | "Event"
  | "Announcement"
  | "ProfileUpdate"
  | "UserCreation"
  | "Verification"
  | "RoleChange"
  | "Alert"
  | "Achievement"
  | "Reminder"
  | "Reward"
  | "Security";

export type NotificationCreator =
  | "Applicant"
  | "Account"
  | "Admin"
  | "CEO"
  | "Manager"
  | "Employee";

export interface NotificationUser {
  fullName: string;
  userImage: string | null;
}

export interface NotificationData extends Notifications {
  user?: NotificationUser;
}

export interface NotificationProps {
  user: {
    userId: string;
    fullName?: string;
  } | null;
  notifications: NotificationData[] | null;
}

export interface NotificationFilterState {
  showAll: boolean;
  showUnread: boolean;
  showRead: boolean;
}

export interface NotificationCardProps {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  isRead: boolean;
}

const notificationTypes: NotificationType[] = [
  "General",
  "Task",
  "Event",
  "Announcement",
];
