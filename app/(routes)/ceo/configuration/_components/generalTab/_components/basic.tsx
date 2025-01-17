"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanySchema, UserBasicInfor } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { company, UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GeneralTabBaiscInfoProps {
  company: (UserProfile & { company: company | null }) | null;
}

const BasicInfo = ({ company }: GeneralTabBaiscInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialValuesRef = useRef<z.infer<typeof CompanySchema>>({
    name: company?.company?.name || "",
    email: company?.company?.email || "",
    contact: company?.company?.contact || "",
    address: company?.company?.address || "",
  });

  const form = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(UserBasicInfor),
    defaultValues: initialValuesRef.current,
  });

  const hasChanges =
    JSON.stringify(form.getValues()) !==
    JSON.stringify(initialValuesRef.current);

  const onSubmit = async (values: z.infer<typeof CompanySchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${company?.userId}/company`, values);
      toast.success(`Company details updated successfully`);
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
    <Card className='flex w-full gap-4 lg:p-10 md:px-7 px-4'>
      <Form {...form}>
        <form
          className='space-y-8 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='John Doe'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Email
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='e.g. companyabc@example.com'
                      type='email'
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
              name='contact'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contact Number
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder='55 555 5555'
                      type='number'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Address
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isLoading}
                        placeholder="e.g '1234 Main St, City, Country'"
                      />
                    </FormControl>
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
              onClick={() => onSubmit(form.getValues())}
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
    </Card>
  );
};

export default BasicInfo;
