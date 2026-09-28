import { LucideIcon } from "lucide-react";

export type MaintenanceService = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  icon: LucideIcon;
  isActive: boolean;
};

export type MaintenanceRequest = {
  id: string;
  customerName: string;
  phone: string;
  area: string;
  address: string;
  applianceType: string;
  serviceId: string;
  brand?: string;
  model?: string;
  problemDescription?: string;
  preferredContactTime?: string;
  notes?: string;
  status: "PENDING";
  createdAt: string;
};