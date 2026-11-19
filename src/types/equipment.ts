export const EQUIPMENT_CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
] as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

export type RentalType = "Daily" | "Weekly" | "Monthly";

export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: RentalType | string;
  availableQuantity: number;
  condition: string;
  brand?: string;
  model?: string;
  image: string;
  rentalTerms?: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  rentalCount?: number;
  createdAt?: string;
}

export interface CategorySummary {
  name: string;
  count: number;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  role: string;
  rating: number;
  equipmentName: string;
  comment: string;
}
