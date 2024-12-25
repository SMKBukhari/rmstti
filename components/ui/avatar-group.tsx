"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  image: string;
  userId: string;
  role: string;
}

interface AvatarGroupProps {
  users: User[];
  limit?: number;
  size?: number;
  spacing?: number;
}

export default function AvatarGroup({
  users,
  limit = 4,
  size = 40,
  spacing = -15, // Negative margin for overlap
}: AvatarGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Only show up to the limit
  const visibleUsers = users.slice(0, limit);
  const remainingUsers = users.length - limit;

  return (
    <AnimatePresence>
      <motion.div
        className='flex items-center relative'
        style={{ height: size }}
      >
        {visibleUsers.map((user, index) => (
            <motion.div
              key={user.id}
              className='relative'
              initial={{ x: 0 }}
              style={{
                marginLeft: index === 0 ? 0 : spacing,
                zIndex: hoveredIndex === index ? 50 : 40 - index,
              }}
              animate={{
                x:
                  hoveredIndex !== null
                    ? hoveredIndex === index
                      ? 20 // Move right when this avatar is hovered
                      : hoveredIndex < index
                      ? 40 // Move more right when previous avatar is hovered
                      : hoveredIndex > index
                      ? -10 // Move slightly left when next avatar is hovered
                      : 0
                    : 0,
                scale: hoveredIndex === index ? 1.15 : 1,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Avatar
                className={`border-2 border-background ring-2 ring-offset-2 ring-offset-background transition-shadow duration-200
              ${
                hoveredIndex === index
                  ? "ring-primary shadow-lg"
                  : "ring-transparent"
              }`}
                style={{
                  width: size,
                  height: size,
                }}
              >
                <AvatarImage src={user.image} alt={`${user.name}'s avatar`} />
                <AvatarFallback className='text-xs font-medium'>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground 
                        text-xs rounded shadow whitespace-nowrap'
                >
                  {user.name}
                </motion.div>
              )}
            </motion.div>
        ))}

        {remainingUsers > 0 && (
          <motion.div
            className='relative'
            style={{ marginLeft: spacing }}
            animate={{
              x: hoveredIndex !== null && hoveredIndex < limit - 1 ? 40 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className='flex items-center justify-center rounded-full border-2 border-background 
                     bg-muted text-muted-foreground'
              style={{
                width: size,
                height: size,
              }}
            >
              <span className='text-xs font-medium'>+{remainingUsers}</span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
