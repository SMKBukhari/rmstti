"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Job, UserProfile } from "@prisma/client";
import axios, { AxiosProgressEvent } from "axios";
import { File, FilePlus, Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
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

interface ImageFormProps {
  initialData: Job | null;
  jobId: string | undefined;
  user: UserProfile | null;
}

const ImageForm = ({ initialData, jobId, user }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    formData.append("image", file);
    formData.append("jobId", jobId);

    try {
      const response = await axios.post(
        `/api/user/${user?.userId}/createNewJob/${jobId}/cldJobImage`,
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
      console.log(formData + " " + response);

      router.refresh();
      setIsEditing(false);
      setImageUrl(response.data.imageUrl);
      toast.success("Job cover image uploaded successfully!");
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data
          : "An unexpected error occurred."
      );
      router.refresh();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `/api/user/${user?.userId}/createNewJob/${jobId}/cldJobImage`
      );
      router.refresh();
      setImageUrl(null);
      toast.success("Job cover image deleted successfully");
    } catch (error) {
      console.error("Error in API request:", error);
      toast.error("Failed to delete job cover image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
      <div className='flex justify-between w-full'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Job Cover Image
        </h2>
        {initialData?.imageUrl ? (
          <Button
            variant={"destructive"}
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        ) : (
          !isEditing && (
            <Button onClick={toggleEditing} variant={"primary"}>
              {isEditing ? (
                <div>Cancel</div>
              ) : (
                <div className='text-white dark:text-white hover:font-semibold flex items-center'>
                  <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
                  {initialData?.imageUrl ? "Change" : "Add"}
                </div>
              )}
            </Button>
          )
        )}
      </div>

      {!isEditing &&
        (initialData?.imageUrl ? (
          <div className='relative w-full h-60 aspect-square mt-2'>
            <Image
              alt='Cover Image'
              fill
              className='w-full h-full object-cover'
              src={initialData?.imageUrl}
            />
          </div>
        ) : (
          <div className='flex justify-center items-center'>
            <div className='text-neutral-400 flex justify-center items-center flex-col'>
              <p>No cover image added yet</p>
              <p className='text-sm text-neutral-500'>
                Add a cover image to make your job posting more attractive.
              </p>
            </div>
          </div>
        ))}

      {isEditing && (
        <>
          <div className='md:w-[40%] w-[90%] h-40 p-2 rounded-md flex items-center justify-center bg-neutral-200 dark:bg-neutral-900'>
            <label className='w-full h-full flex items-center justify-center'>
              <div className='w-full h-full flex gap-2 items-center justify-center cursor-pointer'>
                {!uploading && (
                  <>
                    <FilePlus className='w-3 h-3 mr-2' />
                    <p>{file ? file.name : "Add an Image"}</p>
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
                accept='image/*'
                className='w-0 h-0'
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          <Button
            variant={"primary"}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isImageLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
            <div className='text-center'>
              <Loader2 className='w-10 h-10 animate-spin text-blue-500 mx-auto' />
              <p className='mt-2 text-gray-600'>Loading Image...</p>
            </div>
          </div>
        )}
        {initialData?.imageUrl && (
          <div className='relative w-full h-60 aspect-square mt-2'>
            <Image
              src={initialData?.imageUrl}
              alt='Job Cover Image'
              fill
              onLoad={() => setIsImageLoading(false)}
              className='rounded-md'
            />
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ImageForm;
