"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/user/signIn", values);
      if (response.data.loginSessionToken) {
        // Store the session token in localStorage (or you could use cookies)
        Cookies.set("sessionToken", response.data.loginSessionToken, {
          expires: 1, // Cookie expires in 1 day
        });
        Cookies.set("sessionExpiry", response.data.loginSessionExpiry, {
          expires: 1, // Cookie expires in 1 day
        });
        // Store userId in cookies
        Cookies.set("userId", response.data.userId, {
          expires: 7, // Cookie expires in 7 days
        });

        if (response.data.isVerified) {
          console.log(response.data.role);
          if (response.data.role === "Admin") {
            router.push("/admin/dashboard");
          } else if (response.data.role === "Manager") {
            router.push("/manager/dashboard");
          } else if (response.data.role === "Employee") {
            router.push("/employee/dashboard");
          } else if (response.data.role === "Recruiter") {
            router.push("/recruiter/dashboard");
          } else if (response.data.role === "Interviewer") {
            router.push("/interviewer/dashboard");
          } else if (response.data.role === "CEO") {
            router.push("/ceo/dashboard");
          } else {
            router.push("/dashboard");
          }
          toast.success("User SignedIn successfully.");
        } else {
          router.push(`/verify/${response.data.userId}`);
          toast.success(
            "User SignedIn successfully, Please Verify Your Email."
          );
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CardWrapper
      headerText='Sign In'
      headerLabel='Enter your credentials to continue'
      backButtonLabel='sign up'
      backButtonHref='/signUp'
      createAccount
      forgotPassword
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='john.doe@example.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='******'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type='submit' className='w-full'>
            {isLoading ? <Loader2 className='w-3 h-3 animate-spin' /> : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
