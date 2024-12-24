"use client";
import ClientAvatar from "@/components/AvatarClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AccountTabImageUploadProps {
  user: UserProfile | null;
}


const ImageUpload = ({ user }: AccountTabImageUploadProps) => {
  const avatarFallback = user?.fullName?.substring(0, 2).toUpperCase() || "U";
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (result: any) => {
    const payload = {
      userId: user?.userId,
      imageUrl: result.info.secure_url, // Ensure the URL is correct
    };

    try {
      const response = await axios.post("/api/cldImage/uploadImage", payload);
      console.log("API Response:", response.data);
      toast.success("Image uploaded successfully");
      setUploadedImage(result.info.secure_url);
      router.refresh();
    } catch (error) {
      console.error("Error in API request:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const payload = {
      userId: user?.userId,
      imagePublicId: user?.userId,
    };

    try {
      const response = await axios.post("/api/cldImage/deleteImage", payload);
      console.log("API Response:", response.data);
      toast.success("Image deleted successfully");
      setUploadedImage(null);
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.error("Error in API request:", error);
      toast.error("Failed to delete image");
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <div className='flex md:flex-row flex-col md:items-stretch items-center w-full justify-center gap-4'>
      <div className='lg:w-52 lg:h-52 md:w-40 md:h-40 w-36 h-36 ml-5'>
        {uploadedImage || user?.userImage ? (
          <Avatar className='w-full h-full'>
            <AvatarImage src={uploadedImage || user?.userImage || ""} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        ) : (
          <ClientAvatar avatarFallback={avatarFallback} />
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex gap-3 h-full'>
          <Button
            onClick={handleDelete}
            variant={"destructive"}
            className='flex gap-2 items-center justify-center'
          >
            {isLoading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <Trash className='w-5 h-5' />
            )}
          </Button>
          <CldUploadWidget
            uploadPreset='userImagesUpload'
            options={{
              folder: "userImages",
              resourceType: "image",
              sources: ["local", "url", "camera"],
              publicId: user?.userId,
              tags: [`user_${user?.userId}`, `Image of ${user?.fullName}`],
              cropping: true,
              multiple: false,
              maxFiles: 1,
              maxFileSize: 3000000, // 1MB
              context: {
                alt: `Image of ${user?.fullName}`,
                title: `Image of ${user?.fullName}`,
                caption: `Image of ${user?.fullName}`,
                description: `Image of ${user?.fullName}`,
              },
              maxImageFileSize: 3000000,
              clientAllowedFormats: ["png", "jpeg", "jpg"],
            }}
            onSuccess={handleUpload}
            onError={(error) => {
              console.error("Cloudinary Upload Error:", error);
              toast.error("Failed to upload image");
            }}
          >
            {({ open }) => {
              return (
                <Button
                  variant={"primary"}
                  disabled={!!user?.userImage}
                  onClick={() => open()}
                >
                  Upload new photo
                </Button>
              );
            }}
          </CldUploadWidget>
        </div>
        <p className='text-muted-foreground md:text-start text-center'>
          Allowed formats <br />{" "}
          <span className='text-lg'>PNG, JPEG or JPG.</span> <br />{" "}
          <span>Max Size</span>
          <br /> <span className='text-lg'>1MB</span>
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
