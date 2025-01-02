"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCheck, Bell } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { filterNotifications } from "@/lib/utils";
import {
  NotificationFilterState,
  NotificationProps,
} from "@/types/notications";
import { NotificationCard } from "./NotificationCard";

export default function NotificationsPage({
  user,
  notifications,
}: NotificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentNotifications, setCurrentNotifications] =
    useState(notifications);
  const [filters, setFilters] = useState<NotificationFilterState>({
    showAll: true,
    showUnread: false,
    showRead: false,
  });
  const router = useRouter();

  useEffect(() => {
    setCurrentNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      setIsLoading(true);
      await axios.patch("/api/user/notifications/checkAll", {
        userId: user?.userId,
      });
      // Update local state
      setCurrentNotifications(
        (prev) =>
          prev?.map((notification) => ({
            ...notification,
            isRead: true,
          })) || null
      );
      router.refresh();
      toast.success("All notifications marked as read");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setIsLoading(true);
      await axios.patch("/api/user/notifications/checkOne", {
        notificationId,
      });
      // Update local state
      setCurrentNotifications(
        (prev) =>
          prev?.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          ) || null
      );
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications = filterNotifications(
    currentNotifications,
    filters
  );
  const unreadCount =
    currentNotifications?.filter((n) => !n.isRead).length || 0;
  const readCount = currentNotifications?.filter((n) => n.isRead).length || 0;
  const totalCount = currentNotifications?.length || 0;

  if (isInitialLoad) {
    return (
      <div className='container max-w-4xl py-8 flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='container w-full py-8 space-y-8'>
      <div className='flex items-center flex-wrap gap-5 justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight'>Notifications</h1>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='flex h-6 w-6 items-center justify-center rounded-full bg-primary'
              >
                <span className='text-xs font-medium text-primary-foreground'>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </motion.div>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>
            Manage your notification preferences and history
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2'
          onClick={handleMarkAllAsRead}
          disabled={isLoading || unreadCount === 0}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <CheckCheck className='h-4 w-4' />
          )}
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue='all' className='w-full'>
        <TabsList>
          <TabsTrigger
            value='all'
            onClick={() =>
              setFilters({ showAll: true, showUnread: false, showRead: false })
            }
          >
            All ({totalCount})
          </TabsTrigger>
          <TabsTrigger
            value='unread'
            onClick={() =>
              setFilters({ showAll: false, showUnread: true, showRead: false })
            }
            className='relative'
          >
            Unread ({unreadCount})
            {unreadCount > 0 && (
              <motion.span
                className='absolute right-0 top-0 h-2 w-2 rounded-full bg-primary'
                layoutId='notification-dot'
              />
            )}
          </TabsTrigger>
          <TabsTrigger
            value='read'
            onClick={() =>
              setFilters({ showAll: false, showUnread: false, showRead: true })
            }
          >
            Read ({readCount})
          </TabsTrigger>
        </TabsList>

        {[
          { value: "all", notifications: filteredNotifications },
          {
            value: "unread",
            notifications: filteredNotifications.filter((n) => !n.isRead),
          },
          {
            value: "read",
            notifications: filteredNotifications.filter((n) => n.isRead),
          },
        ].map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className='space-y-4 mt-4'
          >
            <AnimatePresence mode='popLayout'>
              {tab.notifications.length > 0 ? (
                tab.notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    isRead={notification.isRead}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='flex flex-col items-center justify-center py-12 text-center'
                >
                  <Bell className='h-12 w-12 text-muted-foreground/50 mb-4' />
                  <p className='text-lg font-medium'>
                    No notifications to show
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {filters.showAll
                      ? "When you receive notifications, they will appear here"
                      : filters.showUnread
                      ? "You have no unread notifications"
                      : "You have no read notifications"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
