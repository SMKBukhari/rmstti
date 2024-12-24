"use client";
import Banner from "@/components/Banner";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { JobOfferAcceptanceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UserBannerJobOfferProps {
  user: UserProfile | null;
  label: string;
}

const UserBannerJobOffer = ({ label, user }: UserBannerJobOfferProps) => {
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

  const form = useForm<z.infer<typeof JobOfferAcceptanceSchema>>({
    resolver: zodResolver(JobOfferAcceptanceSchema),
    defaultValues: {
      joiningDate: new Date(),
      department: user?.departmentOffered || "",
      designation: user?.designationOffered || "",
      salary: user?.salaryOffered || "",
      role: user?.roleOffered || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof JobOfferAcceptanceSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/hireApplicant`, {
        id: user?.userId,
        ...values,
      });
      toast.success(
        `${user?.fullName} Your application has been submitted successfully.`
      );
      closeDialog();
      router.push("/profile");
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
            Congratulations! We are excited to offer you the position of{" "}
            <span className='font-bold underline underline-offset-2'>
              {user?.designationOffered}
            </span>{" "}
            at{" "}
            <span className='font-bold underline underline-offset-2'>
              {user?.salaryOffered}/month
            </span>
            . Please
            <Button
              variant={"link"}
              className='p-0 mx-0.5'
              onClick={openDialog}
            >
              Submit
            </Button>{" "}
            your application to confirm your acceptance.
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
        title='Accept Job Offer'
        description='Again recheck the details before submitting the application.'
        fields={[
          {
            name: "joiningDate",
            type: "datetime",
            disabled: true,
          },
          {
            name: "department",
            type: "input",
            label: "Department",
            disabled: true,
          },
          {
            name: "designation",
            type: "input",
            label: "Designation",
            disabled: true,
          },
          {
            name: "role",
            type: "input",
            label: "Role",
            disabled: true,
          },
          {
            name: "salary",
            type: "input",
            label: "Salary",
            disabled: true,
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

export default UserBannerJobOffer;
