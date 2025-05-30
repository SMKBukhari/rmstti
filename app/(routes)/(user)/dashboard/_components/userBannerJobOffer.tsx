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
      joiningDate: new Date(user?.DOJ || ""),
      department: user?.departmentOffered || "",
      designation: user?.designationOffered || "",
      salary: user?.salaryOffered || "",
      role: user?.roleOffered || "",
      acceptPrivacyPolicy: false,
      acceptTerms: false,
    },
  });

  const watch = form.watch();
  const acceptPrivacyPolicy = watch.acceptPrivacyPolicy;

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

  const onRejected = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/rejectJobOffer`, {
        id: user?.userId,
      });
      toast.success(
        `${user?.fullName} Your job offer has been rejected successfully.`
      );
      closeDialog();
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
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
            . Please
            <Button
              variant={"link"}
              className='p-0 ml-1 mr-0.5'
              onClick={openDialog}
            >
              Review
            </Button>{" "}
            our offer and company policy.
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
        description='Please review the details before submitting your application.'
        isSteps
        fields={[
          {
            label: "Joining Date",
            name: "joiningDate",
            type: "date",
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
            label: "Accept",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
            disabled: !acceptPrivacyPolicy,
          },
          {
            label: "Rejected",
            type: "button",
            variant: "destructive",
            onClick: onRejected,
            disabled: isLoading,
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
            title: "Company Policy & Offer Letter",
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
                          View
                        </Button>
                      </div>
                    </div>
                  )}
                  {user?.offerLetterUrl && (
                    <div className='w-full'>
                      <div className='text-xs flex items-center gap-1 whitespace-nowrap py-2 px-3 rounded-md bg-neutral-200 dark:bg-neutral-900'>
                        <File className='w-5 h-5 mr-2' />
                        <p className='text-sm truncate flex-grow'>
                          Offer Letter
                        </p>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() => {
                            if (user?.offerLetterUrl) {
                              const link = document.createElement("a");
                              link.href = user.offerLetterUrl;
                              link.download = "offer_letter.pdf";
                              link.target = "_blank";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                        >
                          View
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
                label:
                  "I have read and accept the company policy, and I confirm that I will sign the offer letter on my first day.",
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default UserBannerJobOffer;
