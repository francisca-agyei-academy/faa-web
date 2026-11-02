/** Shapes returned by the public /api/v1/courses endpoints. */

export interface CatalogModule {
  id: string;
  title: string;
  description: string | null;
  order: number;
  topics: string[];
  /** Pesewas; null = price not set. */
  price: number | null;
  accessDays: number | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
}

export interface CatalogCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  track: string;
  audience: string | null;
  outcomeFrom: string | null;
  outcomeTo: string | null;
  topics: string[];
  imageKey: string;
  imageUrl: string | null;
  isFeatured: boolean;
  enrollmentOpen: boolean;
  includesToolkit: boolean;
  includesSignatureBonus: boolean;
  sortOrder: number;
  modules: CatalogModule[];
}

/** A row of GET /me/purchases. */
export interface MyPurchase {
  id: string;
  expiresAt: string;
  createdAt: string;
  isActive: boolean;
  module: {
    id: string;
    title: string;
    description: string | null;
    topics: string[];
    accessDays: number | null;
    order: number;
    course: { id: string; slug: string; title: string; imageKey: string; imageUrl: string | null } | null;
  } | null;
}
