// src/lib/request-cache.js
/**
 * Модуль для кэширования запросов API.
 * 
 * Предотвращает дублирование запросов, кэширует ответы
 * и обеспечивает строгий контроль состояний запросов.
 */

// Хранилище запросов и ответов
const requestPromises = new Map();
const responseCache = new Map();

// Время жизни кэша в миллисекундах
const CACHE_TTL = 30000; // 30 секунд

// Таймаут для очистки запросов
const CLEANUP_TIMEOUT = 1000;

/**
 * Сервис кэширования запросов
 */
const RequestCache = {
  /**
   * Выполнить запрос с кэшированием
   * 
   * @param {string} url - URL для запроса
   * @param {Function} requestFn - Функция для выполнения запроса
   * @param {Object} options - Дополнительные опции
   * @param {boolean} options.forceRefresh - Принудительно обновить кэш
   * @param {number} options.cacheTTL - Время жизни кэша (мс)
   * @returns {Promise<any>} - Promise с результатом запроса
   */
  async execute(url, requestFn, options = {}) {
    const { 
      forceRefresh = false, 
      cacheTTL = CACHE_TTL,
      // Добавим новый параметр для очистки запросов при страгом режиме React
      strictMode = true
    } = options;
    
    // Используем только часть URL в качестве ключа кэша (без параметров запроса)
    const urlBase = url.split('?')[0];
    const cacheKey = strictMode ? url : urlBase;
    
    // Проверка кэша
    if (!forceRefresh) {
      // Если есть активный запрос, возвращаем его
      if (requestPromises.has(cacheKey)) {
        console.log(`[RequestCache] Повторный запрос: используем существующий Promise для ${url}`);
        return requestPromises.get(cacheKey);
      }
      
      // Ищем похожие запросы (без параметров)
      if (strictMode) {
        for (const [key, promise] of requestPromises.entries()) {
          if (key.startsWith(urlBase)) {
            console.log(`[RequestCache] Найден похожий запрос: ${key} для ${url}`);
            return promise;
          }
        }
      }
      
      // Если есть свежий кэшированный ответ, возвращаем его
      const cachedResponse = responseCache.get(cacheKey);
      if (cachedResponse && Date.now() - cachedResponse.timestamp < cacheTTL) {
        console.log(`[RequestCache] Кэшированный ответ (${((Date.now() - cachedResponse.timestamp) / 1000).toFixed(2)}s): ${url}`);
        return Promise.resolve(cachedResponse.data);
      }
    } else {
      console.log(`[RequestCache] Принудительное обновление кэша: ${url}`);
      // Удаляем старый кэш при принудительном обновлении
      responseCache.delete(cacheKey);
    }
    
    // Создаем новый запрос и сохраняем его Promise
    console.log(`[RequestCache] Новый запрос: ${url}`);
    const promise = (async () => {
      try {
        // Выполняем исходную функцию запроса
        const data = await requestFn();
        
        // Кэшируем результат
        responseCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        console.log(`[RequestCache] Успешный ответ: ${url}`);
        return data;
      } catch (error) {
        // В случае ошибки очищаем кэш для этого URL
        console.error(`[RequestCache] Ошибка запроса: ${url}`, error);
        responseCache.delete(cacheKey);
        throw error;
      } finally {
        // Очищаем Promise из активных запросов после небольшой задержки
        setTimeout(() => {
          if (requestPromises.get(cacheKey) === promise) {
            requestPromises.delete(cacheKey);
            console.log(`[RequestCache] Promise удален из кэша: ${url}`);
          }
        }, CLEANUP_TIMEOUT);
      }
    })();
    
    // Сохраняем Promise в карте активных запросов
    requestPromises.set(cacheKey, promise);
    
    return promise;
  },
  
  /**
   * Очистить кэш для указанного URL или всех URL
   * 
   * @param {string|null} url - URL для очистки, или null для полной очистки
   */
  clear(url = null) {
    if (url) {
      console.log(`[RequestCache] Очистка кэша для: ${url}`);
      requestPromises.delete(url);
      responseCache.delete(url);
    } else {
      console.log('[RequestCache] Полная очистка кэша');
      requestPromises.clear();
      responseCache.clear();
    }
  },
  
  /**
   * Получить статистику кэша
   * 
   * @returns {Object} - Объект со статистикой кэша
   */
  getStats() {
    return {
      activeRequests: requestPromises.size,
      cachedResponses: responseCache.size,
      cachedUrls: Array.from(responseCache.keys())
    };
  },
  
  /**
   * Проверить наличие URL в кэше
   * 
   * @param {string} url - URL для проверки
   * @returns {boolean} - true, если URL есть в кэше
   */
  has(url) {
    return responseCache.has(url) || requestPromises.has(url);
  },
  
  /**
   * Удалить старые записи из кэша
   */
  cleanup() {
    const now = Date.now();
    let count = 0;
    
    for (const [url, cache] of responseCache.entries()) {
      if (now - cache.timestamp > CACHE_TTL) {
        responseCache.delete(url);
        count++;
      }
    }
    
    if (count > 0) {
      console.log(`[RequestCache] Очищено ${count} устаревших записей`);
    }
    
    return count;
  }
};

// Автоматическая очистка кэша каждую минуту
if (typeof window !== 'undefined') {
  setInterval(() => {
    RequestCache.cleanup();
  }, 60000);
}

export default RequestCache;