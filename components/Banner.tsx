"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle, CircleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const bannerVariants = cva(
  "border text-center md:p-4 p-3 text-sm flex items-center w-full rounded-md",
  {
    variants: {
      variant: {
        warning:
          "text-yellow-800 rounded-lg bg-yellow-50 dark:bg-neutral-800 dark:text-yellow-300",
        success:
          "text-green-800 rounded-lg bg-green-50 dark:bg-neutral-800 dark:text-green-400",
        danger:
          "text-red-800 rounded-lg bg-red-50 dark:bg-neutral-800 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  danger: CircleAlert,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: React.ReactNode;
  button?: {
    label: string;
    onClick?: () => void;
  };
  buttonLink?: {
    label: string;
    link: string;
  };
}

const Banner = ({ label, variant, button, buttonLink }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div
      className={`md:text-sm text-xs justify-between ${bannerVariants({
        variant,
      })}`}
    >
      <div className='flex items-center'>
        <Icon className='w-6 h-6 md:block hidden mr-2' />
        <p className='mt-0.5'>{label}</p>
      </div>
      {buttonLink && (
        <Link href={buttonLink.link}>
          <Button className='bg-white dark:bg-white text-black dark:text-black md:block hidden'>
            {buttonLink.label}
          </Button>
        </Link>
      )}
      {button && (
        <Button
          className='bg-white dark:bg-white text-black dark:text-black md:block hidden'
          onClick={button.onClick}
        >
          {button.label}
        </Button>
      )}
    </div>
  );
};

export default Banner;



