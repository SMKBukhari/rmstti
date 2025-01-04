"use client";

import Logo from "@/components/Logo";
import Image from "next/image";

interface CompanyHeaderProps {
  name?: string;
  logo?: string;
}

export function CompanyHeader({ name, logo }: CompanyHeaderProps) {
  return (
    <div className='flex items-center gap-3 p-4 bg-muted/30'>
      <div className='h-16 w-16 flex items-center justify-center rounded-md'>
        {logo ? (
          <Image
            src={logo}
            alt={name ?? "The Truth International"}
            fill
          />
        ) : (
          <Logo />
        )}
      </div>
      {name && (
        <div>
          <p className='text-sm text-muted-foreground'>Company</p>
          <h2 className='font-semibold'>{name}</h2>
        </div>
      )}
    </div>
  );
}
