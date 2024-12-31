"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangeEmailSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SettingsTabChangeEmailProps {
  user: UserProfile | null;
}

const ChangeEmail = ({ user }: SettingsTabChangeEmailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      currentEmail: "",
      newEmail: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangeEmailSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/user/${user?.userId}/changeEmail`,
        { ...values }
      );
      toast.success(
        `${user?.fullName} Your Email has been updated successfully, Please verify your new email address.`
      );
      form.reset();
      router.refresh();
      router.push(`/verify/${user?.userId}`);
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
    <div className='flex w-full gap-4 lg:px-5 md:px-7 px-4'>
      <Form {...form}>
        <form
          className='space-y-8 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='currentEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      className='relative'
                      disabled={isLoading}
                      placeholder='e.g "youremail@gmail.com"'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      className='relative'
                      disabled={isLoading}
                      placeholder='e.g "youremail@gmail.com"'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex w-full'>
            <Button
              variant={"primary"}
              disabled={isLoading}
              type='submit'
              className=''
            >
              {isLoading ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangeEmail;
