import { OrderStatus, Role } from "@prisma/client";

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  isActive: boolean;
  defaultProfitRate: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Order Types
export interface DashboardOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  service: {
    id: string;
    title: string;
  };
  student: {
    id: string;
    name: string;
  };
  totalPrice: number;
  employeeProfit: number;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  priority?: string | null;
  subjectName?: string | null;
  orderType?: string | null;
  description?: string | null;
  revisionCount?: number;
  grade?: string | null;
  gradeType?: string | null;
}

export interface OrdersFilterParams {
  status?: OrderStatus;
  search?: string;
}

// Order Detail Types
export interface OrderDetailFile {
  name: string;
  url: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  service: {
    id: string;
    title: string;
    description: string;
  };
  student: {
    id: string;
    name: string;
    whatsapp: string | null;
    email: string | null;
  };
  totalPrice: number;
  employeeProfit: number;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  clientFiles: OrderDetailFile[];
  workFiles: OrderDetailFile[];
  revisionNotes: string | null;
  priority?: string | null;
  subjectName?: string | null;
  orderType?: string | null;
  description?: string | null;
  revisionCount?: number;
  grade?: string | null;
  gradeType?: string | null;
  paymentType?: string | null;
  paymentInstallments?: number[] | null;
  discount?: number;
}

export interface DeliverWorkRequest {
  workFiles?: OrderDetailFile[];
  workLinks?: string;
}
