"use client";

import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { UserProfile } from "@prisma/client";

// Zod Schema for Validation
const FileUploadSchema = z.object({
  file: z.any().refine((files) => {
    if (!(files instanceof FileList)) return false;
    if (files.length === 0) return false;
    const file = files[0];
    return file instanceof File && file.type === "text/csv";
  }, "Please upload a valid CSV file"),
});

type FileUploadFormData = z.infer<typeof FileUploadSchema>;

interface UploadTimeTablePageProps {
  user: UserProfile | null;
}

export default function UploadTimeTablePage({
  user,
}: UploadTimeTablePageProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<FileUploadFormData>({
    resolver: zodResolver(FileUploadSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (data: FileUploadFormData) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `/api/user/${user?.userId}/uploadTimeTable`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        router.refresh();
        toast.success("Attendance data uploaded successfully");
        setDialogOpen(false);
        router.push("/ceo/timetable");
      } else {
        throw new Error(result.error || "Failed to upload attendance data");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload attendance data"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className='flex w-full items-end justify-end'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          Upload Attendance
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Upload Attendance CSV'
        description='Please upload your attendance file in CSV format.'
        fields={[
          {
            name: "file",
            label: "Upload CSV File",
            type: "file",
            accept: ".csv",
            onChange: handleFileChange,
          },
        ]}
        buttons={[
          {
            label: "Upload",
            type: "submit",
            variant: "primary",
            isLoading: isUploading,
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setDialogOpen(false),
          },
        ]}
        onSubmit={handleSubmit}
        form={form}
      />
    </>
  );
}
