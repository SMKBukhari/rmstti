"use client";

import { checkEmployeeStatus } from "@/actions/StatusChecker";
import { useEffect } from "react";

export function StatusChecker() {
  useEffect(() => {
    // Initial check
    checkEmployeeStatus();
    console.log("Status checker started");
    console.log(checkEmployeeStatus);
    
    // Set up interval for periodic checks (every 5 minutes)
    const interval = setInterval(() => {
        checkEmployeeStatus();
        console.log("Checking status every 5 minutes");
        console.log(checkEmployeeStatus);
    }, 5 * 60 * 1000);


    return () => clearInterval(interval);
  }, []);

  return null; // This is a utility component that doesn't render anything
}
