"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ContractRenewalSchema } from "@/schemas";
import { toast } from "sonner";
import type {
  ContractRenewal,
  Department,
  Role,
  UserProfile,
} from "@prisma/client";
import type * as z from "zod";

type EmployeeWithContract = UserProfile & {
  department: Department | null;
  role: Role | null;
  ContractRenewals: ContractRenewal[];
};

interface ContractRenewalDialogProps {
  employee: EmployeeWithContract;
  departments: Department[];
  roles: Role[];
  currentUserId: string;
  currentUserName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractRenewalDialog({
  employee,
  departments,
  roles,
  currentUserId,
  currentUserName,
  open,
  onOpenChange,
}: ContractRenewalDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof ContractRenewalSchema>>({
    resolver: zodResolver(ContractRenewalSchema),
    defaultValues: {
      proposedDesignation: employee.designation || "",
      proposedDepartment: employee.department?.id || "",
      proposedRole: employee.role?.id || "",
      proposedSalary: employee.salary || "",
      proposedStartDate: employee.contractEndDate
        ? new Date(
            new Date(employee.contractEndDate).getTime() + 24 * 60 * 60 * 1000
          )
        : new Date(),
      proposedEndDate: employee.contractEndDate
        ? new Date(
            new Date(employee.contractEndDate).getTime() +
              365 * 24 * 60 * 60 * 1000
          )
        : new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      proposedDuration: "1 year",
      proposedLeaves: employee.totalYearlyLeaves || "36",
      notes: "",
      expiryDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }
      setContractFile(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof ContractRenewalSchema>) => {
    if (!contractFile) {
      toast.error("Please upload a contract offer letter");
      return;
    }

    setIsLoading(true);

    try {
      // First upload the contract file
      const formData = new FormData();
      formData.append("contractOffer", contractFile);
      formData.append("userId", employee.userId);

      const uploadResponse = await fetch(
        "/api/cldContractOffer/uploadContractOffer",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload contract offer");
      }

      const uploadResult = await uploadResponse.json();

      // Then create the contract renewal
      const renewalData = {
        ...values,
        currentDesignation: employee.designation,
        currentDepartment: employee.department?.name,
        currentRole: employee.role?.name,
        currentSalary: employee.salary,
        currentStartDate: employee.contractStartDate || employee.DOJ,
        currentEndDate:
          employee.contractEndDate ||
          (employee.DOJ
            ? new Date(
                new Date(employee.DOJ).getTime() + 365 * 24 * 60 * 60 * 1000
              )
            : null),
        currentLeaves: employee.totalYearlyLeaves,
        contractOfferUrl: uploadResult.contractOffer.contractOfferUrl,
        contractOfferName: uploadResult.contractOffer.contractOfferName,
        contractOfferPublicId: uploadResult.contractOffer.contractOfferPublicId,
        initiatedBy: currentUserId,
        initiatedByName: currentUserName,
        renewalNumber: (employee.contractRenewalCount || 0) + 1,
      };

      const response = await fetch(
        `/api/user/${currentUserId}/contractRenewal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: employee.userId,
            ...renewalData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create contract renewal");
      }

      toast.success("Contract renewal initiated successfully");
      onOpenChange(false);
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error("Error creating contract renewal:", error);
      toast.error("Failed to initiate contract renewal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Renew Contract - {employee.fullName}</DialogTitle>
          <DialogDescription>
            Create a contract renewal offer for this employee. They will receive
            an email notification to review and respond.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Current vs Proposed Comparison */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Current Details */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Current Contract</h3>
                <div className='space-y-3 p-4 bg-muted rounded-lg'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Designation
                    </label>
                    <p className='text-sm'>
                      {employee.designation || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Department
                    </label>
                    <p className='text-sm'>
                      {employee.department?.name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Role
                    </label>
                    <p className='text-sm'>
                      {employee.role?.name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Salary
                    </label>
                    <p className='text-sm'>
                      {employee.salary || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Yearly Leaves
                    </label>
                    <p className='text-sm'>
                      {employee.totalYearlyLeaves || "36"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Proposed Details */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Proposed Contract</h3>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='proposedDesignation'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='proposedDepartment'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select department' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='proposedRole'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select role' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='proposedSalary'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='e.g., 50,000 PKR' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='proposedLeaves'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yearly Leaves</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Contract Duration */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='proposedStartDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Contract Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='proposedEndDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Contract End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("proposedStartDate")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='proposedDuration'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select duration' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='3 months'>3 months</SelectItem>
                        <SelectItem value='6 months'>6 months</SelectItem>
                        <SelectItem value='1 year'>1 year</SelectItem>
                        <SelectItem value='2 years'>2 years</SelectItem>
                        <SelectItem value='3 years'>3 years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contract Offer Upload */}
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>
                  Contract Offer Letter (PDF)
                </label>
                <div className='mt-2'>
                  <div className='flex items-center justify-center w-full'>
                    <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        {contractFile ? (
                          <>
                            <FileText className='w-8 h-8 mb-2 text-green-500' />
                            <p className='text-sm text-gray-500'>
                              {contractFile.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className='w-8 h-8 mb-2 text-gray-400' />
                            <p className='mb-2 text-sm text-gray-500'>
                              <span className='font-semibold'>
                                Click to upload
                              </span>{" "}
                              contract offer letter
                            </p>
                            <p className='text-xs text-gray-500'>
                              PDF files only (MAX. 10MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type='file'
                        className='hidden'
                        accept='.pdf'
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Expiry Date */}
            <FormField
              control={form.control}
              name='expiryDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Offer Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Any additional notes or comments about this renewal...'
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? "Creating Renewal..." : "Send Renewal Offer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
