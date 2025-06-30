"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import type * as z from "zod";

import Banner from "@/components/Banner";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Clock, AlertTriangle } from "lucide-react";
import { ContractResponseSchema } from "@/schemas";
import type {
  ContractRenewal,
  UserProfile,
  Department,
  Role,
} from "@prisma/client";

interface ContractRenewalBannerProps {
  user: UserProfile & {
    role: Role | null;
    department: Department | null;
  };
  contractRenewal: ContractRenewal;
}

const ContractRenewalBanner = ({
  user,
  contractRenewal,
}: ContractRenewalBannerProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseType, setResponseType] = useState<"accept" | "reject">(
    "accept"
  );

  const form = useForm<z.infer<typeof ContractResponseSchema>>({
    resolver: zodResolver(ContractResponseSchema),
    defaultValues: {
      response: "accept",
      rejectionReason: "",
    },
  });

  const isExpiringSoon =
    contractRenewal.expiryDate &&
    new Date(contractRenewal.expiryDate).getTime() - new Date().getTime() <
      3 * 24 * 60 * 60 * 1000;

  const daysUntilExpiry = contractRenewal.expiryDate
    ? Math.ceil(
        (new Date(contractRenewal.expiryDate).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const handleResponse = async (response: "accept" | "reject") => {
    setResponseType(response);
    if (response === "accept") {
      // Direct accept without dialog
      await submitResponse("accept", "");
    } else {
      // Open dialog for rejection reason
      setIsDialogOpen(true);
    }
  };

  const submitResponse = async (
    response: "accept" | "reject",
    rejectionReason?: string
  ) => {
    setIsLoading(true);
    try {
      await axios.post(`/api/user/${user.userId}/contractResponse`, {
        contractRenewalId: contractRenewal.id,
        response,
        rejectionReason: response === "reject" ? rejectionReason : undefined,
      });

      toast.success(
        response === "accept"
          ? "Contract renewal accepted successfully!"
          : "Contract renewal declined successfully."
      );

      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error responding to contract renewal:", error);
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof ContractResponseSchema>) => {
    await submitResponse(values.response, values.rejectionReason);
  };

  const handleDownloadContract = () => {
    if (contractRenewal.contractOfferUrl) {
      const link = document.createElement("a");
      link.href = contractRenewal.contractOfferUrl;
      link.download =
        contractRenewal.contractOfferName || "contract-renewal-offer.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className='space-y-4'>
        <Banner
          label={
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center space-x-2'>
                <FileText className='h-5 w-5' />
                <span>
                  <strong>Contract Renewal Offer Received!</strong>
                  {daysUntilExpiry && (
                    <span
                      className={`ml-2 ${
                        isExpiringSoon ? "text-red-600" : "text-orange-600"
                      }`}
                    >
                      {isExpiringSoon && (
                        <AlertTriangle className='inline h-4 w-4 mr-1' />
                      )}
                      {daysUntilExpiry > 0
                        ? `${daysUntilExpiry} days remaining`
                        : "Expired"}
                    </span>
                  )}
                </span>
              </div>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShow(!show)}
                >
                  View Details
                </Button>
              </div>
            </div>
          }
          variant={isExpiringSoon ? "danger" : "warning"}
        />

        {/* Contract Comparison Card */}
        {show && (
          <Card className=''>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <FileText className='mr-2 h-5 w-5 text-blue-600' />
                Contract Renewal Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Current Terms */}
                <div>
                  <h4 className='font-semibold mb-3 text-gray-700'>
                    Current Terms
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Designation:
                      </span>
                      <span className='text-sm font-medium'>
                        {contractRenewal.currentDesignation || "N/A"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Department:</span>
                      <span className='text-sm font-medium'>
                        {contractRenewal.currentDepartment || "N/A"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Salary:</span>
                      <span className='text-sm font-medium'>
                        Rs. {contractRenewal.currentSalary || "N/A"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Annual Leaves:
                      </span>
                      <span className='text-sm font-medium'>
                        {contractRenewal.currentLeaves || "N/A"} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Terms */}
                <div>
                  <h4 className='font-semibold mb-3 text-blue-600'>
                    Proposed Terms
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Designation:
                      </span>
                      <span className='text-sm font-medium text-blue-600'>
                        {contractRenewal.proposedDesignation}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Department:</span>
                      <span className='text-sm font-medium text-blue-600'>
                        {contractRenewal.proposedDepartment}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Salary:</span>
                      <span className='text-sm font-medium text-blue-600'>
                        Rs. {contractRenewal.proposedSalary}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Annual Leaves:
                      </span>
                      <span className='text-sm font-medium text-blue-600'>
                        {contractRenewal.proposedLeaves} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Period */}
              <div className='mt-6 pt-4 border-t'>
                <h4 className='font-semibold mb-3 text-gray-700'>
                  New Contract Period
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='flex items-center'>
                    <Calendar className='mr-2 h-4 w-4 text-blue-600' />
                    <div>
                      <span className='text-sm text-gray-600'>Start Date:</span>
                      <p className='text-sm font-medium'>
                        {contractRenewal.proposedStartDate
                          ? new Date(
                              contractRenewal.proposedStartDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='mr-2 h-4 w-4 text-blue-600' />
                    <div>
                      <span className='text-sm text-gray-600'>End Date:</span>
                      <p className='text-sm font-medium'>
                        {contractRenewal.proposedEndDate
                          ? new Date(
                              contractRenewal.proposedEndDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <Clock className='mr-2 h-4 w-4 text-blue-600' />
                    <div>
                      <span className='text-sm text-gray-600'>Duration:</span>
                      <p className='text-sm font-medium'>
                        {contractRenewal.proposedDuration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='mt-6 pt-4 border-t'>
                <div className='flex flex-col sm:flex-row gap-3'>
                  {contractRenewal.contractOfferUrl && (
                    <Button
                      variant='outline'
                      onClick={handleDownloadContract}
                      className='flex items-center bg-transparent'
                    >
                      <FileText className='mr-2 h-4 w-4' />
                      Download Contract Offer
                    </Button>
                  )}
                  <div className='flex gap-2 ml-auto'>
                    <Button
                      variant='destructive'
                      onClick={() => handleResponse("reject")}
                      disabled={isLoading}
                    >
                      Decline Offer
                    </Button>
                    <Button
                      onClick={() => handleResponse("accept")}
                      disabled={isLoading}
                      variant='primary'
                    >
                      {isLoading ? "Processing..." : "Accept Offer"}
                    </Button>
                  </div>
                </div>
              </div>

              {contractRenewal.notes && (
                <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
                  <h5 className='font-medium text-sm text-gray-700 mb-1'>
                    Additional Notes:
                  </h5>
                  <p className='text-sm text-gray-600'>
                    {contractRenewal.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rejection Dialog */}
      <DialogForm
        isOpen={isDialogOpen && responseType === "reject"}
        onOpenChange={setIsDialogOpen}
        title='Decline Contract Renewal'
        description='Please provide a reason for declining this contract renewal offer.'
        fields={[
          {
            name: "rejectionReason",
            type: "textarea",
            label: "Reason for Declining",
            placeholder: "Please explain why you are declining this offer...",
          },
        ]}
        buttons={[
          {
            label: "Submit Decline",
            type: "submit",
            variant: "destructive",
            isLoading: isLoading,
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setIsDialogOpen(false),
          },
        ]}
        onSubmit={(data) => submitResponse("reject", data.rejectionReason)}
        form={form}
      />
    </>
  );
};

export default ContractRenewalBanner;
