import {
  Building2,
  CalendarClock,
  Coins,
  FolderTree,
  Hash,
  IdCard,
  LayoutGrid,
} from "lucide-react";

const settingTabs = [
  {
    id: "company",
    name: "Company",
    link: "/admin/settings/company",
    description: "Brand, legal, and contact profile",
    icon: Building2,
  },
  {
    id: "currency",
    name: "Currency",
    link: "/admin/settings/currency",
    description: "Default currency, symbols",
    icon: Coins,
  },
  {
    id: "prefix",
    name: "Prefix",
    link: "/admin/settings/prefix",
    description: "Document numbering rules across modules",
    icon: Hash,
  },
  {
    id: "departments",
    name: "Departments",
    link: "/admin/settings/departments",
    description: "Organizational structure and teams",
    icon: LayoutGrid,
  },
  {
    id: "designations",
    name: "Designations",
    link: "/admin/settings/designations",
    description: "Role taxonomy and title governance",
    icon: IdCard,
  },
  {
    id: "leave",
    name: "Leave",
    link: "/admin/settings/leave",
    description: "Policies, calendars, and accrual rules",
    icon: CalendarClock,
  },
  {
    id: "document-category",
    name: "Documents",
    link: "/admin/settings/document-category",
    description: "Organize employee documents",
    icon: FolderTree,
  },
  // Templates are kept out for now but ready for reactivation
  // {
  //   id: "templates",
  //   name: "Templates",
  //   link: "/admin/settings/templates",
  //   description: "Reusable layouts and document boilerplates",
  //   icon: FileStack,
  // },
];

export default settingTabs;
