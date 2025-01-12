import { Country, City } from "country-state-city";
import {
  BadgeMinus,
  Bell,
  BookUser,
  Building2,
  Calendar,
  CalendarClock,
  CalendarFold,
  CalendarPlus,
  ChartNoAxesCombined,
  FileUser,
  Group,
  Hand,
  LayoutDashboard,
  List,
  Lock,
  NotebookText,
  NotepadTextDashed,
  Settings,
  SlidersHorizontal,
  User,
  UserRoundX,
  Users,
} from "lucide-react";

export const GenderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const ExperienceLevels = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
  { label: "Expert", value: "Expert" },
];

export const CountryOptions = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));

export const getCityOptions = (countryCode: string) => {
  const cities = City.getCitiesOfCountry(countryCode);

  // Use a unique value that combines city name and country code or some unique identifier
  return cities
    ? cities.map((city) => ({
        label: city.name,
        value: `${city.name}-${city.stateCode || countryCode}`, // Append state code or country code for uniqueness
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
    href: "/admin/attendance-management/manage-attendance",
    subitems: [
      {
        icon: CalendarPlus,
        label: "Mark Attendance",
        href: "/admin/attendance-management/mark-attendance",
      },
      {
        icon: CalendarFold,
        label: "Manage Attendance",
        href: "/admin/attendance-management/manage-attendance",
      },
    ],
  },
  {
    icon: NotebookText,
    label: "Leave Management",
    href: "/admin/leave-management/manage-requests",
    subitems: [
      {
        icon: Hand,
        label: "Raise Leave Requests",
        href: "/admin/leave-management/raise-requests",
      },
      {
        icon: NotepadTextDashed,
        label: "Manage Employee Leave Requests",
        href: "/admin/leave-management/manage-requests",
      },
    ],
  },
  {
    icon: Calendar,
    label: "Time Table",
    href: "/admin/timetable",
  },
  {
    icon: List,
    label: "Jobs",
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
    href: "/admin/resign/manage-resignations",
    subitems: [
      {
        icon: Hand,
        label: "Raise Resignation Requests",
        href: "/admin/resign/raise-request",
      },
      {
        icon: NotepadTextDashed,
        label: "Manage Resignation Requests",
        href: "/admin/resign/manage-resignations",
      },
    ],
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
    icon: BadgeMinus,
    label: "Resignation Requests",
    href: "/employee/resign",
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
    href: "/manager/attendance",
    subitems: [
      {
        icon: CalendarPlus,
        label: "Mark Attendance",
        href: "/manager/attendance-management/mark-attendance",
      },
      {
        icon: CalendarFold,
        label: "Manage Attendance",
        href: "/manager/attendance-management/manage-attendance",
      },
    ],
  },
  {
    icon: NotebookText,
    label: "Leave Management",
    href: "/manager/leave-management",
    subitems: [
      {
        icon: Hand,
        label: "Raise Leave Requests",
        href: "/manager/leave-management/raise-requests",
      },
      {
        icon: NotepadTextDashed,
        label: "Manage Employee Leave Requests",
        href: "/manager/leave-management/manage-requests",
      },
    ],
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
    href: "/employee/resign",
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
    label: "Jobs",
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
    href: "/ceo/dashboard/overview",
  },
  {
    icon: BadgeMinus,
    label: "Resignation Requests",
    href: "/ceo/resign/manage-resignations",
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
