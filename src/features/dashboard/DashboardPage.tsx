import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Users, Upload, CheckCircle, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  getDailyUploadCounts,
  getPublishConversionRate,
  getUserStats,
  getCategoryShortsCount
} from "../../domain/dashboard/api/dashboardApi";
import type {
  DailyUploadCount,
  PublishConversionRate,
  UserStatsResponse,
  CategoryShortsCountResponse
} from "../../domain/dashboard/model/dashboardTypes";

const DEFAULT_DAYS = 30;

type MetricType = 'users' | 'uploads' | 'conversion' | 'categories';

export default function DashboardPage() {
  const [dailyUploads, setDailyUploads] = useState<DailyUploadCount[]>([]);
  const [conversionRate, setConversionRate] = useState<PublishConversionRate | null>(null);
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryShortsCountResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('uploads');

  useEffect(() => {
    const loadDashboardMetrics = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [uploadData, conversionData, userData, categoryData] = await Promise.all([
          getDailyUploadCounts(DEFAULT_DAYS),
          getPublishConversionRate(DEFAULT_DAYS),
          getUserStats(DEFAULT_DAYS),
          getCategoryShortsCount()
        ]);

        setDailyUploads(uploadData);
        setConversionRate(conversionData);
        setUserStats(userData);
        setCategoryStats(categoryData);
      } catch {
        setErrorMessage("대시보드 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboardMetrics();
  }, []);

  const latestUploadCount = dailyUploads.at(-1)?.uploadCount ?? 0;
  const totalUsers = userStats?.totalUsers ?? 0;
  const newUsers = userStats?.newUsersInRange ?? 0;

  // Chart Data Preparation
  const uploadChartData = useMemo(
    () => dailyUploads.map((item) => ({
      name: formatDateLabel(item.date),
      value: item.uploadCount,
    })),
    [dailyUploads]
  );

  const userChartData = useMemo(
    () => userStats?.daily.map((item) => ({
      name: formatDateLabel(item.date),
      value: item.count,
    })) ?? [],
    [userStats]
  );

  const categoryChartData = useMemo(
    () => categoryStats.map((item) => ({
      name: item.categoryName,
      value: item.shortsCount,
    })),
    [categoryStats]
  );

  // Determine current chart data and config based on selection
  const currentChart = useMemo(() => {
    switch (selectedMetric) {
      case 'users':
        return { 
          title: "일일 신규 가입자 추이", 
          data: userChartData, 
          color: "#8B5CF6", // Purple
          type: 'area' 
        };
      case 'uploads':
        return { 
          title: "일일 업로드 추이", 
          data: uploadChartData, 
          color: "#0F766E", // Teal
          type: 'area' 
        };
      case 'conversion':
        // For conversion, maybe show uploads vs published? Or just uploads for now.
        // Let's reuse uploads but maybe different color or overlay?
        // Simpler to just show uploads context for now as conversion is a rate.
        return { 
          title: "일일 업로드 추이 (게시 전환율 Context)", 
          data: uploadChartData, 
          color: "#F59E0B", // Amber
          type: 'area' 
        };
      case 'categories':
        return { 
          title: "카테고리별 쇼츠 분포", 
          data: categoryChartData, 
          color: "#3B82F6", // Blue
          type: 'bar' 
        };
      default:
        return { title: "", data: [], color: "", type: 'area' };
    }
  }, [selectedMetric, userChartData, uploadChartData, categoryChartData]);

  const stats = [
    {
      id: 'users',
      name: "전체 가입자 수",
      value: `${totalUsers.toLocaleString()}명`,
      change: `+${newUsers.toLocaleString()}명 (${DEFAULT_DAYS}일)`,
      trend: "up",
      icon: Users,
      description: "신규 가입자 추이",
    },
    {
      id: 'uploads',
      name: "일일 업로드 수",
      value: `${latestUploadCount.toLocaleString()}건`,
      change: `${DEFAULT_DAYS}일 기준`,
      trend: "up",
      icon: Upload,
      description: "PUBLISHED 업로드 집계",
    },
    {
      id: 'conversion',
      name: "게시(Published) 전환율",
      value: `${(conversionRate?.conversionRate ?? 0).toFixed(2)}%`,
      change: `${(conversionRate?.publishedCount ?? 0).toLocaleString()} / ${(conversionRate?.totalCount ?? 0).toLocaleString()}건`,
      trend: "neutral",
      icon: CheckCircle,
      description: "작성 대비 게시 비율",
    },
    {
      id: 'categories',
      name: "활성 카테고리",
      value: `${categoryStats.length}개`,
      change: "전체 분포",
      trend: "neutral",
      icon: BarChart3,
      description: "카테고리별 콘텐츠 분포",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-gray-900">대시보드</h1>
        <p className="text-body-reg text-gray-500 mt-2">서비스의 핵심 지표를 한눈에 확인하세요.</p>
      </div>

      {errorMessage ? (
        <Card>
          <CardContent className="py-6 text-sm text-error">{errorMessage}</CardContent>
        </Card>
      ) : null}

      {/* 상단 주요 지표 카드 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card 
            key={item.name} 
            className={`overflow-hidden hover:shadow-md transition-all cursor-pointer ${selectedMetric === item.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            onClick={() => setSelectedMetric(item.id as MetricType)}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg bg-primary/10 text-primary`}>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${
                  item.trend === 'up' ? 'text-success' : 
                  item.trend === 'down' ? 'text-error' : 'text-gray-500'
                }`}>
                  {isLoading ? "로딩 중..." : item.change}
                </span>
                <span className="text-gray-500 ml-2">{item.description}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area - Dynamic based on selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{currentChart.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {currentChart.type === 'area' ? (
                  <AreaChart
                    data={currentChart.data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentChart.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={currentChart.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={currentChart.color} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorGradient)" 
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={currentChart.data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill={currentChart.color} radius={[4, 4, 0, 0]}>
                      {currentChart.data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={currentChart.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Stats (Always Visible for quick reference) */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 콘텐츠 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2 max-h-[320px] overflow-y-auto">
              {categoryStats.length > 0 ? categoryStats.map((cat) => {
                const total = categoryStats.reduce((acc, curr) => acc + curr.shortsCount, 0);
                const percent = total > 0 ? Math.round((cat.shortsCount / total) * 100) : 0;
                
                return (
                  <div key={cat.categoryId}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{cat.categoryName}</span>
                      <span className="text-gray-500 text-xs font-semibold">{cat.shortsCount}건 ({percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${percent}%`, opacity: percent > 20 ? 1 : 0.7 }}
                      ></div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center text-gray-500 py-10">데이터가 없습니다.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatDateLabel(rawDate: string): string {
  const [year, month, day] = rawDate.split("-");
  if (!year || !month || !day) {
    return rawDate;
  }

  return `${Number(month)}/${Number(day)}`;
}

