"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import type {
  ContractRenewal,
  Department,
  Role,
  UserProfile,
} from "@prisma/client";

type EmployeeWithContract = UserProfile & {
  department: Department | null;
  role: Role | null;
  ContractRenewals: ContractRenewal[];
};

interface ContractHistoryDialogProps {
  employee: EmployeeWithContract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractHistoryDialog({
  employee,
  open,
  onOpenChange,
}: ContractHistoryDialogProps) {
  const [contractHistory, setContractHistory] = useState<ContractRenewal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContractHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/user/${employee.userId}/contractHistory`
      );
      if (response.ok) {
        const data = await response.json();
        setContractHistory(data.contractHistory || []);
      }
    } catch (error) {
      console.error("Error fetching contract history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && employee) {
      fetchContractHistory();
    }
  }, [open, employee]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Accepted":
        return "default";
      case "Rejected":
        return "destructive";
      case "Pending":
        return "secondary";
      case "Expired":
        return "outline";
      default:
        return "outline";
    }
  };

  const downloadContract = async (
    contractUrl: string,
    contractName: string
  ) => {
    try {
      const response = await fetch(contractUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = contractName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading contract:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Contract History - {employee.fullName}</DialogTitle>
          <DialogDescription>
            Complete contract history and renewal timeline for this employee
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Current Contract Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Current Contract Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Start Date
                  </p>
                  <p className='text-sm'>
                    {employee.contractStartDate || employee.DOJ
                      ? format(
                          new Date(employee.contractStartDate || employee.DOJ!),
                          "MMM dd, yyyy"
                        )
                      : "Not specified"}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    End Date
                  </p>
                  <p className='text-sm'>
                    {employee.contractEndDate
                      ? format(
                          new Date(employee.contractEndDate),
                          "MMM dd, yyyy"
                        )
                      : employee.DOJ
                      ? format(
                          new Date(
                            new Date(employee.DOJ).getTime() +
                              365 * 24 * 60 * 60 * 1000
                          ),
                          "MMM dd, yyyy"
                        )
                      : "Not specified"}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Duration
                  </p>
                  <p className='text-sm'>
                    {employee.contractDuration || "1 year"}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Renewals
                  </p>
                  <p className='text-sm'>
                    {employee.contractRenewalCount || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract History */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Renewal History</h3>

            {isLoading ? (
              <div className='text-center py-8'>
                <p className='text-muted-foreground'>
                  Loading contract history...
                </p>
              </div>
            ) : contractHistory.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-muted-foreground'>
                  No contract renewals found
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {contractHistory.map((renewal, index) => (
                  <Card key={renewal.id}>
                    <CardHeader>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='text-base'>
                          Renewal #{renewal.renewalNumber || index + 1}
                        </CardTitle>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant={getStatusBadgeVariant(renewal.status)}
                          >
                            {renewal.status}
                          </Badge>
                          {renewal.contractOfferUrl && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                downloadContract(
                                  renewal.contractOfferUrl!,
                                  renewal.contractOfferName || "contract.pdf"
                                )
                              }
                            >
                              <Download className='h-4 w-4 mr-1' />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardDescription>
                        Initiated by {renewal.initiatedByName} on{" "}
                        {format(new Date(renewal.createdAt), "MMM dd, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {/* Proposed Changes */}
                        <div>
                          <h4 className='font-medium mb-2'>Proposed Changes</h4>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                            <div className='space-y-2'>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Designation:
                                </span>
                                <span>
                                  {renewal.currentDesignation} →{" "}
                                  {renewal.proposedDesignation}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Department:
                                </span>
                                <span>
                                  {renewal.currentDepartment} →{" "}
                                  {renewal.proposedDepartment}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Role:
                                </span>
                                <span>
                                  {renewal.currentRole} → {renewal.proposedRole}
                                </span>
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Salary:
                                </span>
                                <span>
                                  {renewal.currentSalary} →{" "}
                                  {renewal.proposedSalary}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Duration:
                                </span>
                                <span>{renewal.proposedDuration}</span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Yearly Leaves:
                                </span>
                                <span>
                                  {renewal.currentLeaves} →{" "}
                                  {renewal.proposedLeaves}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contract Period */}
                        <div>
                          <h4 className='font-medium mb-2'>Contract Period</h4>
                          <div className='flex items-center gap-4 text-sm'>
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-4 w-4 text-muted-foreground' />
                              <span>
                                {renewal.proposedStartDate &&
                                  format(
                                    new Date(renewal.proposedStartDate),
                                    "MMM dd, yyyy"
                                  )}{" "}
                                -
                                {renewal.proposedEndDate &&
                                  format(
                                    new Date(renewal.proposedEndDate),
                                    "MMM dd, yyyy"
                                  )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Response Details */}
                        {renewal.status !== "Pending" && (
                          <div>
                            <h4 className='font-medium mb-2'>Response</h4>
                            <div className='space-y-2 text-sm'>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Response Date:
                                </span>
                                <span>
                                  {renewal.responseDate &&
                                    format(
                                      new Date(renewal.responseDate),
                                      "MMM dd, yyyy"
                                    )}
                                </span>
                              </div>
                              {renewal.rejectionReason && (
                                <div>
                                  <span className='text-muted-foreground'>
                                    Rejection Reason:
                                  </span>
                                  <p className='mt-1 p-2 bg-muted rounded text-sm'>
                                    {renewal.rejectionReason}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {renewal.notes && (
                          <div>
                            <h4 className='font-medium mb-2'>Notes</h4>
                            <p className='text-sm text-muted-foreground p-2 bg-muted rounded'>
                              {renewal.notes}
                            </p>
                          </div>
                        )}

                        {/* Expiry Information */}
                        {renewal.expiryDate && renewal.status === "Pending" && (
                          <div>
                            <h4 className='font-medium mb-2'>Offer Expiry</h4>
                            <p className='text-sm text-muted-foreground'>
                              This offer expires on{" "}
                              {format(
                                new Date(renewal.expiryDate),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
