"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { UserExperience } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobExperience, UserProfile } from "@prisma/client";
import axios from "axios";
import { Dot, Edit, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AccountTabUserExperiencesProps {
  user: (UserProfile & { jobExperiences: JobExperience[] }) | null;
}

const UserExperiences = ({ user }: AccountTabUserExperiencesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(
    null
  );
  const toggleEditing = (experienceId?: string) => {
    if (experienceId) {
      setEditingExperienceId(experienceId);
      setIsEditing(true);
    } else {
      setIsEditing((prev) => !prev);
      setEditingExperienceId(null);
    }
  };
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof UserExperience>>({
    resolver: zodResolver(UserExperience),
  });

  const startEditing = (experienceId: string) => {
    setEditingExperienceId(experienceId);
    const experience = user?.jobExperiences?.find(
      (exp) => exp.id === experienceId
    );
    if (experience) {
      form.setValue("jobTitle", experience.jobTitle);
      form.setValue("employmentType", experience.employmentType);
      form.setValue("companyName", experience.companyName);
      form.setValue("location", experience.location);
      form.setValue("startDate", experience.startDate || new Date());
      form.setValue("endDate", experience.endDate || new Date());
      form.setValue("currentlyWorking", experience.currentlyWorking || false);
      form.setValue("description", experience.description || "");
    }
  };

  const cancelEditing = () => {
    setEditingExperienceId(null); // Clear the editing experience ID
  };

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof UserExperience>) => {
    try {
      const response = await axios.post(
        `/api/user/${user?.userId}/userExperiences`,
        // create values not iterable
        { jobExperience: [values] }
      );
      toast.success(`${user?.fullName} Profile updated successfully`);
      toggleEditing();
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const saveExperience = async (values: z.infer<typeof UserExperience>) => {
    try {
      // Update existing experience via API call
      const response = await axios.patch(
        `/api/user/${user?.userId}/userExperiences/${editingExperienceId}`,
        { jobExperience: values }
      );
      toast.success(`${user?.fullName} Experience updated successfully.`);
      cancelEditing(); // Reset editing state
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const onDelete = async (jobExperience: JobExperience) => {
    try {
      setDeletingId(jobExperience.id);

      await axios.delete(
        `/api/user/${user?.userId}/userExperiences/${jobExperience.id}`
      );
      toast.success("Experience Detail deleted successfully.");
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
      setDeletingId(null);
    }
  };
  return (
    <div className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
      <div className='flex justify-between w-full'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Experiences
          <span className='text-red-500 ml-1'>*</span>
        </h2>
        <Button onClick={() => toggleEditing()} variant={"primary"}>
          {isEditing || editingExperienceId ? (
            <div className=''>Cancel</div>
          ) : (
            <div className='text-white dark:text-white hover:font-semibold flex items-center'>
              <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
              Add
            </div>
          )}
        </Button>
      </div>

      {!isEditing && !editingExperienceId ? (
        user?.jobExperiences?.length === 0 ? (
          <div className='flex justify-center items-center'>
            <div className='text-neutral-400 flex justify-center items-center flex-col'>
              <p>No Experience added yet</p>
              <p className="text-sm text-neutral-500">
                You need to add at least one experience to your profile for
                apply any job.
              </p>
            </div>
          </div>
        ) : (
          <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
            {user?.jobExperiences?.map((item) => (
              <div className='flex flex-col mt-5' key={item.id}>
                <div className='flex justify-between'>
                  <div>
                    <div className='flex'>
                      <div>
                        <p className='font-medium md:text-sm text-xs'>
                          {item.jobTitle}
                        </p>
                      </div>
                    </div>
                    <div className='flex mt-1'>
                      <p className='text-neutral-500 md:text-sm text-xs flex'>
                        {item.companyName}{" "}
                        <Dot className='md:text-sm text-xs -mt-0.5 md:block hidden' />
                        {item.location}
                      </p>
                    </div>
                    <div className='flex mt-1 text-neutral-500 md:text-sm text-xs'>
                      {item.startDate?.getFullYear()}{" "}
                      {!item.endDate || item.currentlyWorking
                        ? " - Present"
                        : item.endDate?.getFullYear()
                        ? `- ${item.endDate?.getFullYear()}`
                        : ""}
                      {/* Get How Many ears user works with complete info liek 2years1month */}
                      {item.endDate && (
                        <Dot className='md:text-sm text-xs -mt-0.5 md:block hidden' />
                      )}
                      {item.startDate &&
                        item.endDate &&
                        !item.currentlyWorking && (
                          <span className='md:ml-0 ml-3 text-emerald-500'>
                            {item.endDate.getFullYear() -
                              item.startDate.getFullYear()}{" "}
                            Years{" "}
                            {item.endDate.getMonth() -
                              item.startDate.getMonth()}{" "}
                            Months
                          </span>
                        )}
                    </div>
                  </div>
                  <div>
                    {deletingId === item.id ? (
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className='p-1'
                        type='button'
                      >
                        <Loader2 className='h-full w-full text-emerald-500 animate-spin' />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className='p-1'
                          type='button'
                          onClick={() => startEditing(item.id)} // Start editing the experience
                        >
                          <Edit className='h-4 w-4 text-blue-500' />
                        </Button>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className='p-1'
                          type='button'
                          onClick={() => onDelete(item)}
                        >
                          <X className='h-4 w-4 text-red-500' />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className='flex mt-3'>
                  <p className='text-neutral-500 md:text-sm text-xs'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <Form {...form}>
          <form
            className='space-y-8 w-full'
            onSubmit={form.handleSubmit(isEditing ? onSubmit : saveExperience)}
          >
            <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
              <FormField
                control={form.control}
                name='jobTitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Software Engineer'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='employmentType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Full-time'"
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
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Google'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Lagos, Nigeria'"
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
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        disabled={isSubmitting}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        disabled={
                          isSubmitting || form.watch("currentlyWorking")
                        }
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='w-full flex ml-1.5 items-center'>
              <FormField
                control={form.control}
                name='currentlyWorking'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-center'>
                        <Checkbox
                          id='currentlyWorking'
                          className='data-[state=checked]:bg-[#295B81]/85 data-[state=checked]:border-[#295B81] dark:data-[state=checked]:bg-[#1034ff]/85 dark:data-[state=checked]:border-[#1034ff] border-neutral-600'
                          disabled={isSubmitting}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            console.log(value);
                          }}
                        />
                        <FormLabel
                          htmlFor='currentlyWorking'
                          className='ml-2 mt-0.5'
                        >
                          Currently Working
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-10 w-full'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        className='min-h-[200px]'
                        placeholder="e.g 'I am a software engineer with 5 years of experience'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex items-center gap-x-2'>
              <Button
                variant={"primary"}
                disabled={!isValid || isSubmitting}
                typeof='submit'
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* {isEditing || editingExperienceId && (
        
      )} */}
    </div>
  );
};

export default UserExperiences;
