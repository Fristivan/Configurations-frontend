// В login-form.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { login, loading, error } = useAuth();
  const timeoutRef = useRef(null);

  // Сброс состояния при монтировании/размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Устанавливаем локальное состояние загрузки
    setLocalLoading(true);
    
    // Устанавливаем таймаут для автоматического сброса состояния
    timeoutRef.current = setTimeout(() => {
      setLocalLoading(false);
      console.log('Автоматический сброс состояния формы по таймауту');
    }, 10000);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Ошибка входа:', error);
    } finally {
      // Очищаем таймаут и сбрасываем состояние
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Сбрасываем состояние загрузки
      setLocalLoading(false);
    }
  };

  // Используем локальное состояние для отображения
  const isButtonDisabled = localLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Вход в аккаунт</h2>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isButtonDisabled}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block mb-1">Пароль</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isButtonDisabled}
        />
      </div>
      
      <Button type="submit" disabled={isButtonDisabled}>
        {isButtonDisabled ? 'Загрузка...' : 'Войти'}
      </Button>
    </form>
  );
};

export default LoginForm;