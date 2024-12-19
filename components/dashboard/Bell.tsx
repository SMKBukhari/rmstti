"use client";
import { Notifications, UserProfile } from "@prisma/client";
import { Bell, CheckCheck, Loader2, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserImage } from "@/components/UserImage";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface BellNotificationProps {
  user: UserProfile | null;
  notifications:
    | (Notifications & {
        user: { fullName: string; userImage: string | null };
      })[]
    | null;
}

const BellNotification = ({ user, notifications }: BellNotificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [removedNotifications, setRemovedNotifications] = useState<string[]>(
    []
  );
  const router = useRouter();
  const avatarFallback = user?.fullName?.substring(0, 2).toUpperCase();

  const unreadNotifications =
    notifications?.filter((notification) => !notification.isRead) || [];

  const onCheckAll = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch("/api/user/notifications/checkAll", {
        userId: user?.userId,
      });
      setRemovedNotifications(unreadNotifications.map((notif) => notif.id));
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

  const onCheckOne = async (notificationId: string) => {
    try {
      setIsLoading(true);
      // Send notification ID to the backend to mark it as read
      const response = await axios.patch("/api/user/notifications/checkOne", {
        notificationId,
      });
      router.refresh();
      setRemovedNotifications((prev) => [
        ...(prev || []), // If prev is undefined, default to an empty array
        notificationId,
      ]);
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

  return (
    <Popover>
      <PopoverTrigger>
        <div className='relative'>
          <Bell className='w-6 h-6' />
          {/* Show dot if there is an unread notification */}
          {unreadNotifications?.length > 0 && (
            <div className='absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-500'>
              <p className='text-sm'>
                {unreadNotifications?.length < 9
                  ? unreadNotifications?.length
                  : "9+"}
              </p>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='md:w-96 w-64 px-0'>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-center px-4'>
            <h3 className='font-medium text-sm'>Notifications</h3>
            <div className='flex gap-5 items-center'>
              <p className='text-xs text-[#ffff] bg-[#295B81]/70 dark:bg-[#1034ff]/70 py-1 px-2 rounded-sm'>
                {unreadNotifications?.length} New
              </p>
              <div>
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <CheckCheck
                    className='w-4 h-4 cursor-pointer'
                    onClick={onCheckAll}
                  />
                )}
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-3 max-h-[350px] overflow-y-scroll'>
            {unreadNotifications?.map((notification) => (
              <div key={notification.id}>
                {notification?.link ? (
                  <Link href={notification.link}>
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: removedNotifications.includes(notification.id)
                          ? 0
                          : 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className='flex items-start hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 border-t border-neutral-300 dark:border-neutral-700 py-2 px-2 gap-2 cursor-pointer'
                      onClick={() => onCheckOne(notification.id)}
                    >
                      {notification.createdBy === "Account" ? (
                        <div className='p-3 bg-[#295B8141] dark:bg-[#1034ff41] rounded-full'>
                          <Settings className='w-6 h-6 text-primary' />
                        </div>
                      ) : notification.senderImage ? (
                        <Avatar>
                          <AvatarImage src={notification.senderImage} />
                          <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AvatarImage src={UserImage()} />
                          <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className='flex w-full justify-between'>
                        <div>
                          <h3 className='text-xs mt-1'>{notification.title}</h3>
                          <p className='text-xs mt-2 dark:text-neutral-300 text-neutral-600'>
                            {notification.message}
                          </p>
                          <p className='text-xs mt-3 dark:text-neutral-400 text-neutral-400'>
                            {formatDistanceToNowStrict(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                        <div className='w-2.5 h-2.5 mt-2 rounded-full bg-red-500/70' />
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity: removedNotifications.includes(notification.id)
                        ? 0
                        : 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='flex items-start hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 border-t border-neutral-300 dark:border-neutral-700 py-2 px-2 gap-2 cursor-pointer'
                    onClick={() => onCheckOne(notification.id)}
                  >
                    {notification.createdBy === "Account" ? (
                      <div className='p-3 bg-[#295B8141] dark:bg-[#1034ff41] rounded-full'>
                        <Settings className='w-6 h-6 text-primary' />
                      </div>
                    ) : notification.senderImage ? (
                      <Avatar>
                        <AvatarImage src={notification.senderImage} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage src={UserImage()} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className='flex w-full justify-between'>
                      <div>
                        <h3 className='text-xs mt-1'>{notification.title}</h3>
                        <p className='text-xs mt-2 dark:text-neutral-300 text-neutral-600'>
                          {notification.message}
                        </p>
                        <p className='text-xs mt-3 dark:text-neutral-400 text-neutral-400'>
                          {formatDistanceToNowStrict(
                            new Date(notification.createdAt),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                      <div className='w-2.5 h-2.5 mt-2 rounded-full bg-red-500/70' />
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <Link
            href={"/notifications"}
            className='flex items-center justify-center mt-2 border-t border-neutral-300 dark:border-neutral-700 pt-3'
          >
            <Button variant='primary' className='w-[80%] py-2'>
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BellNotification;
