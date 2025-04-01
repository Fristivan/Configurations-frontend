// src/components/auth/protected-route.jsx
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // Если загрузка завершена, проверяем авторизацию
    if (!loading) {
      setIsAuthorized(!!user?.isAuthenticated);
    }
  }, [user, loading]);

  // Пока проверяем - показываем загрузку
  if (loading || isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
        <span className="ml-2">Проверка авторизации...</span>
      </div>
    );
  }

  // Если не авторизован - редирект
  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;