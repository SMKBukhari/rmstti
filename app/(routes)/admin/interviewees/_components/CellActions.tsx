"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BadgeX, Calendar, Eye, Loader, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

interface CellActionsProps {
  id: string;
  fullName: string;
  email: string;
}

const CellActions = ({ id, fullName, email }: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);

  const sendSelected = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/sendSelected", { email, fullName });
      toast.success("Email sent successfully");
      setIsLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        toast.error("Failed to send email");
      }
    }
  };

  const Rejected = async () => {
    setIsRejection(true);
    try {
      await axios.post("/api/sendRejected", { email, fullName });
      toast.success("Email sent successfully");
      setIsLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        toast.error("Failed to send email");
      }
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/admin/applicants/${id}`}>
          <DropdownMenuItem>
            <Eye className='w-10 h-10 mr-2 text-[#ffff]' />
            View
          </DropdownMenuItem>
        </Link>
        {isLoading ? (
          <DropdownMenuItem>
            <Loader className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={sendSelected}>
            <Calendar className='w-10 h-10 mr-2 text-[#ffff]' />
            Interview
          </DropdownMenuItem>
        )}

        {isRejection ? (
          <DropdownMenuItem>
            <Loader className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={Rejected}>
            <BadgeX className='w-10 h-10 mr-2 dark:text-[#ff816b] text-[#d31510]' />
            Rejected
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellActions;
