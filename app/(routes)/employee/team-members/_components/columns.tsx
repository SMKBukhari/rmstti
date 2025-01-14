"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
// import CellActions from "./CellActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@prisma/client";

export type ApplicantsColumns = {
  user: UserProfile | null;
  id: string;
  fullName: string;
  email: string;
  contact: string;
  appliedAt: string;
  userImage: string;
  designation: string;
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "userImage",
    header: "",
    cell: ({ row }) => {
      const { userImage, fullName } = row.original;
      return (
        <Avatar className='w-10 h-10'>
          <AvatarImage
            className='w-full h-full object-cover object-center'
            src={userImage}
            alt={fullName}
          />
          <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const { user, id, fullName, email } = row.original;
  //     return (
  //       id !== user?.userId && (
  //         <CellActions user={user} id={id} fullName={fullName} email={email} />
  //       )
  //     );
  //   },
  // },
];
