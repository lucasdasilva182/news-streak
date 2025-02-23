import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/login';
import { ProtectedRoute } from '../components/protectedRoute';
import Streaks from '../pages/streaks';
import { AdminRoute } from '../components/protectedAdminRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Área protegida */}
      <Route element={<ProtectedRoute />}>
        <Route path="/streaks" element={<Streaks />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Streaks />} />
        </Route>
      </Route>
    </Routes>
  );
}
