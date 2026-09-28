export type Technician = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  photo?: string; // Optional for now
  specialtyAr: string;
  specialtyEn: string;
  bioAr: string;
  bioEn: string;
  phone?: string;
  experience?: string;
  serviceSlugs: string[]; // To link with maintenance services
  isActive: boolean;
};