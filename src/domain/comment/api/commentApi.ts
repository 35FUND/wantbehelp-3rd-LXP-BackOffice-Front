import { httpClient } from "../../../global/config/httpClient";
import type { ApiResponse } from "../../../global/common/types/apiResponse";
import type { CommentReport, CommentReportPage, ReportStatus } from "../model/commentTypes";

export interface CommentReportSearchParams {
  status?: ReportStatus;
  keyword?: string;
  page?: number;
  size?: number;
}

export async function getCommentReports(params: CommentReportSearchParams): Promise<CommentReportPage> {
  const response = await httpClient.get<ApiResponse<CommentReportPage>>("/api/v1/backoffice/comment-reports", {
    params: {
      status: params.status,
      keyword: params.keyword ?? "",
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

export async function getCommentReport(reportId: number): Promise<CommentReport> {
  const response = await httpClient.get<ApiResponse<CommentReport>>(`/api/v1/backoffice/comment-reports/${reportId}`);
  return response.data.data;
}

export async function processCommentReport(reportId: number): Promise<void> {
  await httpClient.patch<ApiResponse<null>>(`/api/v1/backoffice/comment-reports/${reportId}/process`);
}

export async function rejectCommentReport(reportId: number): Promise<void> {
  await httpClient.patch<ApiResponse<null>>(`/api/v1/backoffice/comment-reports/${reportId}/reject`);
}
