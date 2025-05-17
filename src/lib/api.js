// src/lib/api.js
import RequestCache from './request-cache';

const API_URL = 'https://api-configen.frist-it.online/api';

// Флаги для отслеживания запросов в процессе
let isCheckingAuthInProgress = false;
let isRefreshingInProgress = false;

// Безопасный парсинг JSON
const safeParseJSON = async (response) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('Ошибка при парсинге JSON:', error);
    return { error: 'Ошибка при обработке ответа сервера' };
  }
};

// Функция для авторизованных запросов (без прямого доступа к токену)
const authorizedFetch = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...(options.headers || {})
    },
    credentials: 'include' // Автоматически отправляет куки с запросом
  };
  
  try {
    let response = await fetch(url, config);
    
    // Если 401 (Unauthorized), пробуем обновить токен и повторить запрос
    if (response.status === 401) {
      try {
        const refreshed = await authAPI.refresh();
        if (refreshed) {
          // Повторяем оригинальный запрос
          response = await fetch(url, config);
        }
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    // Возвращаем объект, имитирующий неуспешный ответ
    return { 
      ok: false, 
      status: 0,
      text: async () => '',
      json: async () => ({ error: 'Ошибка сети' })
    };
  }
};

export const authAPI = {
  login: async (email, password) => {
    const url = `${API_URL}/auth/login`;
    
    return RequestCache.execute(url, async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include', // Для сохранения куков
        });
        
        if (!response.ok) {
          const errorData = await safeParseJSON(response);
          throw new Error(errorData.detail || `Ошибка авторизации (${response.status})`);
        }
        
        return safeParseJSON(response);
      } catch (error) {
        console.error('Ошибка в login API:', error);
        throw error; // Перебрасываем ошибку для обработки в компоненте
      }
    });
  },
  
  refresh: async () => {
    const url = `${API_URL}/auth/refresh`;
    
    return RequestCache.execute(url, async () => {
      if (isRefreshingInProgress) {
        console.log('Обновление токена уже выполняется');
        return false;
      }
      
      isRefreshingInProgress = true;
      
      try {
        console.log('Выполняем запрос на обновление токена');
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const result = response.status === 200;
        console.log('Результат обновления токена:', result);
        
        if (result) {
          // При успешном обновлении сбрасываем статус авторизации, чтобы 
          // вызвать повторную проверку
          localStorage.setItem('auth_status', 'authenticated');
        }
        
        return result;
      } catch (error) {
        console.error('Ошибка обновления токена:', error);
        return false;
      } finally {
        // Сбрасываем флаг с небольшой задержкой
        setTimeout(() => {
          isRefreshingInProgress = false;
        }, 500);
      }
    }, { cacheTTL: 5000 }); // Короткое время кэширования для refresh
  },
  
  registerRequestCode: async (email, password) => {
    const url = `${API_URL}/register/request-code`;
    
    return RequestCache.execute(url, async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.detail || 'Ошибка запроса кода подтверждения');
      }
      
      return safeParseJSON(response);
    });
  },
  
  registerVerify: async (email, code) => {
    const url = `${API_URL}/register/verify`;
    
    return RequestCache.execute(url, async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.detail || 'Ошибка подтверждения регистрации');
      }
      
      return safeParseJSON(response);
    });
  },
  
  logout: async () => {
    const url = `${API_URL}/auth/logout`;
    
    return RequestCache.execute(url, async () => {
      try {
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
        });
        
        // Очищаем кэш всех запросов после выхода
        RequestCache.clear();
        return true;
      } catch (error) {
        console.error('Ошибка при выходе:', error);
        return false;
      }
    });
  },
  
    // В api.js, метод checkAuth:
  checkAuth: async () => {
    const cacheBuster = new Date().getTime();
    const url = `${API_URL}/auth/verify?_=${cacheBuster}`;
    
    return RequestCache.execute(url, async () => {
      // Проверяем кэшированное состояние авторизации
      const authStatus = localStorage.getItem('auth_status');
      if (authStatus === 'unauthenticated') {
        console.log('Используем кэшированный статус: не авторизован');
        return false;
      }
      
      try {
        console.log('Выполняем запрос на проверку авторизации');
        
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Accept': '*/*',  // Принимаем любой тип ответа
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        // НЕ ЧИТАЕМ ТЕЛО ОТВЕТА для проверки авторизации, только проверяем статус
        const isAuth = response.status === 200;
        console.log('Результат проверки авторизации:', isAuth);
        
        // Обновляем кэш состояния авторизации
        localStorage.setItem('auth_status', isAuth ? 'authenticated' : 'unauthenticated');
        return isAuth;
      } catch (error) {
        console.error('Ошибка в checkAuth:', error);
        localStorage.setItem('auth_status', 'unauthenticated');
        return false;
      }
    }, { cacheTTL: 10000 }); // Кэшируем на 10 секунд для тестирования
  }
};

// API для авторизованных запросов
export const api = {
  API_URL,
  
  // Базовый метод для запросов
  request: async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    return RequestCache.execute(url, async () => {
      return authorizedFetch(url, options);
    });
  },
  
  // Удобные обертки для разных HTTP методов
  // В api.js, улучшаем метод get:
  get: async (endpoint) => {
    const cacheBuster = new Date().getTime();
    const url = endpoint.includes('?') 
      ? `${API_URL}${endpoint}&_=${cacheBuster}` 
      : `${API_URL}${endpoint}?_=${cacheBuster}`;
    
    return RequestCache.execute(url, async () => {
      console.log('Выполняем GET запрос:', url);
      
      try {
        const response = await fetch(`${url}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          credentials: 'include'
        });
        
        console.log('Получен ответ, статус:', response.status);
        
        // Проверяем статус ответа
        if (!response.ok) {
          return {
            ok: false,
            status: response.status,
            error: `HTTP Error: ${response.status}`,
            data: null
          };
        }
        
        // Читаем текст ответа
        const text = await response.text();
        console.log('Текст ответа:', text ? (text.length > 100 ? text.substring(0, 100) + '...' : text) : 'пустой');
        
        // Пытаемся распарсить JSON, только если есть текст
        if (text && text.trim()) {
          try {
            const parsedData = JSON.parse(text);
            console.log('Данные JSON успешно распарсены:', parsedData);
            
            return {
              ok: true,
              status: response.status,
              data: parsedData,  // Здесь важное изменение - используем распарсенные данные
              text: text
            };
          } catch (parseError) {
            console.error('Ошибка парсинга JSON:', parseError);
            return {
              ok: false,
              status: response.status,
              error: 'Неверный формат JSON',
              data: null,
              rawText: text
            };
          }
        }
        
        // Пустой ответ
        return {
          ok: true,
          status: response.status,
          data: {},
          text: text
        };
      } catch (error) {
        console.error('Ошибка выполнения запроса:', error);
        return {
          ok: false,
          status: 0,
          error: error.message,
          data: null
        };
      }
    });
  },
  
  post: async (endpoint, data) => {
    const url = `${API_URL}${endpoint}`;
    
    return RequestCache.execute(url, async () => {
      try {
        const response = await authorizedFetch(url, {
          method: 'POST',
          body: JSON.stringify(data)
        });
        
        // Получаем текст ответа
        const text = await response.text();
        
        // Проверяем, пришел ли текстовый ответ
        if (text.trim()) {
          try {
            // Пробуем его распарсить как JSON
            const jsonData = JSON.parse(text);
            
            // Проверяем наличие ошибки в JSON
            if (jsonData.ok === false || jsonData.error) {
              return {
                ok: false,
                status: response.status, // Важно передать статус ответа
                error: jsonData.error || 'Ошибка обработки ответа',
                data: jsonData,
                text: text
              };
            }
            
            // Успешный ответ с JSON данными
            return {
              ok: response.ok,
              status: response.status, // Передаем статус
              data: jsonData,
              text: text
            };
          } catch (parseError) {
            // Если не удалось распарсить как JSON, это, вероятно, текстовый контент
            console.log('Получен текстовый ответ (не JSON):', text.substring(0, 100) + '...');
            return {
              ok: response.ok,
              status: response.status, // Передаем статус
              text: text,
              data: text,
              isTextContent: true
            };
          }
        }
        
        // Пустой ответ
        return {
          ok: response.ok,
          status: response.status, // Передаем статус
          text: '',
          data: {}
        };
      } catch (error) {
        console.error('Ошибка в post запросе:', error);
        return {
          ok: false,
          status: 0,
          error: error.message || 'Ошибка сети',
          text: '',
          data: null
        };
      }
    });
  },
  
  put: async (endpoint, data) => {
    const url = `${API_URL}${endpoint}`;
    
    return RequestCache.execute(url, async () => {
      const response = await authorizedFetch(url, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        try {
          const text = await response.text();
          return {
            ok: true,
            status: response.status,
            data: text ? JSON.parse(text) : {},
            text: () => Promise.resolve(text),
            json: async () => text ? JSON.parse(text) : {}
          };
        } catch (error) {
          return {
            ok: false,
            status: response.status,
            error: 'Ошибка обработки ответа',
            text: () => Promise.resolve(''),
            json: async () => ({ error: 'Ошибка обработки ответа' })
          };
        }
      }
      
      return response;
    });
  },
  
  delete: async (endpoint) => {
    const url = `${API_URL}${endpoint}`;
    
    return RequestCache.execute(url, async () => {
      const response = await authorizedFetch(url, { method: 'DELETE' });
      
      if (response.ok) {
        try {
          const text = await response.text();
          return {
            ok: true,
            status: response.status,
            data: text ? JSON.parse(text) : {},
            text: () => Promise.resolve(text),
            json: async () => text ? JSON.parse(text) : {}
          };
        } catch (error) {
          return {
            ok: false,
            status: response.status,
            error: 'Ошибка обработки ответа',
            text: () => Promise.resolve(''),
            json: async () => ({ error: 'Ошибка обработки ответа' })
          };
        }
      }
      
      return response;
    });
  },
  
  // Получение данных аккаунта
  getAccountInfo: async () => {
    const url = `${API_URL}/account/info`;
    const cacheBuster = new Date().getTime();
    const urlWithCacheBuster = `${url}?_=${cacheBuster}`;
    
    return RequestCache.execute(urlWithCacheBuster, async () => {
      console.log('Запрос данных аккаунта...');
      const response = await api.get('/account/info');
      
      if (!response.ok) {
        console.error('Ошибка получения данных аккаунта:', response.status);
        throw new Error('Не удалось получить информацию об аккаунте');
      }
      
      return response.data;
    });
  }
};