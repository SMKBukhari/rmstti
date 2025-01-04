"use client";

import { BadgeCheck, Building2 } from "lucide-react";
import { InfoSection } from "./InfoSection";

interface WorkInfoProps {
  role: string;
  department: string;
}

export function WorkInfo({ role, department }: WorkInfoProps) {
  const items = [
    { icon: BadgeCheck, label: "Role", value: role },
    { icon: Building2, label: "Department", value: department },
  ];

  return (
    <InfoSection title="Work Details" items={items} />
  );
}