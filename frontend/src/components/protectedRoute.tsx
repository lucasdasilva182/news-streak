import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageLoadSpinner } from './pageLoadSpinner';

export function ProtectedRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoadSpinner />;
  }

  return isAuthenticated && user ? <Outlet /> : <Navigate to="/" />;
}
