"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

const ClientAvatar = ({ avatarFallback }: { avatarFallback: string }) => {
  const { resolvedTheme } = useTheme();
  const userImage =
    resolvedTheme === "dark" ? "/img/user_dark.png" : "/img/user_light.png";

  return (
    <Avatar className="w-full h-full">
      <AvatarImage src={userImage} />
      <AvatarFallback>{avatarFallback}</AvatarFallback>
    </Avatar>
  );
};

export default ClientAvatar;
