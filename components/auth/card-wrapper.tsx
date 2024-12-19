"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { BackButton } from "@/components/auth/back-button";
import { CreateAccount } from "./account-create-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerText: string;
  headerLabel: string;
  isbackButton?: boolean;
  backButtonLabel: string;
  backButtonHref: string;
  createAccount?: boolean;
  forgotPassword?: boolean;
}

export const CardWrapper = ({
  children,
  headerText,
  headerLabel,
  isbackButton,
  backButtonLabel,
  backButtonHref,
  createAccount,
  forgotPassword,
}: CardWrapperProps) => {
  return (
    <Card className='w-[400px] shadow-md'>
      <CardHeader>
        <Header label={headerLabel} text={headerText} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className='w-full flex justify-center'>
        <div>
          {forgotPassword && (
            <BackButton label='Forgot password?' href='/forgotPassword' />
          )}
          {createAccount && (
            <CreateAccount
              spanLabel="Don't have an account?"
              label={backButtonLabel}
              href={backButtonHref}
            />
          )}
          {isbackButton && (
            <BackButton label={backButtonLabel} href={backButtonHref} />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
