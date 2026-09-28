export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: "NEW";
  createdAt: string;
};