import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  getShortsReviewPage,
  updateShortsStatus,
} from "../../domain/content/api/contentApi";
import type { ShortsReviewItem, ShortsStatus } from "../../domain/content/model/contentTypes";

const PAGE_SIZE = 20;

export default function VideoReviewPage() {
  const [items, setItems] = useState<ShortsReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ShortsStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [openedReasonShortsId, setOpenedReasonShortsId] = useState<number | null>(null);

  useEffect(() => {
    void loadItems();
  }, [statusFilter, page]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getShortsReviewPage({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page,
        size: PAGE_SIZE,
      });
      setItems(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setErrorMessage("영상 검수 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (shortsId: number, status: ShortsStatus) => {
    try {
      setWorkingId(shortsId);
      await updateShortsStatus(shortsId, status);
      await loadItems();
    } catch {
      setErrorMessage("영상 상태 변경에 실패했습니다.");
    } finally {
      setWorkingId(null);
    }
  };

  const pendingCount = items.filter((item) => item.status === "PENDING").length;
  const aiCheckCount = items.filter((item) => item.status === "AI_CHECK").length;
  const publishedCount = items.filter((item) => item.status === "PUBLISHED").length;
  const rejectCount = items.filter((item) => item.status === "REJECT").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h1 text-gray-900">영상 검수</h1>
          <p className="text-body-reg text-gray-500 mt-2">자동 AI 검수 결과를 확인하고 게시/반려를 결정합니다.</p>
        </div>
      </div>

      {errorMessage ? (
        <Card>
          <CardContent className="py-4 text-sm text-error">{errorMessage}</CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="검수 대기" value={pendingCount} />
        <MetricCard title="AI 점검" value={aiCheckCount} />
        <MetricCard title="게시" value={publishedCount} />
        <MetricCard title="반려" value={rejectCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            className="h-10 min-w-[180px] rounded-md border border-gray-300 px-3 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setPage(0);
              setStatusFilter(e.target.value as ShortsStatus | "ALL");
            }}
          >
            <option value="ALL">전체 상태</option>
            <option value="PENDING">대기</option>
            <option value="AI_CHECK">AI 점검</option>
            <option value="PUBLISHED">게시</option>
            <option value="REJECT">반려</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>검수 요청 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">쇼츠ID</th>
                  <th className="min-w-[220px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">영상</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI 결과</th>
                  <th className="min-w-[260px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI 검수 사유</th>
                  <th className="w-[11%] whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">등록 시각</th>
                  <th className="w-[10%] whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-3 text-center text-sm text-gray-500">로딩 중...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-3 text-center text-sm text-gray-500">검수 대상이 없습니다.</td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const hasInspectionResult = Boolean(item.inspectionResult);
                    const isReasonOpened = openedReasonShortsId === item.shortsId;

                    return (
                      <tr key={item.shortsId} className="hover:bg-gray-50 align-top">
                        <td className="px-4 py-3 text-sm text-gray-700">{item.shortsId}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <p className="truncate" title={item.title}>{item.title}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {item.videoUrl ? (
                            <a
                              href={item.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-8 items-center rounded-md border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              영상 보기
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.authorName ?? "-"}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Badge variant={statusVariant(item.status)}>{statusLabel(item.status)}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {hasInspectionResult
                            ? `${item.inspectionResult?.category ?? "-"} (${((item.inspectionResult?.confidenceScore ?? 0) * 100).toFixed(1)}%)`
                            : "검수 대기"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {hasInspectionResult ? (
                            <div className="space-y-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="whitespace-nowrap"
                                onClick={() => setOpenedReasonShortsId(isReasonOpened ? null : item.shortsId)}
                              >
                                {isReasonOpened ? "사유 닫기" : "사유 보기"}
                              </Button>
                              {isReasonOpened ? (
                                <p className="max-w-full whitespace-pre-wrap break-words rounded-md bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-700">
                                  {item.inspectionResult?.reason ?? "검수 사유가 없습니다."}
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">AI 검수 완료 후 확인 가능</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{formatDate(item.createdAt)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="inline-flex flex-col gap-2 whitespace-nowrap lg:flex-row">
                            <Button
                              size="sm"
                              className="min-w-[56px] whitespace-nowrap"
                              disabled={!hasInspectionResult || workingId === item.shortsId}
                              onClick={() => void handleStatusUpdate(item.shortsId, "PUBLISHED")}
                            >
                              게시
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="min-w-[56px] whitespace-nowrap"
                              disabled={!hasInspectionResult || workingId === item.shortsId}
                              onClick={() => void handleStatusUpdate(item.shortsId, "REJECT")}
                            >
                              반려
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{value}건</CardContent>
    </Card>
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

function statusLabel(status: ShortsStatus): string {
  if (status === "PENDING") {
    return "대기";
  }
  if (status === "AI_CHECK") {
    return "AI 점검";
  }
  if (status === "PUBLISHED") {
    return "게시";
  }
  return "반려";
}

function statusVariant(status: ShortsStatus): "warning" | "success" | "secondary" {
  if (status === "PENDING") {
    return "warning";
  }
  if (status === "PUBLISHED") {
    return "success";
  }
  return "secondary";
}
