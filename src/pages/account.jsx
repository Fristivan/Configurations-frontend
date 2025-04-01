import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';
import { useAuth } from '../hooks/use-auth';
import RequestCache from '../lib/request-cache';

const Account = () => {
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading } = useAuth();

    // В account.jsx
    // В файле account.jsx в useEffect для загрузки данных
    useEffect(() => {
      if (loading) return;

      // Очищаем предыдущие данные при изменении состояния авторизации
      if (!user?.isAuthenticated) {
        setAccountData(null);
        setIsLoading(false);
        return;
      }

      // Проверяем, есть ли полные данные в контексте пользователя
      if (user.accountData && user.accountData.id && !isLoading) {
        console.log('Используем данные аккаунта из контекста:', user.accountData);
        setAccountData({
          id: user.accountData.id || 0,
          email: user.accountData.email || user.email || 'Нет данных',
          subscription_level: user.accountData.subscription_level || 'basic',
          subscription_expiry: user.accountData.subscription_expiry || null,
          last_password_change: user.accountData.last_password_change || null,
          request_limit: parseInt(user.accountData.request_limit) || 0,
          requests_this_month: parseInt(user.accountData.requests_this_month) || 0,
          limit_reset_date: user.accountData.limit_reset_date || null
        });
        setIsLoading(false);
        return;
      }

      // Запрашиваем данные
      const fetchAccountData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          console.log('Запрос данных аккаунта...');
          const response = await api.get('/account/info');
          
          if (!response.ok) {
            throw new Error(`Ошибка получения данных: ${response.status}`);
          }
          
          const data = response.data;
          console.log('Данные аккаунта получены:', data);
          
          // Убедимся, что числовые поля - числа
          setAccountData({
            id: data.id || 0,
            email: data.email || user?.email || 'Нет данных',
            subscription_level: data.subscription_level || 'basic',
            subscription_expiry: data.subscription_expiry || null,
            last_password_change: data.last_password_change || null,
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
  

  // Функция для форматирования даты
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
      console.error('Ошибка форматирования даты:', e);
      return dateString;
    }
  };
  
  // Функция для отображения дат в формате "осталось дней"
  const getRemainingDays = (dateString) => {
    if (!dateString) return 'Не указано';
    
    try {
      const targetDate = new Date(dateString);
      const today = new Date();
      
      // Вычисляем разницу в днях
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Срок истек';
      if (diffDays === 0) return 'Сегодня';
      if (diffDays === 1) return 'Завтра';
      
      return `${diffDays} ${getDayWord(diffDays)}`;
    } catch (e) {
      console.error('Ошибка расчета оставшихся дней:', e);
      return 'Не удалось рассчитать';
    }
  };
  
  // Функция для правильного склонения слова "день"
  const getDayWord = (days) => {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
    return 'дней';
  };

  // Функция для перезагрузки данных
  const handleRefresh = () => {
    // Очищаем кэш для URL аккаунта
    RequestCache.clear(`${api.API_URL}/account/info`);
    
    setError(null);
    setIsLoading(true);
    
    // Запускаем запрос заново
    api.getAccountInfo()
      .then(data => {
        setAccountData({
          id: data.id || 0,
          email: data.email || user?.email || 'Нет данных',
          subscription_level: data.subscription_level || 'basic',
          subscription_expiry: data.subscription_expiry || null,
          last_password_change: data.last_password_change || null,
          request_limit: data.request_limit || 0,
          requests_this_month: data.requests_this_month || 0,
          limit_reset_date: data.limit_reset_date || null
        });
      })
      .catch(error => {
        console.error('Ошибка при обновлении данных:', error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Показываем загрузку, если проверяется авторизация
  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Проверка авторизации...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Информация об аккаунте</h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Загрузка информации...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
            <button 
              className="mt-2 text-sm underline hover:no-underline" 
              onClick={handleRefresh}
            >
              Повторить загрузку
            </button>
          </div>
        ) : accountData ? (
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Основная информация</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{accountData.email}</p>
                  </div>
                  
                  {accountData.subscription_level && (
                    <div>
                      <p className="text-sm text-muted-foreground">Уровень подписки</p>
                      <div className="flex items-center">
                        <span className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${
                          accountData.subscription_level === 'premium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : accountData.subscription_level === 'professional' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {accountData.subscription_level === 'premium' 
                            ? 'Премиум' 
                            : accountData.subscription_level === 'professional' 
                              ? 'Профессиональный' 
                              : 'Базовый'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {accountData.subscription_expiry && (
                    <div>
                      <p className="text-sm text-muted-foreground">Срок действия подписки</p>
                      <p className="font-medium">{formatDate(accountData.subscription_expiry)} 
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Осталось: {getRemainingDays(accountData.subscription_expiry)})
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Последнее изменение пароля</p>
                    <p className="font-medium">
                      {accountData.last_password_change 
                        ? formatDate(accountData.last_password_change) 
                        : 'Нет данных'}
                    </p>
                    <Link 
                      to="/forgot-password" 
                      className="text-primary text-sm hover:underline mt-1 inline-block"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Использование API</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Лимит запросов</p>
                    <p className="font-medium">{accountData.request_limit} запросов / месяц</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Использовано в этом месяце</p>
                    <div className="mt-1">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (accountData.requests_this_month / accountData.request_limit) > 0.9 
                              ? 'bg-red-500' 
                              : (accountData.requests_this_month / accountData.request_limit) > 0.7 
                                ? 'bg-yellow-500' 
                                : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(100, (accountData.requests_this_month / accountData.request_limit) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1">
                        {accountData.requests_this_month} из {accountData.request_limit} 
                        ({Math.round((accountData.requests_this_month / accountData.request_limit) * 100)}%)
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Сброс лимитов</p>
                    <p className="font-medium">
                      {formatDate(accountData.limit_reset_date)} 
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Через: {getRemainingDays(accountData.limit_reset_date)})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <h2 className="text-xl font-semibold mb-4">Управление подпиской</h2>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm">
                  Изменить тариф
                </button>
                <button className="border border-input bg-background px-4 py-2 rounded-md hover:bg-accent transition-colors text-sm">
                  История платежей
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Нет данных для отображения</p>
        )}
      </div>
    </PageLayout>
  );
};

export default Account;