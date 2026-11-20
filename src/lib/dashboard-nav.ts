export interface DashboardNavItem {
  href: string;
  label: string;
  icon:
    | "rentals"
    | "favorites"
    | "profile"
    | "analytics"
    | "add"
    | "equipment"
    | "users";
}

export const CUSTOMER_NAV: DashboardNavItem[] = [
  { href: "/dashboard/customer", label: "My Rentals", icon: "rentals" },
  {
    href: "/dashboard/customer/favorites",
    label: "Favorites",
    icon: "favorites",
  },
  { href: "/dashboard/customer/profile", label: "Profile", icon: "profile" },
];

export const OWNER_NAV: DashboardNavItem[] = [
  {
    href: "/dashboard/owner",
    label: "Analytics & Overview",
    icon: "analytics",
  },
  {
    href: "/dashboard/owner/add-equipment",
    label: "Add Equipment",
    icon: "add",
  },
  {
    href: "/dashboard/owner/my-equipment",
    label: "My Equipment",
    icon: "equipment",
  },
  {
    href: "/dashboard/owner/rentals",
    label: "My Equipment Rental",
    icon: "rentals",
  },
  { href: "/dashboard/owner/profile", label: "My Profile", icon: "profile" },
];

export const ADMIN_NAV: DashboardNavItem[] = [
  {
    href: "/dashboard/admin",
    label: "Analytics & Overview",
    icon: "analytics",
  },
  { href: "/dashboard/admin/users", label: "All Users", icon: "users" },
  {
    href: "/dashboard/admin/equipment",
    label: "All Equipment",
    icon: "equipment",
  },
  { href: "/dashboard/admin/rentals", label: "All Rentals", icon: "rentals" },
  { href: "/dashboard/admin/profile", label: "My Profile", icon: "profile" },
];
