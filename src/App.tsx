import { Navigate, Route, Routes } from "react-router-dom";
import { useUser } from "./context/UserContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ErrorBoundary from "./components/ErrorBoundary";

// ─── Route Helpers ────────────────────────────────────────────────────────────

/** Sends unauthenticated users to /login. Admin users go to /admin-dashboard. Regular users pass through. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useUser();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.usn === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
  return <>{children}</>;
}

/** For pages only non-admins should access (dashboard, profile, leaderboard) */
function UserRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useUser();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.usn === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
  return <>{children}</>;
}

/** Admin-only route. Non-admins get redirected out. */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useUser();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.usn !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Redirects authenticated users to the right home: admin → /admin-dashboard, user → /dashboard */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useUser();
  if (!isAuthenticated) return <>{children}</>;
  if (user?.usn === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

/** Smart root redirect based on who's logged in */
function HomeRedirect() {
  const { isAuthenticated, user } = useUser();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.usn === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Smart root redirect */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Auth routes – only for guests */}
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Regular user routes */}
        <Route path="/dashboard"   element={<UserRoute><DashboardPage /></UserRoute>} />
        <Route path="/leaderboard" element={<UserRoute><LeaderboardPage /></UserRoute>} />
        <Route path="/profile"     element={<UserRoute><ProfilePage /></UserRoute>} />

        {/* Admin-only route */}
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
