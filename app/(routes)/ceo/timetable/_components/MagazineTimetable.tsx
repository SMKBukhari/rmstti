"use client";

import { useState, useEffect } from "react";
import {
  generateTimetable,
  getTimetable,
  uploadTimetableFile,
  TimetableEntry,
} from "@/actions/timeTableActions";
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
import { TimetableDisplay } from "./TimeTableDisplay";
import UploadTimeTablePage from "./UploadCSV";
import { TimeTable, UserProfile } from "@prisma/client";

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

  // const fetchTimetable = async () => {
  //   setLoading(true);
  //   try {
  //     const fetchedTimetable = await getTimetable();
  //     setTimetable(fetchedTimetable);
  //   } catch (err) {
  //     console.error('Error fetching timetable:', err);
  //     setError('Failed to fetch timetable. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (initialTimetable) {
      setTimetable(
        initialTimetable.map((entry) => ({
          ...entry,
          fullName: "Unknown",
        }))
      );
    }
  }, [initialTimetable]);

  // const handleGenerateTimetable = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const generatedTimetable = await generateTimetable(new Date());
  //     setTimetable(generatedTimetable);
  //   } catch (err) {
  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "An error occurred while generating the timetable"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGenerateTimetable = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/timetable/generate-timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate: new Date() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTimetable(data.timetable);
      } else {
        throw new Error(data.error || "Failed to generate timetable");
      }
    } catch (err) {
      console.error("Error generating timetable:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while generating the timetable"
      );
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
      await uploadTimetableFile(formData);
      // await fetchTimetable();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while uploading the file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>Magazine Department Timetable</CardTitle>
        <CardDescription>
          Generate or upload a timetable for the Magazine Department
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center mb-6'>
          <Button onClick={handleGenerateTimetable} disabled={loading}>
            {loading ? "Generating..." : "Generate Timetable"}
          </Button>
          <div className='flex items-center space-x-2'>
            {/* <Label htmlFor='file-upload' className='cursor-pointer'>
              Upload Timetable
            </Label> */}
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
          <TimetableDisplay timetable={timetable} />
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
