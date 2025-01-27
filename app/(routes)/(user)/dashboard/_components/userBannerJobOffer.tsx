"use client";

import Banner from "@/components/Banner";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { JobOfferAcceptanceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { company, UserProfile } from "@prisma/client";
import axios from "axios";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface UserBannerJobOfferProps {
  user: (UserProfile & { company: company | null }) | null;
  label: string;
}

const UserBannerJobOffer = ({ label, user }: UserBannerJobOfferProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

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

  const router = useRouter();

  return (
    <div className='space-y-4'>
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
            . Please review our offer and company policy.
          </>
        }
        variant='success'
      />
      <Button variant='primary' onClick={openDialog} className='w-full'>
        {label}
      </Button>
      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title='Accept Job Offer'
        description='Please review the details before submitting your application.'
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
            title: "Company Policy",
            content: (
              <div className='w-full flex flex-col gap-3'>
                <div className='w-full'>
                  <p>
                    This company policy sets out how our company uses and
                    protects any information that you give us when you use this
                    website.
                  </p>
                  <ul>
                    <li>
                      We are committed to ensuring that your privacy is
                      protected.
                    </li>
                    <li>
                      We may collect the following information: name, contact
                      information including email address, demographic
                      information such as preferences and interests.
                    </li>
                    <li>
                      We require this information to understand your needs and
                      provide you with a better service.
                    </li>
                  </ul>
                </div>
                <div className='w-full'>
                  {user?.company?.companyPolicyUrl && (
                    <div className='w-full'>
                      <div className='text-xs flex items-center gap-1 whitespace-nowrap py-2 px-3 rounded-md bg-neutral-200 dark:bg-neutral-900'>
                        <File className='w-5 h-5 mr-2' />
                        <p className='text-sm truncate flex-grow'>
                          {user?.company?.companyPolicyName}
                        </p>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() => {
                            if (user?.company?.companyPolicyUrl) {
                              const link = document.createElement("a");
                              link.href = user.company.companyPolicyUrl;
                              link.download =
                                user.company.companyPolicyName ||
                                "company_policy.pdf";
                              link.target = "_blank";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ),
            fields: [
              {
                name: "acceptPrivacyPolicy",
                type: "checkbox",
                label: "I have read and accept the company policy",
              },
            ],
          },
          {
            title: "Terms and Conditions",
            content: (
              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  Terms and Conditions
                </h3>
                <p className='mb-2'>
                  By accepting this job offer, you agree to the following terms
                  and conditions:
                </p>
                <ol className='list-decimal pl-5 mb-4'>
                  <li>
                    You will comply with all company policies and procedures.
                  </li>
                  <li>
                    You agree to maintain confidentiality regarding company
                    information.
                  </li>
                  <li>
                    Your employment is subject to a probationary period as
                    specified in your contract.
                  </li>
                  <li>
                    You agree to the working hours and responsibilities outlined
                    in your job description.
                  </li>
                </ol>
              </div>
            ),
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
