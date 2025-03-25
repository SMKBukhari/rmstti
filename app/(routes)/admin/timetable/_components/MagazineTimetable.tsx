"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import UploadTimeTablePage from "./UploadCSV";
import { TimeTable, UserProfile } from "@prisma/client";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface MagazineTimetableProps {
  user: UserProfile | null;
  timetable: (TimeTable & { fullName: string })[] | null;
}

export function MagazineTimetable({
  user,
  timetable: initialTimetable,
}: MagazineTimetableProps) {
  const [timetable, setTimetable] = useState<
    (TimeTable & { fullName: string })[]
  >(() => initialTimetable || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateTimetable = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/timetable/generate-timetable", {
        startDate: new Date(),
      });

      if (response.data.success) {
        setTimetable(response.data.timetable);
      } else {
        throw new Error(response.data.error || "Failed to generate timetable");
      }
    } catch (err) {
      console.error("Error generating timetable:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `Error: ${err.response?.status} - ${
            err.response?.data?.error || err.message
          }`
        );
      } else {
        setError("An error occurred while generating the timetable");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "/api/timetable/upload-timetable",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setTimetable(response.data.timetable);
      } else {
        throw new Error(response.data.error || "Failed to upload timetable");
      }
    } catch (err) {
      console.error("Error uploading timetable:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while uploading the timetable"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>Generate Timetable</CardTitle>
        <CardDescription>Generate or upload a timetable</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center mb-6'>
          <Button onClick={handleGenerateTimetable} disabled={loading}>
            {loading ? "Generating..." : "Generate Timetable"}
          </Button>
          <div className='flex items-center space-x-2'>
            <UploadTimeTablePage user={user} />
            <Input
              id='file-upload'
              type='file'
              accept='.pdf,.doc,.docx'
              onChange={handleFileUpload}
              className='hidden'
            />
          </div>
        </div>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {timetable.length > 0 ? (
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Shift Start (Timing)</TableHead>
                    <TableHead>Shift End (Timing)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetable.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.fullName}</TableCell>
                      <TableCell>
                        {format(record.date, "EEE, MMMM d")}
                      </TableCell>
                      <TableCell>{record.shiftType}</TableCell>
                      <TableCell>
                        {format(record.shiftStart, "h:mm a")}
                      </TableCell>
                      <TableCell>{format(record.shiftEnd, "h:mm a")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <p>No timetable available. Generate a new timetable or upload one.</p>
        )}
      </CardContent>
      <CardFooter>
        <p className='text-sm text-gray-500'>
          Timetable is generated for 4 weeks starting from the current week.
          Upload a PDF or DOC file to update the timetable.
        </p>
      </CardFooter>
    </Card>
  );
}
