import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageLoadSpinner } from './pageLoadSpinner';

export function AdminRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoadSpinner />;
  }

  return isAuthenticated && user && user.is_admin === 1 ? <Outlet /> : <Navigate to="/streaks" />;
}
