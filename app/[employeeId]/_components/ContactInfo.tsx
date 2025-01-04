"use client";

import { Mail, Phone } from "lucide-react";
import { InfoSection } from "./InfoSection";

interface ContactInfoProps {
  email: string;
  contactNumber: string;
}

export function ContactInfo({ email, contactNumber }: ContactInfoProps) {
  const items = [
    { icon: Mail, label: "Email", value: email },
    { icon: Phone, label: "Phone", value: contactNumber },
  ];

  return (
    <InfoSection title="Contact Information" items={items} />
  );
}