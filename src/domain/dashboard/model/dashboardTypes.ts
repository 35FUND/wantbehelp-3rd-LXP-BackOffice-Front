export interface DailyUploadCount {
  date: string;
  uploadCount: number;
}

export interface PublishConversionRate {
  totalCount: number;
  publishedCount: number;
  conversionRate: number;
}

export interface CategoryShortsCountResponse {
  categoryId: number;
  categoryName: string;
  shortsCount: number;
}

export interface UserStatsResponse {
  days: number;
  from: string;
  to: string;
  totalUsers: number;
  newUsersInRange: number;
  daily: {
    date: string;
    count: number;
  }[];
}
