"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { ResetPasswordSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Cookies from "js-cookie";

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", ConfirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    try {
      setIsLoading(true);
      await axios.post("/api/user/resetPassword", { ...values, token });
      router.push("/signIn");
      toast.success("Password reset successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      // Check if the user is already authenticated by looking for session token in localStorage
      // const sessionToken = localStorage.getItem("sessionToken");
      const sessionToken = Cookies.get("sessionToken");
      const userId = Cookies.get("userId");
      console.log(sessionToken);
      if (sessionToken) {
        // Check if the session token has expired
        // const sessionExpiry = localStorage.getItem("sessionExpiry");
        const sessionExpiry = Cookies.get("sessionExpiry");
        if (sessionExpiry && new Date(sessionExpiry) > new Date()) {
          // If session is still valid, redirect to the dashboard
          const response = await axios.post("/api/user/getUserProfile", {
            userId: userId,
          });
          if (response.data.role?.name === "Admin") {
            router.push("/admin/dashboard");
          } else if (response.data.role?.name === "Manager") {
            router.push("/manager/dashboard");
          } else if (response.data.role?.name === "Employee") {
            router.push("/employee/dashboard");
          } else if (response.data.role?.name === "Recruiter") {
            router.push("/recruiter/dashboard");
          } else if (response.data.role?.name === "Interviewer") {
            router.push("/interviewer/dashboard");
          } else if (response.data.role?.name === "CEO") {
            router.push("/ceo/dashboard");
          } else {
            router.push("/dashboard");
          }
        } else {
          Cookies.remove("sessionToken");
          Cookies.remove("sessionExpiry");
          router.push("/signIn");
        }
      }
    };

    checkUserSession();
  }, [router]);

  return (
    <CardWrapper
      headerText='Reset Your Password'
      headerLabel='Enter your credentials to continue'
      backButtonLabel='Reset Password Request'
      backButtonHref='/forgotPassword'
      isbackButton
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='*******'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ConfirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='*******'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type='submit' className='w-full'>
            {isLoading ? (
              <Loader2 className='w-3 h-3 animate-spin' />
            ) : (
              "Reset Passowrd"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
