import cron from "node-cron";
import { checkAndEscalateComplaints } from "@/lib/checkComplaints";

// Schedule a task to run every 3 days at midnight (00:00)
cron.schedule("0 0 */3 * *", async () => {
  console.log("Running scheduled complaint escalation...");
  await checkAndEscalateComplaints();
});

console.log("Complaint escalation cron job initialized.");
