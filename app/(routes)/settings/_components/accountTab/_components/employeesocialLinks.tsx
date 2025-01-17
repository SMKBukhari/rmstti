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
import { UserSocialLinks } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AccountTabEmployeeSocialLinksProps {
  user: UserProfile | null;
}

const EmplolyeeSocialLinls = ({ user }: AccountTabEmployeeSocialLinksProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialValuesRef = useRef<z.infer<typeof UserSocialLinks>>({
    skype: user?.skype || "",
    linkedIn: user?.linkedIn || "",
    github: user?.github || "",
    twitter: user?.twitter || "",
    facebook: user?.facebook || "",
    instagram: user?.instagram || "",
    behance: user?.behance || "",
    zoomId: user?.zoomId || "",
    googleMeetId: user?.googleMeetId || "",
  });

  const form = useForm<z.infer<typeof UserSocialLinks>>({
    resolver: zodResolver(UserSocialLinks),
    defaultValues: initialValuesRef.current,
  });

  const hasChanges =
    JSON.stringify(form.getValues()) !==
    JSON.stringify(initialValuesRef.current);

  const onSubmit = async (values: z.infer<typeof UserSocialLinks>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/employeeDataUpdateRequest`, {
        userId: user?.userId,
        values,
      });
      toast.success("Profile update request submitted successfully.");
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
    <div className='flex w-full gap-4 lg:p-10 md:px-7 px-4'>
      <Form {...form}>
        <form
          className='space-y-8 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='linkedIn'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.linkedin.com/in/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='facebook'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.facebook.com/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='instagram'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.instagram.com/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='github'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.github.com/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='twitter'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.twitter.com/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='skype'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skype</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.skype.com/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='behance'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Behnace</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.behance.com/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='zoomId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zoom Id</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.zoom.com/johndoe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='googleMeetId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Meet Id</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='https://www.googlemeet.com/johndoe'
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
              disabled={isLoading || !hasChanges}
              type='submit'
              className=''
            >
              {isLoading ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : (
                "Send Request for Update"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmplolyeeSocialLinls;
