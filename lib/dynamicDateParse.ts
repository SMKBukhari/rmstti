import { parse, isValid } from "date-fns";

export function dynamicDateParser(dateString: string): Date | null {
  // First try to parse as standalone date
  const dateFormats = [
    "dd/MM/yyyy", // 13/02/2025
    "dd/MM/yyyy h:mm a", // 13/02/2025 9:00 AM
    "dd/MM/yyyy hh:mm a", // 13/02/2025 09:00 AM
    "MM/dd/yyyy", // 02/13/2025
    "yyyy-MM-dd", // 2025-02-13
    "dd-MM-yyyy", // 13-02-2025
    "MM-dd-yyyy", // 02-13-2025
    "yyyy/MM/dd", // 2025/02/13
    "M/d/yyyy", // 2/13/2025
    "d/M/yyyy", // 13/2/2025
    "d MMM yyyy", // 13 Feb 2025
    "MMM d, yyyy", // Feb 13, 2025
  ];

  // Try parsing with each format
  for (const formatStr of dateFormats) {
    try {
      const parsedDate = parse(dateString, formatStr, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    } catch (e) {
      console.error(`Failed to parse date with format ${formatStr}: ${e}`);
      continue;
    }
  }

  // Try the default Date constructor as fallback
  const fallbackDate = new Date(dateString);
  if (!isNaN(fallbackDate.getTime())) {
    return fallbackDate;
  }

  console.error(`Failed to parse date: ${dateString}`);
  return null;
}
