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
import { ChangePasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SettingsTabChangePasswordProps {
  user: UserProfile | null;
}
const ChangePassword = ({ user }: SettingsTabChangePasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "", // Initialize value for currentPassword
      newPassword: "", // Initialize value for newPassword
      ConfirmPassword: "", // Initialize value for confirmPassword
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/user/${user?.userId}/changePassword`,
        { ...values }
      );
      toast.success(
        `${user?.fullName} Your password has been updated successfully.`
      );
      form.reset();
      router.refresh();
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
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={
                          showPasswords.currentPassword ? "text" : "password"
                        }
                        className='relative'
                        disabled={isLoading}
                        placeholder='******'
                      />
                      {showPasswords.currentPassword ? (
                        <Eye
                          className='w-5 h-5 absolute right-3 bottom-2.5 cursor-pointer'
                          onClick={() => toggleVisibility("currentPassword")}
                        />
                      ) : (
                        <EyeClosed
                          className='w-5 h-5 absolute right-3 bottom-2.5 cursor-pointer'
                          onClick={() => toggleVisibility("currentPassword")}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showPasswords.newPassword ? "text" : "password"}
                        className='relative'
                        disabled={isLoading}
                        placeholder='******'
                      />
                      {showPasswords.newPassword ? (
                        <Eye
                          className='w-5 h-5 absolute right-3 bottom-2.5 cursor-pointer'
                          onClick={() => toggleVisibility("newPassword")}
                        />
                      ) : (
                        <EyeClosed
                          className='w-5 h-5 absolute right-3 bottom-2.5 cursor-pointer'
                          onClick={() => toggleVisibility("newPassword")}
                        />
                      )}
                    </div>
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
                    <div className='relative'>
                      <Input
                        {...field}
                        type={
                          showPasswords.confirmPassword ? "text" : "password"
                        }
                        className='relative'
                        disabled={isLoading}
                        placeholder='******'
                      />
                      {showPasswords.confirmPassword ? (
                        <Eye
                          className='w-5 h-5 absolute right-3 bottom-2.5 cursor-pointer'
                          onClick={() => toggleVisibility("confirmPassword")}
                        />
                      ) : (
                        <EyeClosed
                          className='w-5 h-5 absolute right-3 bottom-2.5 cursor-pointer'
                          onClick={() => toggleVisibility("confirmPassword")}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex w-full flex-col text-muted-foreground gap-2'>
            <h3>Password Requirements:</h3>
            <ul className="flex-col gap-1 flex list-disc" >
              <li className="ml-4">Minimum 6 characters long - the more, the better</li>
              <li className="ml-4">At least one lowercase character</li>
              <li className="ml-4">At least one number, symbol, or whitespace character</li>
            </ul>
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

export default ChangePassword;
