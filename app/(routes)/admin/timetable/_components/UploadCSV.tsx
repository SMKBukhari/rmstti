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
import { Upload } from "lucide-react";

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

interface UploadTimeTableProps {
  user: UserProfile | null;
}

export default function UploadTimeTablePage({user}: UploadTimeTableProps) {
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
      await axios.post(`/api/timetable/upload-timetable`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("TimeTable data uploaded successfully");
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload timetable data");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className=''>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Upload />
          Upload TimeTable
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Upload TimeTable CSV'
        description='Please upload your timetable file in CSV format.'
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
