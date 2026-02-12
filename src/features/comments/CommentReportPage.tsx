import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  getCommentReports,
  processCommentReport,
  rejectCommentReport,
  type CommentReportSearchParams,
} from "../../domain/comment/api/commentApi";
import type { CommentReport, ReportStatus } from "../../domain/comment/model/commentTypes";

const PAGE_SIZE = 20;

export default function CommentReportPage() {
  const [reports, setReports] = useState<CommentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    void loadReports();
  }, [statusFilter, page]);

  const loadReports = async (forcedKeyword?: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const params: CommentReportSearchParams = {
        status: statusFilter === "ALL" ? undefined : statusFilter,
        keyword: forcedKeyword ?? keyword,
        page,
        size: PAGE_SIZE,
      };
      const data = await getCommentReports(params);
      setReports(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setErrorMessage("댓글 신고 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setPage(0);
    await loadReports(keyword);
  };

  const handleProcess = async (reportId: number) => {
    try {
      setProcessingId(reportId);
      await processCommentReport(reportId);
      await loadReports();
    } catch {
      setErrorMessage("신고 처리에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reportId: number) => {
    try {
      setRejectingId(reportId);
      await rejectCommentReport(reportId);
      await loadReports();
    } catch {
      setErrorMessage("신고 반려에 실패했습니다.");
    } finally {
      setRejectingId(null);
    }
  };

  const pendingCount = reports.filter((report) => report.status === "PENDING").length;
  const processedCount = reports.filter((report) => report.status === "PROCESSED").length;
  const rejectedCount = reports.filter((report) => report.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-gray-900">댓글 신고 관리</h1>
        <p className="text-body-reg text-gray-500 mt-2">신고 내역을 조회하고 처리 완료/반려 상태로 변경합니다.</p>
      </div>

      {errorMessage ? (
        <Card>
          <CardContent className="py-4 text-sm text-error">{errorMessage}</CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>처리 대기</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{pendingCount}건</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>처리 완료</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{processedCount}건</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>반려</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{rejectedCount}건</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>검색/필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select
              className="h-10 min-w-[140px] rounded-md border border-gray-300 px-3 text-sm"
              value={statusFilter}
              onChange={(e) => {
                setPage(0);
                setStatusFilter(e.target.value as ReportStatus | "ALL");
              }}
            >
              <option value="ALL">전체 상태</option>
              <option value="PENDING">대기</option>
              <option value="PROCESSED">처리 완료</option>
              <option value="REJECTED">반려</option>
            </select>

            <Input
              className="md:flex-1"
              placeholder="신고 사유/댓글ID 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
            />

            <Button className="shrink-0 whitespace-nowrap" onClick={() => void handleSearch()}>
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>신고 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">댓글ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고자</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고 사유</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">댓글 내용</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">쇼츠ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고 시각</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-3 text-center text-sm text-gray-500">로딩 중...</td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-3 text-center text-sm text-gray-500">신고 내역이 없습니다.</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.reportId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{report.reportId}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{report.commentId}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{report.reporterName ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{report.reason}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{report.commentContent ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{report.commentWriterId ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{report.shortsId ?? "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={statusVariant(report.status)}>{statusLabel(report.status)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(report.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        {report.status === "PENDING" ? (
                          <div className="inline-flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => void handleProcess(report.reportId)}
                              disabled={processingId === report.reportId || rejectingId === report.reportId}
                            >
                              {processingId === report.reportId ? "처리 중..." : "처리 완료"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => void handleReject(report.reportId)}
                              disabled={processingId === report.reportId || rejectingId === report.reportId}
                            >
                              {rejectingId === report.reportId ? "반려 중..." : "반려"}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">완료</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>총 {totalElements.toLocaleString()}건</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
                이전
              </Button>
              <span>{totalPages === 0 ? 0 : page + 1} / {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => (totalPages === 0 ? prev : Math.min(prev + 1, totalPages - 1)))}
                disabled={totalPages === 0 || page >= totalPages - 1}
              >
                다음
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(dateString: string): string {
  if (!dateString) {
    return "-";
  }

  return new Date(dateString).toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: ReportStatus): string {
  if (status === "PENDING") {
    return "대기";
  }
  if (status === "PROCESSED") {
    return "처리 완료";
  }
  return "반려";
}

function statusVariant(status: ReportStatus): "warning" | "success" | "secondary" {
  if (status === "PENDING") {
    return "warning";
  }
  if (status === "PROCESSED") {
    return "success";
  }
  return "secondary";
}
