import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import UserListPage from "./features/users/list/UserListPage";
import ContentManagementPage from "./features/contents/ContentManagementPage";
import VideoReviewPage from "./features/reviews/VideoReviewPage";
import CommentReportPage from "./features/comments/CommentReportPage";
import LoginPage from "./features/auth/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="contents" element={<ContentManagementPage />} />
          <Route path="reviews" element={<VideoReviewPage />} />
          <Route path="comment-reports" element={<CommentReportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
