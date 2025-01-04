"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployeeHeaderProps {
  fullName: string;
  designation: string;
  imageUrl?: string;
}

export function EmployeeHeader({
  fullName,
  designation,
  imageUrl,
}: EmployeeHeaderProps) {
  return (
    <div className='relative h-48 bg-primary pattern-grid-lg text-primary-foreground'>
      <div className='absolute inset-0 bg-primary/90' />
      <div className='relative h-full flex items-end p-6'>
        <div className='flex items-center gap-6'>
          <Avatar className='h-24 w-24 border-4 border-white shadow-lg'>
            {imageUrl && <AvatarImage src={imageUrl} alt={fullName} />}
          </Avatar>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>{fullName}</h1>
            <Badge variant='secondary' className='text-sm'>
              {designation}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
