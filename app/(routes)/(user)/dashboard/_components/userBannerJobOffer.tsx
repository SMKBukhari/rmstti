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
      acceptPrivacyPolicy: false,
      acceptTerms: false,
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
              Confirm
            </Button>{" "}
            your acceptance.
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
        isSteps
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
        accordionContent={[
          {
            title: "Privacy Policy",
            content: `
              <h3>Privacy Policy</h3>
              <p>This privacy policy sets out how our company uses and protects any information that you give us when you use this website.</p>
              <ul>
                <li>We are committed to ensuring that your privacy is protected.</li>
                <li>We may collect the following information: name, contact information including email address, demographic information such as postcode, preferences and interests.</li>
                <li>We require this information to understand your needs and provide you with a better service.</li>
              </ul>
            `,
            fields: [
              {
                name: "acceptPrivacyPolicy",
                type: "checkbox",
                label: "I accept the privacy policy",
              },
            ],
          },
          {
            title: "Job Offer Details",
            content: `
              <h3>Job Offer Details</h3>
              <p>Please review the following details of your job offer:</p>
              <ul>
                <li>Position: ${user?.designationOffered}</li>
                <li>Department: ${user?.departmentOffered}</li>
                <li>Salary: ${user?.salaryOffered}/month</li>
                <li>Start Date: To be determined</li>
              </ul>
              <p>If you have any questions about these details, please contact HR before accepting the offer.</p>
            `,
          },
          {
            title: "Terms and Conditions",
            content: `
              <h3>Terms and Conditions</h3>
              <p>By accepting this job offer, you agree to the following terms and conditions:</p>
              <ol>
                <li>You will comply with all company policies and procedures.</li>
                <li>You agree to maintain confidentiality regarding company information.</li>
                <li>Your employment is subject to a probationary period as specified in your contract.</li>
                <li>You agree to the working hours and responsibilities outlined in your job description.</li>
              </ol>
            `,
            fields: [
              {
                name: "acceptTerms",
                type: "checkbox",
                label: "I accept the terms and conditions",
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default UserBannerJobOffer;
