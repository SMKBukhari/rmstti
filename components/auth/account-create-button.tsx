"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CreateAccountProps {
  spanLabel: string;
  label: string;
  href: string;
}

export const CreateAccount = ({
  spanLabel,
  label,
  href,
}: CreateAccountProps) => {
  return (
    <div className="flex w-full justify-center items-center -mt-1.5">
      <span className="text-sm font-normal text-muted-foreground">{spanLabel}</span>
      <Button variant={"link"} className='font-normal -ml-2 no-underline hover:underline' size={"sm"} asChild>
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
};
