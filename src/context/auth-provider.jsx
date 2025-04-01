// src/context/auth-provider.jsx
import { createContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

// Константы для состояний авторизации
const AUTH_UNKNOWN = 'unknown';
const AUTH_AUTHENTICATED = 'authenticated';
const AUTH_UNAUTHENTICATED = 'unauthenticated';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshIntervalRef = useRef(null);
  const authCheckInProgressRef = useRef(false);
  const navigate = useNavigate();

  const setupTokenRefresh = () => {
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);

    refreshIntervalRef.current = setInterval(async () => {
      // Проверяем локальное состояние авторизации перед отправкой запроса
      const authStatus = localStorage.getItem('auth_status');
      if (authStatus !== AUTH_AUTHENTICATED) {
        console.log('Пропускаем обновление токена: пользователь не авторизован локально');
        return;
      }
      
      try {
        const success = await authAPI.refresh();
        if (!success) logout();
      } catch (err) {
        console.error('Ошибка при обновлении токена:', err);
        logout();
      }
    }, 55 * 60 * 1000);
  };

  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, []);

  // Функция для загрузки данных пользователя
  const loadUserData = async () => {
    try {
      const response = await api.get('/account/info');
      if (response.ok) {
        const userData = response.data;
        console.log('Загружены данные пользователя:', userData);

        setUser({
          isAuthenticated: true,
          email: userData.email,
          id: userData.id,
          requestsThisMonth: userData.requests_this_month,
          requestLimit: userData.request_limit,
          limitResetDate: userData.limit_reset_date,
          accountData: userData
        });

        localStorage.setItem('auth_status', AUTH_AUTHENTICATED);
        localStorage.setItem('userEmail', userData.email);
        setupTokenRefresh();
        return true;
      } else {
        console.error('Не удалось загрузить данные пользователя:', response.status);
        // Мы все равно считаем пользователя авторизованным, даже если не смогли загрузить данные
        const email = localStorage.getItem('userEmail') || '';
        setUser({ 
          isAuthenticated: true, 
          email: email,
          accountData: null 
        });
        
        if (email) {
          localStorage.setItem('auth_status', AUTH_AUTHENTICATED);
        }
        
        setupTokenRefresh();
        return true;
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      // Мы все равно считаем пользователя авторизованным если есть email
      const email = localStorage.getItem('userEmail') || '';
      if (email) {
        setUser({ 
          isAuthenticated: true, 
          email: email,
          accountData: null 
        });
        localStorage.setItem('auth_status', AUTH_AUTHENTICATED);
        setupTokenRefresh();
      }
      return !!email;
    }
  };
  
  // Функция для обработки неавторизованного состояния
  const handleUnauthenticated = () => {
    setUser(null);
    localStorage.setItem('auth_status', AUTH_UNAUTHENTICATED);
    localStorage.removeItem('userEmail');
    
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckInProgressRef.current) return;
    
      authCheckInProgressRef.current = true;
      setLoading(true);
    
      try {
        // Проверяем сохраненные в localStorage данные
        const authStatus = localStorage.getItem('auth_status') || AUTH_UNKNOWN;
        const userEmail = localStorage.getItem('userEmail');
    
        console.log('Начало проверки авторизации, текущий статус:', authStatus);
  
        // Если уже определено что пользователь не авторизован, просто устанавливаем это состояние
        if (authStatus === AUTH_UNAUTHENTICATED) {
          setUser(null);
          setLoading(false);
          authCheckInProgressRef.current = false;
          return;
        }
    
        // Если в localStorage есть данные об авторизованном пользователе,
        // временно восстанавливаем состояние
        if (authStatus === AUTH_AUTHENTICATED && userEmail) {
          setUser({
            isAuthenticated: true,
            email: userEmail,
            accountData: null
          });
          
          // Проверяем авторизацию на сервере только для пользователей в состоянии "авторизован"
          try {
            const isAuthenticated = await authAPI.checkAuth();
        
            if (isAuthenticated) {
              console.log('Токен действителен, загружаем данные пользователя');
              await loadUserData();
            } else {
              console.log('Токен истек, пробуем обновить');
              const refreshed = await authAPI.refresh();
        
              if (refreshed) {
                console.log('Токен успешно обновлен, загружаем данные пользователя');
                await loadUserData();
              } else {
                handleUnauthenticated();
              }
            }
          } catch (err) {
            console.error('Ошибка при проверке авторизации:', err);
            
            // При сетевой ошибке сохраняем предыдущее состояние
            console.log('Сохраняем предыдущее состояние авторизации из-за ошибки сети');
          }
        } else {
          // Если статус неизвестен или нет email, считаем пользователя неавторизованным
          handleUnauthenticated();
        }
      } finally {
        setLoading(false);
        authCheckInProgressRef.current = false;
      }
    };
  
    // Инициируем проверку при монтировании компонента
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Защита от бесконечного состояния загрузки
    const loginTimeout = setTimeout(() => {
      setLoading(false);
      console.log('Принудительный сброс состояния загрузки по таймауту');
    }, 15000); // 15 секунд максимум
    
    try {
      setLoading(true);
      setError(null);
      
      // Выполняем запрос на вход
      await authAPI.login(email, password);
      
      // Устанавливаем состояние пользователя
      setUser({ 
        isAuthenticated: true,
        email: email
      });
      
      localStorage.setItem('auth_status', AUTH_AUTHENTICATED);
      localStorage.setItem('userEmail', email);
      
      setupTokenRefresh();
      
      // Перенаправляем на страницу аккаунта
      navigate('/account');
      return true;
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(err.message || 'Ошибка при входе');
      return false;
    } finally {
      clearTimeout(loginTimeout); // Очищаем таймаут
      setLoading(false); // Гарантируем сброс состояния загрузки
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Сбрасываем состояние авторизации локально перед запросом
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      
      setUser(null);
      localStorage.setItem('auth_status', AUTH_UNAUTHENTICATED);
      localStorage.removeItem('userEmail');
      
      // Выполняем запрос на выход
      await authAPI.logout();
      
      navigate('/login');
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerRequestCode = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.registerRequestCode(email, password); // Добавляем параметр password
      return true;
    } catch (err) {
      setError(err.message || 'Ошибка запроса кода');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const registerVerify = async (email, code) => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.registerVerify(email, code);
      
      // Вместо автоматического входа просто перенаправляем на страницу логина
      navigate('/login', { 
        state: { 
          message: "Регистрация успешно завершена. Пожалуйста, войдите в систему." 
        } 
      });
      return true;
    } catch (err) {
      setError(err.message || 'Ошибка подтверждения регистрации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        registerRequestCode,
        registerVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};