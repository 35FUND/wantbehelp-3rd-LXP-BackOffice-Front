export type ReportStatus = "PENDING" | "PROCESSED" | "REJECTED";
export type CommentDeleteReason = "ABUSE" | "SEXUAL" | "PERSONAL_INFO" | "SPAM" | "ETC";

export interface CommentReport {
  reportId: number;
  commentId: number;
  reporterId: number;
  reporterName: string | null;
  reason: string;
  actionReason: string | null;
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
