"use client";
import { useTheme } from "next-themes";

export const UserImage = () => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? "/img/user_dark.png" : "/img/user_light.png";
};
