"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface SectionWrapperProps {
  iconName: IconName;
  title: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  iconName,
  title,
  children,
}) => {
  const [Icon, setIcon] = useState<React.ElementType | null>(null);

  useEffect(() => {
    const IconComponent = LucideIcons[iconName];
    if (IconComponent && typeof IconComponent !== 'string') {
      setIcon(() => IconComponent as React.ElementType);
    }
  }, [iconName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 border border-indigo-100 dark:border-gray-700"
    >
      <motion.div
        className="flex items-center gap-x-3 mb-6"
      >
        <div className="p-3 bg-indigo-500 dark:bg-indigo-600 rounded-full">
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        <h2 className="text-2xl text-gray-800 dark:text-white font-bold">
          {title}
        </h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-6"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default SectionWrapper;
