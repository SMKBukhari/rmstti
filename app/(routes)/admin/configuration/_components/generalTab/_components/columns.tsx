"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";

export type PubicHolidayList = {
  id: string;
  date: string;
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
    id: "actions",
    cell: ({ row }) => {
      const { id, user } = row.original;
      return (
        <CellActions
          id={id}
          user={user}
        />
      );
    },
  },
];
