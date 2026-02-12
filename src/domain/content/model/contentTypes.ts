export interface CategoryItem {
  id: number;
  name: string;
}

export interface KeywordItem {
  id: number;
  name: string;
}

export type ShortsStatus = "PENDING" | "AI_CHECK" | "PUBLISHED" | "REJECT";

export interface ShortsInspectionResult {
  inspectionStatus: string;
  isItEducation: boolean;
  category: string;
  confidenceScore: number;
  reason: string;
  inspectedAt: string;
}

export interface ShortsReviewItem {
  shortsId: number;
  userId: number;
  authorName: string | null;
  categoryId: number;
  title: string;
  status: ShortsStatus;
  videoUrl: string | null;
  createdAt: string;
  inspectionResult: ShortsInspectionResult | null;
}

export interface ShortsReviewPage {
  content: ShortsReviewItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface InspectionTriggerResult {
  shortsId: number;
  inspectionStatus: string;
  message: string;
}
