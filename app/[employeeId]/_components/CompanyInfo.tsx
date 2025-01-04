"use client";

import { Building2, MapPin,  Phone } from "lucide-react";
import { InfoSection } from "./InfoSection";

interface CompanyInfoProps {
  name: string;
  address: string;
  contact?: string;
}

export function CompanyInfo({ name, address, contact }: CompanyInfoProps) {
  const items = [
    { icon: Building2, label: "Company Name", value: name },
    { icon: MapPin, label: "Address", value: address },
    ...(contact ? [{ icon: Phone, label: "Contact", value: contact }] : []),
  ];

  return <InfoSection title='Company Details' items={items} />;
}
