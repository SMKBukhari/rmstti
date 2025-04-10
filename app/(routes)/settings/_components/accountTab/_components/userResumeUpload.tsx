"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@prisma/client";
import axios, { AxiosProgressEvent } from "axios";
import { File, FilePlus, Loader2, Plus, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Modal = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// Modal component (can be reused in other components)
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

const UserResumeUpload = ({ user }: { user: UserProfile | null }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResumeLoading, setIsResumeLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
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
    if (!file || !user) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userId", user.userId);

    try {
      const response = await axios.post(
        `/api/cldResume/uploadResume`,
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

      toast.success(`${user.fullName}'s resume uploaded successfully!`);
      setIsEditing(false);
      setFileUrl(response.data.resumeUrl);
      router.refresh();
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
    const payload = {
      userId: user?.userId,
      filePublicId: user?.resumePublicId,
    };

    try {
      const response = await axios.post("/api/cldResume/deleteResume", payload);
      console.log("API Response:", response.data);
      toast.success("Resume deleted successfully");
      setFileUrl(null);
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.error("Error in API request:", error);
      toast.error("Failed to delete Resume");
      setIsLoading(false);
      router.refresh();
    }
  };

  useEffect(() => {
    setIsResumeLoading(true);
    if (fileUrl || user?.resumeUrl || "".includes("cloudinary.com")) {
      setIframeUrl(
        `${fileUrl || user?.resumeUrl || ""}#toolbar=0&navpanes=0&scrollbar=0`
      );
    } else {
      setIframeUrl(fileUrl || user?.resumeUrl || "");
    }
  }, [user?.resumeUrl, fileUrl]);

  const handleIframeLoad = () => {
    setIsResumeLoading(false);
  };

  return (
    <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
      <div className='flex justify-between w-full'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Upload Resume<span className='text-red-500 ml-1'>*</span>
        </h2>
        {!isEditing && (
          <Button onClick={toggleEditing} variant={"primary"}>
            {isEditing ? (
              <div>Cancel</div>
            ) : (
              <div className='text-white dark:text-white hover:font-semibold flex items-center'>
                <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
                Add
              </div>
            )}
          </Button>
        )}
      </div>

      {!isEditing &&
        (user?.resumeUrl === null ? (
          <div className='flex justify-center items-center'>
            <div className='text-neutral-400 flex justify-center items-center flex-col'>
              <p>Resume not added yet</p>
              <p className='text-sm text-neutral-500'>
                You need to add your resume to apply for any job.
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-2 grid grid-cols-2 w-full'>
            <div className='w-full'>
              <div className='text-xs flex items-center gap-1 whitespace-nowrap md:py-1 px-2 rounded-md bg-neutral-200 dark:bg-neutral-900 md:col-span-11 col-span-4'>
                <File className='w-10 h-10 mr-2' />
                <p className='text-xs w-full truncate'>{user?.resumeName}</p>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className=''
                  type='button'
                  onClick={() => setIsModalOpen(true)} // Open modal on button click
                >
                  View
                </Button>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className='hover:bg-red-800'
                  onClick={handleDelete}
                >
                  {isLoading ? (
                    <div className='w-4 h-4'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                    </div>
                  ) : (
                    <Trash className='w-4 h-4' />
                  )}
                </Button>
              </div>
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
                    <p>{file ? file.name : "Add a File"}</p>
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
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </Button>
        </>
      )}

      {/* Modal for PDF Viewer */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isResumeLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
            <div className='text-center'>
              <Loader2 className='w-10 h-10 animate-spin text-blue-500 mx-auto' />
              <p className='mt-2 text-gray-600'>Loading PDF...</p>
            </div>
          </div>
        )}
        {iframeUrl && (
          <iframe
            src={iframeUrl}
            className='w-full h-full border-none'
            title='PDF Preview'
            onLoad={handleIframeLoad}
          />
        )}
      </Modal>
    </Card>
  );
};

export default UserResumeUpload;
