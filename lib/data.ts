import { Country, City } from "country-state-city";
import {
  BadgeMinus,
  Bell,
  BookUser,
  Building2,
  CalculatorIcon,
  Calendar,
  CalendarClock,
  CalendarFold,
  CalendarPlus,
  ChartNoAxesCombined,
  FileUser,
  FolderOpen,
  FolderOpenDot,
  Group,
  Hand,
  HousePlug,
  LayoutDashboard,
  List,
  ListCheck,
  Lock,
  Mailbox,
  NotebookPen,
  NotebookText,
  NotepadTextDashed,
  Settings,
  SlidersHorizontal,
  User,
  UserRoundX,
  Users,
} from "lucide-react";
import { FaFileContract } from "react-icons/fa";

export const GenderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const BloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export const ExperienceLevels = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
  { label: "Expert", value: "Expert" },
];

export const InterviewMarkingOptions = [
  { label: "N/A", value: "N/A" },
  { label: "Poor (1)", value: "1" },
  { label: "Average (2)", value: "2" },
  { label: "Good (3)", value: "3" },
  { label: "V. Good (4)", value: "4" },
  { label: "Excellent (5)", value: "5" },
];

export const CountryOptions = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));

export const getCityOptions = (countryCode: string) => {
  const cities = City.getCitiesOfCountry(countryCode);

  return cities
    ? cities.map((city) => ({
        label: city.name, // Display name
        value: `${city.name}-${city.stateCode || countryCode}`, // Unique identifier
      }))
    : [];
};

export const settingsTabs = [
  {
    icon: Users,
    label: "Account",
    value: "account",
  },
  {
    icon: Lock,
    label: "Security",
    value: "security",
  },
];

export const configurationTabs = [
  {
    icon: Building2,
    label: "General",
    value: "general",
  },
];

export const requestsTabs = [
  {
    icon: FolderOpenDot,
    label: "Raise Requests",
    value: "raiseRequests",
  },
  {
    icon: FolderOpen,
    label: "Manage Requests",
    value: "manageRequests",
  },
  {
    icon: Users,
    label: "Profile Update Requests",
    value: "profileUpdateRequests",
  },
];

export const leaveManagementTabs = [
  {
    icon: Hand,
    label: "Raise Leave Requests",
    value: "raiseRequests",
  },
  {
    icon: NotepadTextDashed,
    label: "Manage Requests",
    value: "manageRequests",
  },
];

export const workFromHomeTabs = [
  {
    icon: HousePlug,
    label: "Raise Requests",
    value: "raiseRequests",
  },
  {
    icon: FolderOpen,
    label: "Manage Requests",
    value: "manageRequests",
  },
];

export const employeesTabs = [
  {
    icon: Users,
    label: "Profile",
    value: "profile",
  },
  {
    icon: ListCheck,
    label: "Report",
    value: "report",
  },
  {
    icon: NotebookPen,
    label: "Appraisal",
    value: "appraisal",
  },
];

export const employeesListTabs = [
  {
    icon: Users,
    label: "Employees List",
    value: "employeesList",
  },
  {
    icon: CalculatorIcon,
    label: "Leave Balance Management",
    value: "leaveBalanceManagement",
  },
  {
    icon: ListCheck,
    label: "Leave Balance Report",
    value: "leaveBalanceReport",
  },
  {
    icon: NotebookPen,
    label: "Appraisals",
    value: "appraisals",
  },
];

export const attendanceManagementTabs = [
  {
    icon: CalendarPlus,
    label: "Mark Attendance",
    value: "markAttendance",
  },
  {
    icon: CalendarFold,
    label: "Manage Attendance",
    value: "manageAttendance",
  },
];

export const resignationManagementTabs = [
  {
    icon: Hand,
    label: "Raise Resignation Requests",
    value: "raiseRequests",
  },
  {
    icon: NotepadTextDashed,
    label: "Manage Resignation Requests",
    value: "manageRequests",
  },
];

export const requestTabsForCEO = [
  {
    icon: Users,
    label: "Profile Update Requests",
    value: "profileUpdateRequests",
  },
  {
    icon: FolderOpen,
    label: "Manage Requests",
    value: "manageRequests",
  },
];

export const complaintsTabs = [
  {
    icon: FolderOpenDot,
    label: "Raise Complaints",
    value: "raiseComplaints",
  },
  {
    icon: FolderOpen,
    label: "Manage Complaints",
    value: "manageComplaints",
  },
];

export const compaintsCEO = [
  {
    icon: FolderOpen,
    label: "Manage Complaints",
    value: "manageComplaints",
  },
];

const notificationRoute = {
  icon: Bell, // Use the appropriate icon for notifications
  label: "Notifications",
  href: "/notifications",
};

export const userRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Account Settings",
    href: "/settings",
  },
  notificationRoute, // Add notifications route
];

