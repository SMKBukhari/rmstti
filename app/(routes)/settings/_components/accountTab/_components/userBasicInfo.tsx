"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ComboBox from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CountryOptions, GenderOptions, getCityOptions } from "@/lib/data";
import { UserBasicInfor } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AccountTabUserInfoProps {
  user: UserProfile | null;
}

const UserBasicInfo = ({ user }: AccountTabUserInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user?.country) {
      const cityOptions = getCityOptions(user.country);
      setCities(cityOptions);
    }
  }, [user?.country]);

  const initialValuesRef = useRef<z.infer<typeof UserBasicInfor>>({
    fullName: user?.fullName || "",
    gender:
      (user?.gender as "Male" | "Female" | "Other" | "Select") || "Select", // Explicitly cast
    contactNumber: user?.contactNumber || "",
    DOB: user?.DOB || new Date(),
    country: user?.country || "",
    city: user?.city || "",
  });

  const handleCountryChange = (countryCode: string) => {
    const cityOptions = getCityOptions(countryCode);
    setCities(cityOptions);
    form.setValue("city", "");
  };

  const form = useForm<z.infer<typeof UserBasicInfor>>({
    resolver: zodResolver(UserBasicInfor),
    defaultValues: initialValuesRef.current,
  });

  const hasChanges =
    JSON.stringify(form.getValues()) !==
    JSON.stringify(initialValuesRef.current);

  const onSubmit = async (values: z.infer<typeof UserBasicInfor>) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `/api/user/${user?.userId}/updateUser`,
        values
      );
      toast.success(`${user?.fullName} Your profile updated successfully."`);
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
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name
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
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Gender
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox
                      options={GenderOptions}
                      heading='Gender'
                      {...field}
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
              name='contactNumber'
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
                      placeholder='03251234567'
                      type='number'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='DOB'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    DOB
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <FormControl>
                      <Input
                        type='date'
                        disabled={isLoading}
                        placeholder="e.g '2021-01-01'"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Country
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox
                      options={CountryOptions}
                      heading='Country'
                      value={field.value} // Pass the current value
                      onChange={(value) => {
                        field.onChange(value); // Call the onChange function from the field
                        handleCountryChange(value); // Call your custom handler
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox
                      options={cities}
                      heading='City'
                      value={field.value} // Pass the current value
                      onChange={field.onChange} // Call the onChange from the field
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
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default UserBasicInfo;
