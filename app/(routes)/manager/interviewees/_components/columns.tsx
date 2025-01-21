"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import CellActions from "./CellActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Role, UserProfile } from "@prisma/client";

export type ApplicantsColumns = {
  user: (UserProfile & { role: Role | null }) | null;
  id: string;
  fullName: string;
  email: string;
  contact: string;
  interviewDate: string;
  userImage: string;
  department: string;
  isInterviewed: boolean;
  experience: string;
  skills: string;
  education: string;
  jobKnowledge: string;
  generalKnowledge: string;
  culturalFit: string;
  adaptability: string;
  motivation: string;
  problemSolving: string;
  communication: string;
  teamWork: string;
  leaderShipPotential: string;
  professionalism: string;
  criticalThinking: string;
  appearance: string;
  maturity: string;
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
            className='object-cover object-center w-full h-full'
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
    cell: ({ row }) => {
      const { fullName } = row.original;
      return (
        <Link href={`/admin/applicants/${row.original.id}`}>{fullName}</Link>
      );
    },
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
    accessorKey: "department",
    header: "Application For",
  },
  {
    accessorKey: "interviewDate",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Interview Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        department,
        user,
        id,
        fullName,
        email,
        isInterviewed,
        experience,
        skills,
        education,
        jobKnowledge,
        generalKnowledge,
        culturalFit,
        adaptability,
        motivation,
        problemSolving,
        communication,
        teamWork,
        leaderShipPotential,
        professionalism,
        criticalThinking,
        appearance,
        maturity,
      } = row.original;
      if (isInterviewed) {
        const criteria = {
          experience,
          skills,
          education,
          jobKnowledge,
          generalKnowledge,
          culturalFit,
          adaptability,
          motivation,
          problemSolving,
          communication,
          teamWork,
          leaderShipPotential,
          professionalism,
          criticalThinking,
          appearance,
          maturity,
        };

        const validCriteria = Object.values(criteria).filter(
          (value) => value !== "N/A"
        );

        const obtainedPoints = validCriteria.reduce(
          (total, value) => total + parseInt(value || "0"),
          0
        );
        const totalPoints = validCriteria.length * 5; // Assuming each criterion is out of 5 points
        const percentage = (obtainedPoints / totalPoints) * 100;

        return (
          <div
            className={`w-16 md:h-10 h-8 text-lg font-bold flex items-center justify-center rounded-md ${
              percentage >= 80
                ? "text-green-500 bg-green-200"
                : percentage >= 40
                ? "text-yellow-600 bg-yellow-200"
                : "text-red-500 bg-red-300"
            }
              `}
          >
            {obtainedPoints}/{totalPoints}
          </div>
        );
      }

      return (
        <CellActions
          user={user}
          id={id}
          fullName={fullName}
          email={email}
          appliedFor={department}
        />
      );
    },
  },
];
