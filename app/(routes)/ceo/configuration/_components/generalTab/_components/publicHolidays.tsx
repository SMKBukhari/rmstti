"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PublicHoliday, UserProfile } from "@prisma/client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { columns, PubicHolidayList } from "./columns";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { PublicHolidaySchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DialogForm from "@/components/DialogForm";

interface PublicHolidaysProps {
  user: UserProfile | null;
  publicHoidays: PublicHoliday[] | [];
}

const PublicHolidays = ({ user, publicHoidays }: PublicHolidaysProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PublicHolidaySchema>>({
    resolver: zodResolver(PublicHolidaySchema),
    defaultValues: {
      name: "",
      date: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof PublicHolidaySchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/publicHolidays`, {
        ...data,
      });
      console.log(data);
      toast.success("Public Holiday added successfully.");
      setDialogOpen(false);
      setIsLoading(false);
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
      setDialogOpen(false);
      setIsLoading(false);
    }
  };

  const formattedPublicHolidayList: PubicHolidayList[] = publicHoidays.map(
    (publicHoiday) => ({
      user: user,
      id: publicHoiday.id,
      date: publicHoiday.date
        ? format(new Date(publicHoiday.date), "EEEE, MMMM d, yyyy")
        : "N/A",
      name: publicHoiday.name ?? "",
    })
  );
  return (
    <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5 mb-5'>
      <div className='flex justify-between w-full'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Public Holidays
          <span className='text-red-500 ml-1'>*</span>
        </h2>
        <Button onClick={() => setDialogOpen(true)} variant={"primary"}>
          <div className='text-white dark:text-white hover:font-semibold flex items-center'>
            <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
            Add
          </div>
        </Button>
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedPublicHolidayList}
          filterableColumns={[
            {
              id: "fullName",
              title: "Name",
            },
          ]}
        />
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Add Public Holiday'
        description='Please fill the form below to add a public holiday.'
        fields={[
          {
            label: "Holiday Name",
            placeholder: "Enter Holiday Name",
            name: "name",
            type: "input",
          },
          {
            label: "Date",
            name: "date",
            type: "date",
          },
        ]}
        buttons={[
          {
            label: "Add Holiday",
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
    </Card>
  );
};

export default PublicHolidays;
