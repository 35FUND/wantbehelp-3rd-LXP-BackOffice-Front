import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  ChevronRight,
  ChevronLeft,
  Tags,
  Clapperboard,
  MessageSquareWarning,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { to: "/", label: "대시보드", icon: LayoutDashboard },
  { to: "/users", label: "유저 관리", icon: Users },
  { to: "/contents", label: "카테고리/키워드", icon: Tags },
  { to: "/reviews", label: "영상 검수", icon: Clapperboard },
  { to: "/comment-reports", label: "댓글 신고", icon: MessageSquareWarning },
];

export default function MainLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-200",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center border-b border-gray-100",
            isSidebarCollapsed ? "px-3 justify-center" : "px-4 justify-between"
          )}
        >
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            {isSidebarCollapsed ? (
              "S"
            ) : (
              <>
                <span>Shortudy</span>
                <span className="text-primary font-normal text-sm ml-1">Admin</span>
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className={cn(
              "h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700",
              isSidebarCollapsed ? "absolute" : ""
            )}
            aria-label={isSidebarCollapsed ? "사이드바 펼치기" : "사이드바 축소"}
          >
            {isSidebarCollapsed ? <ChevronRight className="mx-auto h-4 w-4" /> : <ChevronLeft className="mx-auto h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {!isSidebarCollapsed ? (
            <div className="pt-2 pb-2">
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">운영 관리</p>
            </div>
          ) : (
            <div className="h-2" />
          )}

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={isSidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group",
                    isSidebarCollapsed ? "justify-center px-2 py-3" : "px-4 py-3",
                    isActive
                      ? "bg-primary-50 text-primary-dark font-semibold shadow-sm ring-1 ring-primary/10"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isSidebarCollapsed ? "mr-0" : "mr-3",
                        isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    {!isSidebarCollapsed ? <span className="whitespace-nowrap">{item.label}</span> : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div
            className={cn(
              "flex items-center rounded-lg hover:bg-gray-50 transition-colors cursor-pointer",
              isSidebarCollapsed ? "justify-center p-2" : "p-2"
            )}
            title={isSidebarCollapsed ? "관리자" : undefined}
          >
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300">
              <User className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed ? (
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-900">관리자</p>
                <p className="text-xs text-gray-500">admin@shortudy.com</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <Breadcrumbs />
          <div className="flex items-center space-x-4" />
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const pathMap: Record<string, string> = {
    users: "유저 관리",
    create: "등록",
    contents: "콘텐츠 관리",
    reviews: "영상 검수",
    "comment-reports": "댓글 신고",
  };

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div className="flex items-center">
            <span className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors cursor-pointer">홈</span>
          </div>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const label = pathMap[value] || value;

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-300 mx-1" aria-hidden="true" />
                <span className={cn("text-sm font-medium capitalize", isLast ? "text-gray-900 font-bold" : "text-gray-500 hover:text-gray-700")}>
                  {label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
