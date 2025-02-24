"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@prisma/client";
import CellActions from "./CellActions";

export type PubicHolidayList = {
  id: string;
  date: string;
  for: string;
  name: string;
  user: UserProfile | null;
};

export const columns: ColumnDef<PubicHolidayList>[] = [
  {
    accessorKey: "name",
    header: "Holiday Name",
  },
  {
    accessorKey: "date",
    header: "Date",
    sortingFn: "datetime",
  },
  {
    accessorKey: "for",
    header: "For",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, user } = row.original;
      return <CellActions id={id} user={user} />;
    },
  },
];