export const adminRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: Group,
    label: "Team Members",
    href: "/admin/team-members",
  },
  {
    icon: CalendarClock,
    label: "Attendance Management",
    href: "/admin/attendance-management",
  },
  {
    icon: NotebookText,
    label: "Leave Management",
    href: "/admin/leave-management",
  },
  {
    icon: HousePlug,
    label: "Work From Home",
    href: "/admin/workFromHome",
  },
  {
    icon: Calendar,
    label: "Time Table",
    href: "/admin/timetable",
  },
  {
    icon: List,
    label: "Jobs/Internships",
    href: "/admin/jobs",
  },
  {
    icon: Users,
    label: "Employees",
    href: "/admin/employees",
  },
  {
    icon: FileUser,
    label: "Applicants",
    href: "/admin/applicants",
  },
  {
    icon: UserRoundX,
    label: "Rejected",
    href: "/admin/rejected",
  },
  {
    icon: BookUser,
    label: "Interviewees",
    href: "/admin/interviewees",
  },
  {
    icon: BadgeMinus,
    label: "Resignation Management",
    href: "/admin/resignationManagement",
  },
  {
    icon: FolderOpenDot,
    label: "Requests",
    href: "/admin/requests",
  },
  {
    icon: Mailbox,
    label: "Complaints",
    href: "/admin/complaints",
  },
  {
    icon: NotebookPen,
    label: "Appraisals",
    href: "/admin/appraisals",
  },
  {
    icon: FaFileContract,
    label: "Contract Management",
    href: "/admin/contract-management",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Account Settings",
    href: "/settings",
  },
  {
    icon: SlidersHorizontal,
    label: "Configuration",
    href: "/admin/configuration",
  },
  notificationRoute, // Add notifications route
];

export const employeeRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/employee/dashboard",
  },
  {
    icon: Group,
    label: "Team Members",
    href: "/employee/team-members",
  },
  {
    icon: CalendarClock,
    label: "Attendance",
    href: "/employee/attendance-management",
  },
  {
    icon: NotebookText,
    label: "Leave Management",
    href: "/employee/leave-management",
  },
  {
    icon: HousePlug,
    label: "Work From Home",
    href: "/employee/workFromHome",
  },
  {
    icon: BadgeMinus,
    label: "Resignation Requests",
    href: "/employee/resign",
  },
  {
    icon: FolderOpenDot,
    label: "Requests",
    href: "/employee/requests",
  },
  {
    icon: Mailbox,
    label: "Complaints",
    href: "/employee/complaints",
  },
  {
    icon: NotebookPen,
    label: "Appraisals",
    href: "/employee/appraisals",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Account Settings",
    href: "/settings",
  },
  notificationRoute, // Add notifications route
];

export const managerRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/manager/dashboard",
  },
  {
    icon: Group,
    label: "Team Members",
    href: "/manager/team-members",
  },
  {
    icon: CalendarClock,
    label: "Attendance",
    href: "/manager/attendance-management",
  },
  {
    icon: NotebookText,
    label: "Leave Management",
    href: "/manager/leave-management",
  },
  {
    icon: HousePlug,
    label: "Work From Home",
    href: "/manager/workFromHome",
  },
  {
    icon: FileUser,
    label: "Applicants",
    href: "/manager/applicants",
  },
  {
    icon: UserRoundX,
    label: "Rejected",
    href: "/manager/rejected",
  },
  {
    icon: BookUser,
    label: "Interviewees",
    href: "/manager/interviewees",
  },
  {
    icon: BadgeMinus,
    label: "Resignation Requests",
    href: "/manager/resign",
  },
  {
    icon: FolderOpenDot,
    label: "Requests",
    href: "/manager/requests",
  },
  {
    icon: Mailbox,
    label: "Complaints",
    href: "/manager/complaints",
  },
  {
    icon: NotebookPen,
    label: "Appraisals",
    href: "/manager/appraisals",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Account Settings",
    href: "/settings",
  },
  notificationRoute, // Add notifications route
];

export const ceoRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/ceo/dashboard",
  },
  {
    icon: Users,
    label: "Employees",
    href: "/ceo/employees",
  },
  {
    icon: NotebookText,
    label: "Leave Management",
    href: "/ceo/leave-management",
  },
  {
    icon: HousePlug,
    label: "Work From Home",
    href: "/ceo/workFromHome",
  },
  {
    icon: CalendarClock,
    label: "Attendance Management",
    href: "/ceo/attendance-management",
  },
  {
    icon: Calendar,
    label: "Time Table",
    href: "/ceo/timetable",
  },
  {
    icon: List,
    label: "Jobs/Internships",
    href: "/ceo/jobs",
  },
  {
    icon: FileUser,
    label: "Applicants",
    href: "/ceo/applicants",
  },
  {
    icon: UserRoundX,
    label: "Rejected",
    href: "/ceo/rejected",
  },
  {
    icon: BookUser,
    label: "Interviewees",
    href: "/ceo/interviewees",
  },
  {
    icon: ChartNoAxesCombined,
    label: "Overview",
    href: "/ceo/overview",
  },
  {
    icon: BadgeMinus,
    label: "Resignation Requests",
    href: "/ceo/resign/manage-resignations",
  },
  {
    icon: FolderOpenDot,
    label: "Requests",
    href: "/ceo/requests",
  },
  {
    icon: Mailbox,
    label: "Complaints",
    href: "/ceo/complaints",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Account Settings",
    href: "/settings",
  },
  {
    icon: SlidersHorizontal,
    label: "Configuration",
    href: "/ceo/configuration",
  },
  notificationRoute, // Add notifications route
];
