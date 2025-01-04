"use client";

import { LucideIcon } from "lucide-react";

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
}

export function InfoSection({ title, items }: InfoSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <item.icon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}