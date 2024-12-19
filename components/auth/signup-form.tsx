"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { SingUpSchema } from "@/schemas";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ComboBox from "@/components/ui/combo-box";
import { CountryOptions, GenderOptions, getCityOptions } from "@/lib/data";
import { BackButton } from "./back-button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof SingUpSchema>>({
    resolver: zodResolver(SingUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      ConfirmPassword: "",
      city: "",
      country: "",
      contactNumber: "",
      DOB: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof SingUpSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/user", values);
      router.push(`/verify/${response.data.userId}`);
      toast.success(
        "Account created successfully, Please First Verify Your Email."
      );
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

  const handleCountryChange = (countryCode: string) => {
    const cityOptions = getCityOptions(countryCode);
    setCities(cityOptions);
    form.setValue("city", "");
  };
  return (
    <div
      // className='max-w-screen-2xl w-[100vw] p-10 md:pt-[calc(100vh-85vh)] sm:pt-[calc(100vh-80vh)] pt-[calc(100vh-40vh)]'
      className='w-full'
    >
      <div>
        <div className='flex flex-col w-full gap-1 items-center justify-center'>
          <h1 className='md:text-4xl text-3xl text-center'>Let&apos;s get you started</h1>
          <p className='md:text-base text-sm text-neutral-500'>
            Enter the details below to get going
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 mt-16'
          >
            <div className='grid gap-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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
                    <FormLabel>Email Address</FormLabel>
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
              <FormField
                control={form.control}
                name='ConfirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
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
              <FormField
                control={form.control}
                name='DOB'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOB</FormLabel>
                    <FormControl>
                      <FormControl>
                        <Input
                          type='date'
                          disabled={isLoading}
                          placeholder="e.g '2021-01-01'"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
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
              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
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
                    <FormLabel>City</FormLabel>
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
              <FormField
                control={form.control}
                name='contactNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
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
            </div>
            <div className='flex w-full justify-center'>
              <Button
                variant={"primary"}
                disabled={isLoading}
                type='submit'
                className=''
              >
                {isLoading ? (
                  <Loader2 className='w-3 h-3 animate-spin' />
                ) : (
                  "Create an Account"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className='inline-flex justify-center w-full'>
          <BackButton href='/signIn' label='Already have an account?' />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
