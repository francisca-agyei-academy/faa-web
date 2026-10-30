export type Role = "STUDENT" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  isEmailVerified: boolean;
  createdAt: string;
}

/** Body of login, register and refresh. The refresh token travels only in an httpOnly cookie. */
export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface MessageResponse {
  message: string;
}

/** Error envelope every API error uses. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export interface FieldIssue {
  path: string;
  message: string;
}

// Course types mirror the API contract; the course endpoints are not built yet.
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  isPublished: boolean;
  modules?: Module[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  /** In pesewas (GHS minor unit). */
  price: number;
  accessDays: number;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  isPublished: boolean;
}
