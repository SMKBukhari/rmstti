import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatedString = (input:string) => {
  // split the strings based on the delimiter "-"
  const parts = input.split("-");

  // capitalize the each words
  const capitalize = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });

  return capitalize.join(" ");
}