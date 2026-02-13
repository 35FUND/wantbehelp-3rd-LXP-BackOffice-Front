import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  getShortsReviewPage,
  updateShortsStatus,
} from "../../domain/content/api/contentApi";
import type { ShortsRejectReason, ShortsReviewItem, ShortsStatus } from "../../domain/content/model/contentTypes";

const PAGE_SIZE = 20;
const REJECT_REASON_OPTIONS: { value: ShortsRejectReason; label: string }[] = [
  { value: "POLICY_VIOLATION", label: "운영정책 위반" },
  { value: "COPYRIGHT", label: "저작권 침해 우려" },
  { value: "SPAM", label: "도배/광고성 콘텐츠" },
  { value: "LOW_QUALITY", label: "저화질/품질 미달" },
  { value: "ETC", label: "기타" },
];

export default function VideoReviewPage() {
  const [items, setItems] = useState<ShortsReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ShortsStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [reasonModalItem, setReasonModalItem] = useState<ShortsReviewItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<ShortsReviewItem | null>(null);
  const [rejectReason, setRejectReason] = useState<ShortsRejectReason>("POLICY_VIOLATION");
  const [videoModalItem, setVideoModalItem] = useState<ShortsReviewItem | null>(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoModalIndex = useMemo(() => {
    if (!videoModalItem) {
      return -1;
    }
    return items.findIndex((item) => item.shortsId === videoModalItem.shortsId);
  }, [items, videoModalItem]);

  useEffect(() => {
    void loadItems();
  }, [statusFilter, page]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReasonModalItem(null);
        setRejectModalItem(null);
        setVideoModalItem(null);
        return;
      }

      if (!videoModalItem) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveVideoModal("prev");
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveVideoModal("next");
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [videoModalItem, videoModalIndex, items]);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.playbackRate = videoPlaybackRate;
  }, [videoPlaybackRate, videoModalItem]);

  const openVideoModal = (item: ShortsReviewItem) => {
    setVideoPlaybackRate(1);
    setVideoModalItem(item);
  };

  const moveVideoModal = (direction: "prev" | "next") => {
    if (videoModalIndex < 0) {
      return;
    }

    const nextIndex = direction === "prev" ? videoModalIndex - 1 : videoModalIndex + 1;
    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    setVideoPlaybackRate(1);
    setVideoModalItem(items[nextIndex]);
  };

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

  const openRejectModal = (item: ShortsReviewItem) => {
    setRejectModalItem(item);
    setRejectReason("POLICY_VIOLATION");
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalItem) {
      return;
    }

    try {
      setWorkingId(rejectModalItem.shortsId);
      await updateShortsStatus(rejectModalItem.shortsId, "REJECT", rejectReason);
      setRejectModalItem(null);
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
          <div className="overflow-hidden rounded-md border border-gray-200">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[7%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">쇼츠ID</th>
                  <th className="w-[16%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                  <th className="w-[8%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">영상</th>
                  <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                  <th className="w-[9%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태 설명</th>
                  <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI 결과</th>
                  <th className="w-[8%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">검수사유</th>
                  <th className="w-[8%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">등록 시각</th>
                  <th className="w-[12%] px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-3 text-center text-sm text-gray-500">로딩 중...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-3 text-center text-sm text-gray-500">검수 대상이 없습니다.</td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const hasInspectionResult = Boolean(item.inspectionResult);

                    return (
                      <tr key={item.shortsId} className="hover:bg-gray-50 align-top">
                        <td className="px-3 py-3 text-sm text-gray-700">{item.shortsId}</td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900">
                          <p className="truncate" title={item.title}>{item.title}</p>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {item.videoUrl ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="whitespace-nowrap"
                              onClick={() => openVideoModal(item)}
                            >
                              영상 보기
                            </Button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">{item.authorName ?? "-"}</td>
                        <td className="px-3 py-3 text-sm">
                          <Badge variant={statusVariant(item.status)}>{statusLabel(item.status)}</Badge>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          <p className="break-words" title={item.shortsStatusDescription ?? "-"}>
                            {item.shortsStatusDescription ?? "-"}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {hasInspectionResult
                            ? `${item.inspectionResult?.category ?? "-"} (${((item.inspectionResult?.confidenceScore ?? 0) * 100).toFixed(1)}%)`
                            : "검수 대기"}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {hasInspectionResult ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="whitespace-nowrap"
                              onClick={() => setReasonModalItem(item)}
                            >
                              사유 보기
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">AI 검수 완료 후 확인 가능</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">{formatDate(item.createdAt)}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            <Button
                              size="sm"
                              className="min-w-[52px] whitespace-nowrap"
                              disabled={!hasInspectionResult || workingId === item.shortsId}
                              onClick={() => void handleStatusUpdate(item.shortsId, "PUBLISHED")}
                            >
                              게시
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="min-w-[52px] whitespace-nowrap"
                              disabled={!hasInspectionResult || workingId === item.shortsId}
                              onClick={() => openRejectModal(item)}
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

      {reasonModalItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setReasonModalItem(null)}
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">AI 검수</p>
                <h2 className="mt-1 text-lg font-semibold text-gray-900">검수 사유 상세</h2>
                <p className="mt-1 text-xs text-gray-500">쇼츠ID {reasonModalItem.shortsId}</p>
              </div>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setReasonModalItem(null)}
                aria-label="검수 사유 팝업 닫기"
              >
                닫기
              </button>
            </div>

            <div className="space-y-3 px-6 py-5">
              <p className="rounded-md bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">{reasonModalItem.title}</p>
              <p className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words rounded-md border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-6 text-gray-700">
                {reasonModalItem.inspectionResult?.reason ?? "검수 사유가 없습니다."}
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <Button variant="outline" onClick={() => setReasonModalItem(null)}>
                나가기
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {rejectModalItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setRejectModalItem(null)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">반려 사유 선택</h2>
              <p className="mt-1 text-sm text-gray-500">쇼츠ID {rejectModalItem.shortsId}</p>
            </div>
            <div className="space-y-2 px-6 py-4">
              {REJECT_REASON_OPTIONS.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shortsRejectReason"
                    value={option.value}
                    checked={rejectReason === option.value}
                    onChange={() => setRejectReason(option.value)}
                  />
                  <span className="text-sm text-gray-800">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <Button variant="outline" onClick={() => setRejectModalItem(null)} disabled={workingId === rejectModalItem.shortsId}>
                취소
              </Button>
              <Button onClick={() => void handleRejectConfirm()} disabled={workingId === rejectModalItem.shortsId}>
                {workingId === rejectModalItem.shortsId ? "처리 중..." : "반려 확정"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {videoModalItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/55 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setVideoModalItem(null)}
        >
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">영상 미리보기</p>
                <h2 className="mt-1 text-lg font-semibold text-gray-900">{videoModalItem.title}</h2>
                <p className="mt-1 text-xs text-gray-500">쇼츠ID {videoModalItem.shortsId}</p>
              </div>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setVideoModalItem(null)}
                aria-label="영상 미리보기 팝업 닫기"
              >
                닫기
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-black">
                <video
                  ref={videoRef}
                  key={videoModalItem.videoUrl}
                  className="max-h-[70vh] w-full"
                  controls
                  playsInline
                  src={videoModalItem.videoUrl ?? undefined}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">재생속도</span>
                  {[1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      className={
                        videoPlaybackRate === rate
                          ? "rounded-md border border-primary bg-primary px-2.5 py-1 text-xs font-semibold text-white"
                          : "rounded-md border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      }
                      onClick={() => setVideoPlaybackRate(rate)}
                    >
                      {rate.toFixed(2).replace(/\.00$/, "")}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={videoModalIndex <= 0} onClick={() => moveVideoModal("prev")}>
                    이전 영상
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={videoModalIndex < 0 || videoModalIndex >= items.length - 1}
                    onClick={() => moveVideoModal("next")}
                  >
                    다음 영상
                  </Button>
                </div>
              </div>

              {videoModalItem.videoUrl ? (
                <a
                  href={videoModalItem.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-medium text-primary hover:text-primary-dark"
                >
                  새 탭에서 원본 영상 열기
                </a>
              ) : null}
            </div>

            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
              <Button variant="outline" onClick={() => setVideoModalItem(null)}>
                나가기
              </Button>
            </div>
          </div>
        </div>
      ) : null}
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
