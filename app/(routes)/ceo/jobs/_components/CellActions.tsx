"use client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface CellActionsProps {
  id: string;
}

const CellActions = ({ id }: CellActionsProps) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the row
  };

  return (
    <div className='flex gap-3' onClick={handleButtonClick}>
      <Button variant={"outline"} className='bg-transparent border-white'>
        <Link
          href={`/admin/jobs/${id}`}
          className='flex gap-2 items-center justify-center'
        >
          <Pencil className='h-4 w-4 mr-2' />
          Edit
        </Link>
      </Button>
    </div>
  );
};

export default CellActions;
