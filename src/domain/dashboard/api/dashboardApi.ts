import { httpClient } from "../../../global/config/httpClient";
import type { ApiResponse } from "../../../global/common/types/apiResponse";
import type {
  DailyUploadCount,
  PublishConversionRate,
  CategoryShortsCountResponse,
  UserStatsResponse,
} from "../model/dashboardTypes";

export async function getDailyUploadCounts(days: number): Promise<DailyUploadCount[]> {
  const response = await httpClient.get<ApiResponse<DailyUploadCount[]>>("/api/v1/dashboard/uploads", {
    params: { days },
  });

  return response.data.data ?? [];
}

export async function getPublishConversionRate(days: number): Promise<PublishConversionRate> {
  const response = await httpClient.get<ApiResponse<PublishConversionRate>>("/api/v1/dashboard/conversion-rate", {
    params: { days },
  });

  return (
    response.data.data ?? {
      totalCount: 0,
      publishedCount: 0,
      conversionRate: 0,
    }
  );
}

export async function getCategoryShortsCount(): Promise<CategoryShortsCountResponse[]> {
  const response = await httpClient.get<ApiResponse<CategoryShortsCountResponse[]>>(
    "/api/v1/dashboard/categories/shorts-count"
  );
  return response.data.data ?? [];
}

export async function getUserStats(days: number): Promise<UserStatsResponse> {
  const response = await httpClient.get<ApiResponse<UserStatsResponse>>("/api/v1/stats/users", {
    params: { days },
  });
  return response.data.data;
}
