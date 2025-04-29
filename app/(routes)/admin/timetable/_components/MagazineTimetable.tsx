"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { format, parse } from "date-fns";

interface MagazineTimetableProps {
  user: UserProfile | null;
  timetable: (TimeTable & { fullName: string })[] | null;
}

interface EditableTimeTable extends TimeTable {
  fullName: string;
  isEditing?: boolean;
  tempShiftStart?: string;
  tempShiftEnd?: string;
  tempDate?: string;
}

export function MagazineTimetable({
  user,
  timetable: initialTimetable,
}: MagazineTimetableProps) {
  const [timetable, setTimetable] = useState<EditableTimeTable[]>(
    () => initialTimetable?.map((t) => ({ ...t })) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleGenerateTimetable = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const response = await axios.post("/api/timetable/generate-timetable", {
  //       startDate: new Date(),
  //     });

  //     if (response.data.success) {
  //       setTimetable(response.data.timetable);
  //     } else {
  //       throw new Error(response.data.error || "Failed to generate timetable");
  //     }
  //   } catch (err) {
  //     console.error("Error generating timetable:", err);
  //     if (axios.isAxiosError(err)) {
  //       setError(
  //         `Error: ${err.response?.status} - ${
  //           err.response?.data?.error || err.message
  //         }`
  //       );
  //     } else {
  //       setError("An error occurred while generating the timetable");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const handleEditStart = (
    id: string,
    field: "date" | "shiftStart" | "shiftEnd"
  ) => {
    console.log("Editing field:", field);
    console.log("ID:", id);
    setTimetable((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isEditing: true,
            tempDate: format(item.date, "yyyy-MM-dd"),
            tempShiftStart:
              item.shiftStart !== null ? format(item.shiftStart, "HH:mm") : "-",
            tempShiftEnd:
              item.shiftEnd !== null ? format(item.shiftEnd, "HH:mm") : "-",
          };
        }
        return item;
      })
    );
  };

  const handleChange = (
    id: string,
    field: "tempDate" | "tempShiftStart" | "tempShiftEnd",
    value: string
  ) => {
    setTimetable((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSave = async (id: string) => {
    const itemToUpdate = timetable.find((item) => item.id === id);
    if (!itemToUpdate) return;

    try {
      setLoading(true);

      // Parse the updated values
      let updatedDate = itemToUpdate.date;
      let updatedShiftStart = itemToUpdate.shiftStart;
      let updatedShiftEnd = itemToUpdate.shiftEnd;

      if (itemToUpdate.tempDate) {
        updatedDate = parse(itemToUpdate.tempDate, "yyyy-MM-dd", new Date());
      }

      if (itemToUpdate.tempShiftStart) {
        const [hours, minutes] = itemToUpdate.tempShiftStart
          .split(":")
          .map(Number);
        updatedShiftStart = new Date(updatedDate);
        updatedShiftStart.setHours(hours, minutes);
      }

      if (itemToUpdate.tempShiftEnd) {
        const [hours, minutes] = itemToUpdate.tempShiftEnd
          .split(":")
          .map(Number);
        updatedShiftEnd = new Date(updatedDate);
        updatedShiftEnd.setHours(hours, minutes);
      }

      // Update the timetable locally first for instant feedback
      setTimetable((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              date: updatedDate,
              shiftStart: updatedShiftStart,
              shiftEnd: updatedShiftEnd,
              isEditing: false,
            };
          }
          return item;
        })
      );

      // Send the update to the server
      const response = await axios.put(`/api/timetable/${id}`, {
        date: updatedDate,
        shiftStart: updatedShiftStart,
        shiftEnd: updatedShiftEnd,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update timetable");
      }
    } catch (err) {
      console.error("Error updating timetable:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the timetable"
      );
      // Revert changes if update fails
      setTimetable((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isEditing: false,
            };
          }
          return item;
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (id: string) => {
    handleSave(id);
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave(id);
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
          {/* <Button onClick={handleGenerateTimetable} disabled={loading}>
            {loading ? "Generating..." : "Generate Timetable"}
          </Button> */}
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
                      <TableCell
                        onClick={() => handleEditStart(record.id, "date")}
                      >
                        {record.isEditing ? (
                          <Input
                            type='date'
                            value={record.tempDate || ""}
                            onChange={(e) =>
                              handleChange(
                                record.id,
                                "tempDate",
                                e.target.value
                              )
                            }
                            onBlur={() => handleBlur(record.id)}
                            onKeyDown={(e) => handleKeyDown(record.id, e)}
                            autoFocus
                          />
                        ) : (
                          format(record.date, "EEE, MMMM d")
                        )}
                      </TableCell>
                      <TableCell>{record.shiftType}</TableCell>
                      <TableCell
                        onClick={() => handleEditStart(record.id, "shiftStart")}
                      >
                        {record.isEditing ? (
                          <Input
                            type='time'
                            value={record.tempShiftStart || ""}
                            onChange={(e) =>
                              handleChange(
                                record.id,
                                "tempShiftStart",
                                e.target.value
                              )
                            }
                            onBlur={() => handleBlur(record.id)}
                            onKeyDown={(e) => handleKeyDown(record.id, e)}
                            autoFocus
                          />
                        ) : record.shiftStart !== null ? (
                          format(record.shiftStart, "h:mm a")
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => handleEditStart(record.id, "shiftEnd")}
                      >
                        {record.isEditing ? (
                          <Input
                            type='time'
                            value={record.tempShiftEnd || ""}
                            onChange={(e) =>
                              handleChange(
                                record.id,
                                "tempShiftEnd",
                                e.target.value
                              )
                            }
                            onBlur={() => handleBlur(record.id)}
                            onKeyDown={(e) => handleKeyDown(record.id, e)}
                            autoFocus
                          />
                        ) : record.shiftEnd !== null ? (
                          format(record.shiftEnd, "h:mm a")
                        ) : (
                          "-"
                        )}
                      </TableCell>
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
          Click on any time or date to edit it. Press Enter or click outside to
          save changes.
        </p>
      </CardFooter>
    </Card>
  );
}
