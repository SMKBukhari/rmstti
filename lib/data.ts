import { Country, City } from "country-state-city"
import { Bell, BookUser, ChartNoAxesCombined, FileUser, LayoutDashboard, Lock, Settings, User, Users } from "lucide-react";

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
]

export const CountryOptions = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));

export const getCityOptions = (countryCode: string) => {
    const cities = City.getCitiesOfCountry(countryCode);
    
    // Use a unique value that combines city name and country code or some unique identifier
    return cities ? cities.map((city) => ({
        label: city.name,
        value: `${city.name}-${city.stateCode || countryCode}`, // Append state code or country code for uniqueness
    })) : [];
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
]

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
    icon: BookUser,
    label: "Interviewees",
    href: "/admin/interviewees",
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

// export const applicantRoutes = [
//   {
//     icon: LayoutDashboard,
//     label: "Dashboard",
//     href: "/applicant/dashboard",
//   },
//   {
//     icon: User,
//     label: "Profile",
//     href: "/profile",
//   },
//   {
//     icon: Settings,
//     label: "Account Settings",
//     href: "/settings",
//   },
//   notificationRoute, // Add notifications route
// ];

// export const interviewerRoutes = [
//   {
//     icon: LayoutDashboard,
//     label: "Dashboard",
//     href: "/interviewer/dashboard",
//   },
//   {
//     icon: User,
//     label: "Profile",
//     href: "/profile",
//   },
//   {
//     icon: Settings,
//     label: "Account Settings",
//     href: "/settings",
//   },
//   notificationRoute, // Add notifications route
// ];

export const employeeRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/employee/dashboard",
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
    href: "/ceo/dashboard/employees",
  },
  {
    icon: FileUser,
    label: "Recruiters",
    href: "/ceo/dashboard/recruiters",
  },
  {
    icon: BookUser,
    label: "Interviewers",
    href: "/ceo/dashboard/interviewers",
  },
  {
    icon: ChartNoAxesCombined,
    label: "Overview",
    href: "/ceo/dashboard/overview",
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

