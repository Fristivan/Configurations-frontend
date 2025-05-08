// src/pages/Account.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';
import { useAuth } from '../hooks/use-auth';
import RequestCache from '../lib/request-cache';
import { authAPI } from '../lib/api';

const Account = () => {
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user?.isAuthenticated) {
      setAccountData(null);
      setIsLoading(false);
      return;
    }

    if (user.accountData && user.accountData.id && !isLoading) {
      setAccountData({
        id: user.accountData.id || 0,
        email: user.accountData.email || user.email || 'Нет данных',
        subscription_level: user.accountData.subscription_level || 'basic',
        subscription_expiry: user.accountData.subscription_expiry || null,
        request_limit: parseInt(user.accountData.request_limit) || 0,
        requests_this_month: parseInt(user.accountData.requests_this_month) || 0,
        limit_reset_date: user.accountData.limit_reset_date || null
      });
      setIsLoading(false);
      return;
    }

    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/account/info');

        if (!response.ok) {
          throw new Error(`Ошибка получения данных: ${response.status}`);
        }

        const data = response.data;

        setAccountData({
          id: data.id || 0,
          email: data.email || user?.email || 'Нет данных',
          subscription_level: data.subscription_level || 'basic',
          subscription_expiry: data.subscription_expiry || null,
          request_limit: parseInt(data.request_limit) || 15,
          requests_this_month: parseInt(data.requests_this_month) || 0,
          limit_reset_date: data.limit_reset_date || null
        });
      } catch (error) {
        console.error('Ошибка при загрузке данных аккаунта:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [user, loading]);

  const handlePasswordReset = async () => {
    try {
      await authAPI.logout();
      navigate('/forgot-password');
    } catch (e) {
      console.error('Ошибка при выходе из аккаунта:', e);
    }
  };

  const handleSubscribe = () => {
    if (
      accountData?.subscription_level &&
      accountData.subscription_level !== 'basic' &&
      accountData.subscription_expiry &&
      new Date(accountData.subscription_expiry) > new Date()
    ) {
      setShowConfirmModal(true);
      return;
    }
    navigate('/subscribe');
  };

  const handleHistory = () => {
    navigate('/payments');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getRemainingDays = (dateString) => {
    if (!dateString) return 'Не указано';
    try {
      const targetDate = new Date(dateString);
      const today = new Date();
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return 'Срок истек';
      if (diffDays === 0) return 'Сегодня';
      if (diffDays === 1) return 'Завтра';
      return `${diffDays} ${getDayWord(diffDays)}`;
    } catch (e) {
      return 'Не удалось рассчитать';
    }
  };

  const getDayWord = (days) => {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
    return 'дней';
  };

  // Функция для определения цвета прогресс-бара в зависимости от процента использования
  const getProgressBarColor = (percent) => {
    if (percent <= 30) return 'bg-green-500';
    if (percent <= 70) return 'bg-blue-500';
    if (percent <= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSubscriptionBadgeStyle = (level) => {
    switch (level) {
      case 'premium':
        return 'bg-amber-200 text-amber-900 border border-amber-300';
      case 'professional':
        return 'bg-purple-200 text-purple-900 border border-purple-300';
      default:
        return 'bg-blue-200 text-blue-900 border border-blue-300';
    }
  };

  const getSubscriptionName = (level) => {
    switch (level) {
      case 'premium':
        return 'Премиум';
      case 'professional':
        return 'Профессиональный';
      default:
        return 'Базовый';
    }
  };

  const handleRefresh = () => {
    RequestCache.clear(`${api.API_URL}/account/info`);
    setError(null);
    setIsLoading(true);

    api.getAccountInfo()
      .then(data => {
        setAccountData({
          id: data.id || 0,
          email: data.email || user?.email || 'Нет данных',
          subscription_level: data.subscription_level || 'basic',
          subscription_expiry: data.subscription_expiry || null,
          request_limit: data.request_limit || 0,
          requests_this_month: data.requests_this_month || 0,
          limit_reset_date: data.limit_reset_date || null
        });
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 lg:px-8 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Проверка авторизации...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">Информация об аккаунте</h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Загрузка информации...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
            <p>{error}</p>
            <button
              className="mt-4 text-sm px-5 py-2 rounded-lg bg-primary/90 text-white hover:bg-primary/70 font-semibold shadow-md transition-all"
              onClick={handleRefresh}
            >
              Повторить загрузку
            </button>
          </div>
        ) : accountData ? (
          <div className="bg-card shadow-md rounded-2xl border border-border p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background/50 p-5 rounded-xl border border-border/50 shadow-sm">
                <h2 className="text-2xl font-semibold mb-5">Основная информация</h2>
                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold">{accountData.email}</p>
                  </div>

                  {accountData.subscription_level && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Уровень подписки</p>
                      <div className="flex items-center">
                        <span className={`inline-block py-1.5 px-4 rounded-full text-xs font-semibold ${
                          getSubscriptionBadgeStyle(accountData.subscription_level)
                        }`}>
                          {getSubscriptionName(accountData.subscription_level)}
                        </span>
                      </div>
                    </div>
                  )}

                  {accountData.subscription_expiry && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Срок действия подписки</p>
                      <p className="font-semibold">
                        {formatDate(accountData.subscription_expiry)}
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Осталось: {getRemainingDays(accountData.subscription_expiry)})
                        </span>
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Пароль</p>
                    <button
                      onClick={handlePasswordReset}
                      className="mt-1 px-5 py-2 rounded-lg bg-primary/90 text-white hover:bg-primary/70 transition-all shadow-md font-semibold"
                    >
                      Сменить пароль
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 p-5 rounded-xl border border-border/50 shadow-sm">
                <h2 className="text-2xl font-semibold mb-5">Использование API</h2>
                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Лимит запросов</p>
                    <p className="font-semibold">{accountData.request_limit} запросов / месяц</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Использовано в этом месяце</p>
                    <div className="mt-1">
                      {/* Улучшенный прогресс-бар с динамическим изменением цвета */}
                      <div className="w-full bg-muted rounded-full h-3 shadow-inner">
                        {(() => {
                          const percent = Math.min(100, (accountData.requests_this_month / accountData.request_limit) * 100);
                          return (
                            <div
                              className={`h-3 rounded-full ${getProgressBarColor(percent)} transition-all duration-300`}
                              style={{
                                width: `${percent}%`
                              }}
                            ></div>
                          );
                        })()}
                      </div>
                      <p className="text-sm mt-2">
                        {accountData.requests_this_month} из {accountData.request_limit}
                        <span className="ml-2 font-semibold">
                          ({Math.round((accountData.requests_this_month / accountData.request_limit) * 100)}%)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Сброс лимитов</p>
                    <p className="font-semibold">
                      {formatDate(accountData.limit_reset_date)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Через: {getRemainingDays(accountData.limit_reset_date)})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-4">
              <button
                onClick={handleSubscribe}
                className="bg-primary/90 text-white px-6 py-2.5 rounded-lg hover:bg-primary/70 transition-all text-sm font-semibold shadow-md"
              >
                Сменить тариф
              </button>
              <button
                onClick={handleHistory}
                className="border border-primary bg-primary/15 text-primary px-6 py-2.5 rounded-lg hover:bg-primary/25 transition-all text-sm font-semibold shadow-sm"
              >
                История платежей
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card shadow-md rounded-2xl border border-border p-6">
            <p className="text-center py-4 text-muted-foreground">Нет данных для отображения</p>
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card rounded-2xl shadow-lg p-6 max-w-md w-full border border-border animate-in fade-in duration-200">
            <h2 className="text-xl font-semibold mb-3">Подписка уже активна</h2>
            <p className="text-sm text-muted-foreground mb-5">
              У вас уже есть активная подписка. Оформление новой не продлевает текущую — прежняя будет заменена.
              Хотите продолжить?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 text-sm border border-input rounded-lg hover:bg-accent/50 transition-colors font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  navigate('/subscribe');
                }}
                className="px-5 py-2 text-sm bg-primary/90 text-white rounded-lg hover:bg-primary/70 transition-colors font-semibold shadow-md"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Account;