// src/pages/register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/page-layout';
import { useAuth } from '../hooks/use-auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1 - запрос кода, 2 - верификация
  const [formError, setFormError] = useState('');
  
  const { registerRequestCode, registerVerify, loading, error, user } = useAuth();
  const navigate = useNavigate();

  // Редирект авторизованных пользователей
  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate('/account');
    }
  }, [user, navigate]);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }
    
    setFormError('');
    const success = await registerRequestCode(email, password);
    if (success) {
      setStep(2);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    // Передаем только email и код
    await registerVerify(email, verificationCode);
  };

  // Показываем загрузку, если проверяется авторизация
  if (loading && user === null) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4"></div>
            <p>Проверка авторизации...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
        <div className="max-w-md mx-auto bg-card shadow-md rounded-2xl border border-border  p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold  font-bold mb-6 text-center">
            {step === 1 ? 'Регистрация' : 'Подтверждение email'}
          </h1>
          
          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error || formError}
            </div>
          )}
          
          {step === 1 ? (
            <form className="space-y-4" onSubmit={handleRequestCode}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Пароль</label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Подтверждение пароля</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                disabled={loading}
              >
                {loading ? 'Загрузка...' : 'Запросить код подтверждения'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleVerify}>
              <p className="text-sm text-muted-foreground mb-4">
                Мы отправили код подтверждения на вашу почту {email}. Пожалуйста, введите код ниже для завершения регистрации.
              </p>
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium mb-1">Код подтверждения</label>
                <input
                  id="verificationCode"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg hover:shadow-md transition-all duration-200  rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                disabled={loading}
              >
                {loading ? 'Загрузка...' : 'Завершить регистрацию'}
              </button>
              <button
                type="button"
                className="w-full bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/90 transition-colors mt-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
                onClick={() => setStep(1)}
              >
                Назад
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт? <Link to="/login" className="text-primary hover:underline">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;