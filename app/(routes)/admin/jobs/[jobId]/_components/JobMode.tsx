"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ComboBox from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, UserProfile } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface JobModeProps {
  initialData: Job | null;
  jobId: string | undefined;
  user: UserProfile | null;
}

const options = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "onsite",
    label: "Onsite",
  },
];

const formSchema = z.object({
  workMode: z.string().min(1),
});

const JobMode = ({ initialData, jobId, user }: JobModeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMode: initialData?.workMode || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/user/${user?.userId}/createNewJob/${jobId}`,
        values
      );
      router.refresh();
      setIsEditing(false);
      toast.success("Work Mode updated successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsEditing(false);
    }
  };

  const toggleEiditing = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData?.workMode
  );

  return (
    <Card className='mt-6 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Work Mode
        <Button onClick={toggleEiditing} variant={"ghost"}>
        {isEditing ? (
            <div className='text-neutral-500'>Cancel</div>
          ) : (
            <div className='text-[#295B81] dark:text-[#1034ff] flex items-center'>
              <Pencil className='w-4 dark:text-[#1034ff] text-[#295B81] h-4 mr-2' />
              Edit
            </div>
          )}
        </Button>
      </div>

      {/* Display the Title if not Editing */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.workMode && "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No Work Mode Added"}
        </p>
      )}

      {/* Display the Form if Editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='workMode'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      options={options}
                      heading='Work Mode'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
    </Card>
  );
};

export default JobMode;