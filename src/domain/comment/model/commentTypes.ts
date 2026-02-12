export type ReportStatus = "PENDING" | "PROCESSED" | "REJECTED";

export interface CommentReport {
  reportId: number;
  commentId: number;
  reporterId: number;
  reporterName: string | null;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  commentContent: string | null;
  commentWriterId: number | null;
  shortsId: number | null;
}

export interface CommentReportPage {
  content: CommentReport[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
