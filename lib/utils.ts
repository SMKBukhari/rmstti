import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Notifications } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatedString = (input: string) => {
  // split the strings based on the delimiter "-"
  const parts = input.split("-");

  // capitalize the each words
  const capitalize = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });

  return capitalize.join(" ");
};

export const getNotificationTime = (date: Date) => {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
};

export const filterNotifications = (
  notifications: Notifications[] | null,
  filters: { showAll: boolean; showUnread: boolean; showRead: boolean }
) => {
  if (!notifications) return [];
  if (filters.showAll) return notifications;
  if (filters.showUnread) return notifications.filter((n) => !n.isRead);
  if (filters.showRead) return notifications.filter((n) => n.isRead);
  return notifications;
};
