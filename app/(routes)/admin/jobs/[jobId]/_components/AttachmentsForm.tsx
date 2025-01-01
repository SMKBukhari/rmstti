"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Job, Attachments, UserProfile } from "@prisma/client";
import axios, { AxiosProgressEvent } from "axios";
import { File, FilePlus, Loader2, Plus, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Modal = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: Modal) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <Button
        variant={"ghost"}
        onClick={onClose}
        className='absolute top-3 right-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
      >
        <X className='w-6 h-6' />
      </Button>
      <div className='bg-white dark:bg-neutral-900 p-4 rounded-md shadow-md relative w-[90%] md:w-[80%] h-[80%]'>
        {children}
      </div>
    </div>
  );
};

interface AttachmentFormProps {
  initialData: (Job & { attachments: Attachments[] }) | null;
  jobId: string | undefined;
  user: UserProfile | null;
}

const AttachmentForm = ({ initialData, jobId, user }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachments | null>(null);
  const router = useRouter();

  const toggleEditing = () => setIsEditing((current) => !current);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file || !jobId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobId", jobId);

    try {
      await axios.post(
        `/api/user/${user?.userId}/createNewJob/${jobId}/cldAttachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setUploadProgress(percent);
          },
        }
      );

      router.refresh();
      setIsEditing(false);
      toast.success("Attachment uploaded successfully!");
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data
          : "An unexpected error occurred."
      );
    } finally {
      setUploading(false);
      setIsEditing(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `/api/user/${user?.userId}/createNewJob/${jobId}/cldAttachments/${attachmentId}`
      );
      router.refresh();
      setIsLoading(false);
      toast.success("Attachment deleted successfully");
    } catch (error) {
      console.error("Error in API request:", error);
      toast.error("Failed to delete attachment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
      <div className='flex justify-between w-full'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Job Attachments
        </h2>
        {!isEditing && (
          <Button onClick={toggleEditing} variant={"primary"}>
            <div className='text-white dark:text-white hover:font-semibold flex items-center'>
              <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
              Add Attachment
            </div>
          </Button>
        )}
      </div>

      {!isEditing && (
        <div className='space-y-2 w-full'>
          {initialData?.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md'
            >
              <div className='flex items-center'>
                <File className='w-4 h-4 mr-2' />
                <span className='text-sm'>{attachment.name}</span>
              </div>
              <div>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => {
                    setSelectedAttachment(attachment);
                    setIsModalOpen(true);
                  }}
                >
                  View
                </Button>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => handleDelete(attachment.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Trash className='w-4 h-4' />
                  )}
                </Button>
              </div>
            </div>
          ))}

          {initialData?.attachments.length === 0 && (
            <div className='flex justify-center items-center'>
              <div className='text-neutral-400 flex justify-center items-center flex-col'>
                <p>No attachments added yet</p>
              </div>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <>
          <div className='md:w-[40%] w-[90%] h-40 p-2 rounded-md flex items-center justify-center bg-neutral-200 dark:bg-neutral-900'>
            <label className='w-full h-full flex items-center justify-center'>
              <div className='w-full h-full flex gap-2 items-center justify-center cursor-pointer'>
                {!uploading && (
                  <>
                    <FilePlus className='w-3 h-3 mr-2' />
                    <p>{file ? file.name : "Add a PDF"}</p>
                  </>
                )}
                {uploading && (
                  <div className='w-[80%] mt-4'>
                    <div className='text-sm text-center'>
                      Uploading: {uploadProgress}%
                    </div>
                    <div className='h-2 bg-gray-200 rounded-full mt-2'>
                      <div
                        className='h-full bg-[#295B81] dark:bg-[#1034ff] rounded-full'
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <input
                key={file ? file.name : "new"}
                type='file'
                accept='.pdf'
                className='w-0 h-0'
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          <Button
            variant={"primary"}
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Upload Attachment"}
          </Button>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedAttachment && (
          <iframe
            src={selectedAttachment.url}
            className='w-full h-full border-none'
            title='PDF Preview'
          />
        )}
      </Modal>
    </Card>
  );
};

export default AttachmentForm;
