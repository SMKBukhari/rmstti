"use client";

import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Job/Internship title cannot be empty" }),
});

interface CreateNewJobProps {
  user: UserProfile | null;
}

const CreateNewJob = ({ user }: CreateNewJobProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/user/${user?.userId}/createNewJob`, values);
      setIsLoading(false);
      setDialogOpen(false);
      router.push(`/admin/jobs/${response.data.id}`);
      toast.success("Job created successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setDialogOpen(false);
      setIsLoading(false);
    }
  };
  return (
    <div className='flex items-end justify-end w-full'>
      <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
        ) : (
          <span className='w-full flex'>
            <Plus className='w-5 h-5 mr-2' /> New Job
          </span>
        )}
      </Button>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Name Your Job/Internship'
        description="What would you like to name your job/internship? Dont't worry, you can
          change this later."
        fields={[
          {
            name: "title",
            type: "input",
            placeholder: "e.g 'Full-Stack Developer",
          },
        ]}
        buttons={[
          {
            label: "Submit",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setDialogOpen(false),
          },
        ]}
        onSubmit={onSubmit}
        form={form}
      />
    </div>
  );
};

export default CreateNewJob;
