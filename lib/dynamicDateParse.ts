import { parse, isValid } from "date-fns";

export function dynamicDateParser(dateString: string): Date | null {
  const formats = [
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "yyyy-MM-dd",
    "MM/dd/yyyy h:mm:ss a",
    "dd-MM-yyyy h:mm:ss a",
    "yyyy-MM-dd h:mm:ss a",
    "yyyy/MM/dd",
    "M/d/yyyy",
    "d/M/yyyy",
    "M-d-yyyy",
    "d-M-yyyy",
    "d MMM yyyy", // e.g., 21 Feb 2025
    "MMM d, yyyy", // e.g., Feb 21, 2025
  ];

  // First, try the default Date constructor
  let parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  // Try parsing with each format
  for (const format of formats) {
    parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  // If no valid date found
  return null;
}
