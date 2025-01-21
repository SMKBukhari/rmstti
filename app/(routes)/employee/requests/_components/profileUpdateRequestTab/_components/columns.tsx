"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@prisma/client";
import CellActions from "./CellActions";

export type ProfileUpdateRequestsColumns = {
  user: UserProfile | null;
  id: string;
  fullName: string;
  userImage: string;
  designation: string;
  status: string;
  changedFields: {
    [key: string]: {
      oldValue: any;
      newValue: any;
    };
  };
};

const formatValue = (value: any) => {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return String(value);
};

export const columns: ColumnDef<ProfileUpdateRequestsColumns>[] = [
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
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "changedFields",
    header: "Requested Changes",
    cell: ({ row }) => {
      const { changedFields } = row.original;
      return (
        <div>
          {Object.entries(changedFields).map(
            ([field, { oldValue, newValue }]) => (
              <div key={field}>
                <strong>{field}:</strong> {formatValue(oldValue)} →{" "}
                {formatValue(newValue)}
              </div>
            )
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge
          variant={
            status === "Pending"
              ? "secondary"
              : status === "Approved"
              ? "default"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const { user, id, status } = row.original;
  //     return <CellActions user={user} id={id} status={status} />;
  //   },
  // },
];
