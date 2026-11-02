import type { Role } from "./index";

export type OrderStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminModule {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  topics: string[];
  /** Pesewas; null = price not set yet. */
  price: number | null;
  accessDays: number | null;
  contentUrl: string | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  isPublished: boolean;
}

interface CourseBase {
  id: string;
  title: string;
  slug: string;
  description: string;
  track: string;
  audience: string | null;
  outcomeFrom: string | null;
  outcomeTo: string | null;
  topics: string[];
  imageKey: string;
  /** Uploaded photo (Cloudflare R2); shown instead of imageKey when set. */
  imageUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  enrollmentOpen: boolean;
  includesToolkit: boolean;
  includesSignatureBonus: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** In the course list, `modules` is a count. */
export interface AdminCourseRow extends CourseBase {
  modules: number;
}

export interface AdminCourse extends CourseBase {
  modules: AdminModule[];
}

export type CourseInput = Omit<CourseBase, "id" | "createdAt" | "updatedAt" | "imageUrl">;
export type ModuleInput = Omit<AdminModule, "id" | "courseId" | "order">;

export interface PersonRef {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface StudentRow extends PersonRef {
  phone: string | null;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  purchases: number;
}

export interface OrderSummary {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface StudentDetail extends Omit<StudentRow, "purchases"> {
  emailVerifiedAt: string | null;
  lastLoginIp: string | null;
  updatedAt: string;
  sessions: number;
  orders: OrderSummary[];
  purchases: Array<{
    id: string;
    expiresAt: string;
    createdAt: string;
    orderId: string;
    module: { id: string; title: string; courseId: string } | null;
  }>;
}

export interface OrderRow extends OrderSummary {
  userId: string;
  user: PersonRef | null;
  purchases: number;
}

export interface OrderDetail extends OrderSummary {
  userId: string;
  user: (PersonRef & { phone: string | null }) | null;
  purchases: Array<{
    id: string;
    expiresAt: string;
    createdAt: string;
    module: { id: string; title: string; price: number | null } | null;
  }>;
  transactions: Array<{
    id: string;
    reference: string;
    paystackId: number | null;
    amount: number;
    currency: string;
    status: string;
    gatewayResponse: string | null;
    channel: string | null;
    paidAt: string | null;
    createdAt: string;
  }>;
}

export interface AdminStats {
  students: number;
  unverifiedStudents: number;
  courses: number;
  publishedCourses: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  pendingOrders: number;
  recentOrders: Array<OrderSummary & { user: PersonRef | null }>;
  recentStudents: Array<PersonRef & { isEmailVerified: boolean; createdAt: string }>;
}
