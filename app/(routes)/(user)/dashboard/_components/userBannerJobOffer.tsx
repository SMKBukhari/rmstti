"use client";
import Banner from "@/components/Banner";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { JobOfferAcceptanceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { company, UserProfile } from "@prisma/client";
import axios from "axios";
import { File, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Modal = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// Modal component (can be reused in other components)
const Modal = ({ isOpen, onClose, children }: Modal) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Button
        variant={"ghost"}
        onClick={onClose}
        className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
      >
        <X className="w-6 h-6" />
      </Button>
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-md shadow-md relative w-[90%] md:w-[80%] h-[80%]">
        {children}
      </div>
    </div>
  );
};

interface UserBannerJobOfferProps {
  user: (UserProfile & { company: company | null }) | null;
  label: string;
}

const UserBannerJobOffer = ({ label, user }: UserBannerJobOfferProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [isPolicyLoading, setIsPolicyLoading] = useState(true);
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

  useEffect(() => {
    setIsPolicyLoading(true);

    // Fixing the URL check logic here
    if (user?.company?.companyPolicyUrl) {
      if (user.company.companyPolicyUrl.includes("cloudinary.com")) {
        setIframeUrl(`${user.company.companyPolicyUrl}#toolbar=0&navpanes=0&scrollbar=0`);
      } else {
        setIframeUrl(user.company.companyPolicyUrl);
      }
    }
  }, [user?.company?.companyPolicyUrl]);

  const handleIframeLoad = () => {
    setIsPolicyLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof JobOfferAcceptanceSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/hireApplicant`, {
        id: user?.userId,
        ...values,
      });
      toast.success(`${user?.fullName} Your application has been submitted successfully.`);
      closeDialog();
      router.push("/profile");
      router.refresh();
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

  const companyPolicy = (
    <div className="space-y-2 grid grid-cols-2 w-full">
      <div className="w-full">
        <div className="text-xs flex items-center gap-1 whitespace-nowrap md:py-1 px-2 rounded-md bg-neutral-200 dark:bg-neutral-900 md:col-span-11 col-span-4">
          <File className="w-10 h-10 mr-2" />
          <p className="text-xs w-full truncate">
            {user?.company?.companyPolicyName}
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className=""
            type="button"
            onClick={() => setIsModalOpen(true)} // Open modal on button click
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );

  const companyPolicyView = (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {isPolicyLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
            <p className="mt-2 text-gray-600">Loading PDF...</p>
          </div>
        </div>
      )}
      {iframeUrl && !isPolicyLoading && (
        <iframe
          src={iframeUrl}
          className="w-full h-full border-none"
          title="PDF Preview"
          onLoad={handleIframeLoad}
        />
      )}
    </Modal>
  );

  console.log(isModalOpen); // Debugging the modal state
  console.log(iframeUrl);   // Debugging the iframe URL

  return (
    <div>
      <Banner
        label={
          <>
            Congratulations! We are excited to offer you the position of{" "}
            <span className="font-bold underline underline-offset-2">
              {user?.designationOffered}
            </span>{" "}
            at{" "}
            <span className="font-bold underline underline-offset-2">
              {user?.salaryOffered}/month
            </span>
            . Please
            <Button
              variant={"link"}
              className="p-0 mx-0.5"
              onClick={openDialog}
            >
              Confirm
            </Button>{" "}
            your acceptance.
          </>
        }
        variant="success"
        button={{
          label: label,
          onClick: openDialog,
        }}
      />

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Accept Job Offer"
        description="Again recheck the details before submitting the application."
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
              <>
                <h3>Company Policy</h3>
                <p>
                  This company policy sets out how our company uses and protects
                  any information that you give us when you use this website.
                </p>
                <ul>
                  <li>We are committed to ensuring that your privacy is protected.</li>
                  <li>
                    We may collect the following information: name, contact
                    information including email address, demographic information
                    such as preferences and interests.
                  </li>
                  <li>
                    We require this information to understand your needs and
                    provide you with a better service.
                  </li>
                </ul>
                {user?.company?.companyPolicyUrl && companyPolicy}
              </>
            ),
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

      {/* Display the company policy modal */}
      {companyPolicyView}
    </div>
  );
};

export default UserBannerJobOffer;
