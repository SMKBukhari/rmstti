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

interface UploadAttendancePageProps {
  user: UserProfile | null;
}

export default function UploadAttendancePage({
  user,
}: UploadAttendancePageProps) {
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

    console.log("Uploading file:", file);
    console.log("Form data:", data);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `/api/user/${user?.userId}/attendance/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Attendance data uploaded successfully");
      setDialogOpen(false);
      router.push("/ceo/attendance-management");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload attendance data");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div>
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
