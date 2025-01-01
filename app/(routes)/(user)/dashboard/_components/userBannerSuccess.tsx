"use client";
import Banner from "@/components/Banner";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { JobApplicationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department, UserProfile } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UserBannerSuccessProps {
  user: UserProfile | null;
  label: string;
  department: Department[] | null;
}

const UserBannerSuccess = ({ label, user, department }: UserBannerSuccessProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const form = useForm<z.infer<typeof JobApplicationSchema>>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: {
      department: "",
      coverLetter: "",
      reference: "",
      referenceContact: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof JobApplicationSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(
        `/api/user/${user?.userId}/submitJobApplication`,
        {...values}
      );
      toast.success(
        `${user?.fullName} Your application has been submitted successfully.`
      );
      closeDialog();
      router.refresh();
      // if (typeof window !== "undefined") {
      //   window.location.reload();
      // }
      setIsLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Banner
        label={
          <>
            Congratulations! You&apos;ve successfully completed all the required
            fields.{" "}
            <Button variant={"link"} className='p-0' onClick={openDialog}>
              Submit your Resume
            </Button>{" "}
            to finalize your application!!
          </>
        }
        variant='success'
        button={{
          label: label,
          onClick: openDialog,
        }}
      />

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title='Application Form'
        description='Please fill out the following fields to submit your application.'
        fields={[
          {
            name: "department",
            label: "Department",
            type: "select",
            heading: "Departments",
            comboboxOptions: department
            ? department.map((d) => ({ label: d.name, value: d.name }))
            : [],
          },
          {
            name: "coverLetter",
            label: "Cover Letter",
            type: "textarea",
            placeholder: "e.g 'I'm a software engineer with 5 years of experience...'",
          },
          {
            name: "reference",
            label: "Reference",
            type: "input",
            placeholder: "e.g 'John Doe'",
          },
          {
            name: "referenceContact",
            label: "Reference Contact",
            type: "input",
            placeholder: "e.g '1234567890 / email@gmail.com'"
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
            onClick: () => setIsDialogOpen(false),
          },
        ]}
        onSubmit={onSubmit}
        form={form}
      />
    </div>
  );
};

export default UserBannerSuccess;
