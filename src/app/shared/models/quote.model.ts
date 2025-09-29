export interface Quote {
  id?: string;
  mentorId: string;
  content: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
