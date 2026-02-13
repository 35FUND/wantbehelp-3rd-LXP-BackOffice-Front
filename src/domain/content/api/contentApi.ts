import { httpClient } from "../../../global/config/httpClient";
import type { ApiResponse } from "../../../global/common/types/apiResponse";
import type {
  CategoryItem,
  KeywordItem,
  ShortsReviewPage,
  ShortsRejectReason,
  ShortsStatus,
  InspectionTriggerResult,
  ShortsInspectionResult,
} from "../model/contentTypes";

export async function addCategory(name: string): Promise<void> {
  await httpClient.post<ApiResponse<null>>("/api/v1/categories", { name });
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await httpClient.delete<ApiResponse<null>>(`/api/v1/categories/${categoryId}`);
}

export async function addKeyword(displayName: string): Promise<void> {
  await httpClient.post<ApiResponse<null>>("/api/v1/keywords", { displayName });
}

export async function deleteKeyword(keywordId: number): Promise<void> {
  await httpClient.delete<ApiResponse<null>>(`/api/v1/keywords/${keywordId}`);
}

export async function getCategories(): Promise<CategoryItem[]> {
  const response = await httpClient.get<ApiResponse<CategoryItem[]>>("/api/v1/categories");
  return response.data.data ?? [];
}

export async function getKeywords(): Promise<KeywordItem[]> {
  const response = await httpClient.get<ApiResponse<KeywordItem[]>>("/api/v1/keywords");
  return response.data.data ?? [];
}

export async function getShortsReviewPage(params: {
  status?: ShortsStatus;
  page?: number;
  size?: number;
}): Promise<ShortsReviewPage> {
  const response = await httpClient.get<ApiResponse<ShortsReviewPage>>("/api/v1/backoffice/shorts/reviews", {
    params: {
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: "createdAt,desc",
    },
  });
  return (
    response.data.data ?? {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    }
  );
}

export async function triggerShortsInspection(shortsId: number): Promise<InspectionTriggerResult> {
  const response = await httpClient.post<ApiResponse<InspectionTriggerResult>>(
    `/api/v1/backoffice/shorts/reviews/${shortsId}/inspect`
  );
  return response.data.data;
}

export async function updateShortsStatus(
  shortsId: number,
  status: ShortsStatus,
  rejectReason?: ShortsRejectReason
): Promise<void> {
  await httpClient.patch<ApiResponse<null>>(`/api/v1/backoffice/shorts/reviews/${shortsId}/status`, { status, rejectReason });
}

export async function getShortsInspectionResult(shortsId: number): Promise<ShortsInspectionResult> {
  const response = await httpClient.get<ApiResponse<ShortsInspectionResult>>(
    `/api/v1/backoffice/shorts/reviews/${shortsId}/inspection-result`
  );
  return response.data.data;
}
