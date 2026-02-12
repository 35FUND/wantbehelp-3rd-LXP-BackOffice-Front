import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, User, ChevronRight, Tags, Clapperboard, MessageSquareWarning } from "lucide-react";
import { cn } from "../lib/utils";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Clean White & Dark Gray Text */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">Shortudy <span className="text-primary font-normal text-sm ml-1">Admin</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-dark font-semibold shadow-sm ring-1 ring-primary/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard 
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                  )} 
                />
                대시보드
              </>
            )}
          </NavLink>
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              운영 관리
            </p>
          </div>
          
          <NavLink
            to="/users"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-dark font-semibold shadow-sm ring-1 ring-primary/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Users 
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                  )} 
                />
                유저 관리
              </>
            )}
          </NavLink>

          <NavLink
            to="/contents"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-dark font-semibold shadow-sm ring-1 ring-primary/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Tags 
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                  )} 
                />
                카테고리/키워드
              </>
            )}
          </NavLink>

          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-dark font-semibold shadow-sm ring-1 ring-primary/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Clapperboard 
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                  )} 
                />
                영상 검수
              </>
            )}
          </NavLink>

          <NavLink
            to="/comment-reports"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-dark font-semibold shadow-sm ring-1 ring-primary/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <MessageSquareWarning
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                댓글 신고
              </>
            )}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-900">관리자</p>
              <p className="text-xs text-gray-500">admin@shortudy.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header - Minimalist */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <Breadcrumbs />
          <div className="flex items-center space-x-4">
            {/* Add header actions here if needed */}
          </div>
        </header>

        {/* Page Content */}
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
    "users": "유저 관리",
    "create": "등록",
    "contents": "콘텐츠 관리",
    "reviews": "영상 검수",
    "comment-reports": "댓글 신고"
  };

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div className="flex items-center">
            <span className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors cursor-pointer">
              홈
            </span>
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
                <span
                  className={cn(
                    "text-sm font-medium capitalize",
                    isLast ? "text-gray-900 font-bold" : "text-gray-500 hover:text-gray-700"
                  )}
                >
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
