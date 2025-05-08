// src/pages/login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/page-layout';
import LoginForm from '../components/auth/login-form';

const Login = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Проверяем, есть ли сообщение о успешной регистрации
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
        <div className="max-w-md mx-auto bg-card shadow-md rounded-2xl border border-border  p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold  font-bold mb-6 text-center">Вход в систему</h1>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Нет аккаунта? <Link to="/register" className="text-primary hover:underline">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;