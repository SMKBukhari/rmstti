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
import { UserEducations } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Education, UserProfile } from "@prisma/client";
import axios from "axios";
import { Dot, Edit, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AccouuntTabUserEducationProps {
  user: (UserProfile & { education: Education[] }) | null;
}

const UserEducation = ({ user }: AccouuntTabUserEducationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null
  );
  const toggleEditing = (educationId?: string) => {
    if (educationId) {
      setEditingEducationId(educationId);
      setIsEditing(true);
    } else {
      setIsEditing((prev) => !prev);
      setEditingEducationId(null);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof UserEducations>>({
    resolver: zodResolver(UserEducations),
  });

  const startEditing = (educationId: string) => {
    setEditingEducationId(educationId);
    const education = user?.education?.find((edu) => edu.id === educationId);
    if (education) {
      form.setValue("university", education.university);
      form.setValue("degree", education.degree);
      form.setValue("fieldOfStudy", education.fieldOfStudy);
      form.setValue("grade", education.grade || "");
      form.setValue("startDate", education.startDate || new Date());
      form.setValue("currentlyStudying", education.currentlyStudying || false);
      form.setValue("endDate", education.endDate || new Date());
      form.setValue("description", education.description || "");
    }
  };

  const cancelEditing = () => {
    setEditingEducationId(null); // Clear the editing experience ID
  };

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof UserEducations>) => {
    try {
      await axios.post(
        `/api/user/${user?.userId}/userEducations`,
        // create values not iterable
        { educations: [values] }
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

  const saveEducation = async (values: z.infer<typeof UserEducations>) => {
    try {
      // Update existing experience via API call
      await axios.patch(
        `/api/user/${user?.userId}/userEducations/${editingEducationId}`,
        { educations: values }
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

  const onDelete = async (education: Education) => {
    try {
      setDeletingId(education.id);

      await axios.delete(
        `/api/user/${user?.userId}/userEducations/${education.id}`
      );
      toast.success(`Your Education Detail (${education.university} - ${education.degree}) deleted successfully.`);
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
          Educations
          <span className='text-red-500 ml-1'>*</span>
        </h2>
        <Button onClick={() => toggleEditing()} variant={"primary"}>
          {isEditing || editingEducationId ? (
            <div className=''>Cancel</div>
          ) : (
            <div className='text-white dark:text-white hover:font-semibold flex items-center'>
              <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
              Add
            </div>
          )}
        </Button>
      </div>

      {!isEditing && !editingEducationId ? (
        user?.education?.length === 0 ? (
          <div className='flex justify-center items-center'>
            <div className="text-neutral-400 flex justify-center items-center flex-col">
              <p>No Education added yet</p>
              <p className='text-sm text-neutral-500'>
                You need to add at least one education to your profile for apply
                any job.
              </p>
            </div>
          </div>
        ) : (
          <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
            {user?.education?.map((item) => (
              <div className='flex flex-col mt-5' key={item.id}>
                <div className='flex justify-between'>
                  <div>
                    <div className='flex'>
                      <div>
                        <p className='font-medium md:text-sm text-xs'>
                          {item.degree}, {item.fieldOfStudy}
                        </p>
                      </div>
                    </div>
                    <div className='flex mt-1'>
                      <p className='text-neutral-500 md:text-sm text-xs flex'>
                        {item.university}{" "}
                        <Dot className='md:text-sm text-xs -mt-0.5 md:block hidden' />
                        {item.startDate?.getFullYear()}{" "}
                        {!item.endDate || item.currentlyStudying
                          ? " - Present"
                          : item.endDate?.getFullYear()
                          ? `- ${item.endDate?.getFullYear()}`
                          : ""}
                      </p>
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
            onSubmit={form.handleSubmit(isEditing ? onSubmit : saveEducation)}
          >
            <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
              <FormField
                control={form.control}
                name='university'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'University of Lagos'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='degree'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Bachelor'"
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
                name='fieldOfStudy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Computer Science'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='grade'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'A+'"
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
                          isSubmitting || form.watch("currentlyStudying")
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
                name='currentlyStudying'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-center'>
                        <Checkbox
                          id='currentlyStudying'
                          className='data-[state=checked]:bg-[#295B81]/85 data-[state=checked]:border-[#295B81] dark:data-[state=checked]:bg-[#1034ff]/85 dark:data-[state=checked]:border-[#1034ff] border-neutral-600'
                          disabled={isSubmitting}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            console.log(value);
                          }}
                        />
                        <FormLabel
                          htmlFor='currentlyStudying'
                          className='ml-2 mt-0.5'
                        >
                          Currently Studying
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
                        placeholder="e.g 'I studied computer science and graduated with a first class degree'"
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

export default UserEducation;
