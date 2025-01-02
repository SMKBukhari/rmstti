"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { UserImage } from "@/components/UserImage";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { NotificationCardProps } from "@/types/notications";

export function NotificationCard({
  notification,
  onMarkAsRead,
  isRead,
}: NotificationCardProps) {
  const avatarFallback =
    notification.user?.fullName?.substring(0, 2).toUpperCase() || "UN";
  const createdBy = notification.createdBy as "Account" | "User" | "System";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className='relative'
    >
      <div
        className={`
          group flex items-start gap-4 rounded-lg border p-4 transition-colors
          ${isRead ? "bg-background" : "bg-muted"}
          hover:bg-muted/50
        `}
      >
        {createdBy === "Account" ? (
          <div className='p-3 bg-primary/10 rounded-full'>
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

        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <h4 className='text-sm font-semibold'>{notification.title}</h4>
            {!isRead && (
              <span className='h-2 w-2 rounded-full bg-primary animate-pulse' />
            )}
          </div>
          <p className='text-sm text-muted-foreground'>
            {notification.message}
          </p>
          <p className='text-xs text-muted-foreground'>
            {formatDistanceToNowStrict(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        {notification.link && (
          <Link
            href={notification.link}
            className='absolute inset-0'
            onClick={() => !isRead && onMarkAsRead(notification.id)}
          />
        )}
      </div>
    </motion.div>
  );
}
