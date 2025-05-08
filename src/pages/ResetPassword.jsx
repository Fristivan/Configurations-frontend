// src/pages/reset-password.jsx
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword() {
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  const [form, setForm] = useState({ email: initialEmail, code: '', new_password: '', confirm_password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialEmail) {
      setForm((f) => ({ ...f, email: initialEmail }));
    }
  }, [initialEmail]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (form.new_password !== form.confirm_password) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/password/reset/confirm', form);
      if (!response.ok) throw new Error('Ошибка при сбросе пароля');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Сброс пароля</h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4" />
            <p>Сброс пароля...</p>
          </div>
        ) : success ? (
          <div className="bg-green-50 border rounded-lg hover:shadow-md transition-all duration-200  border-green-200 text-green-700 px-4 py-3 rounded-md">
            <p>Пароль успешно изменён!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card shadow-md rounded-2xl border border-border  p-6 rounded-lg shadow-sm border rounded-lg hover:shadow-md transition-all duration-200  border-border max-w-md mx-auto space-y-4">
            <div>
              <label htmlFor="email" className="text-sm text-muted-foreground">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                readOnly
                className="w-full px-4 py-2 border rounded-lg hover:shadow-md transition-all duration-200  border-input rounded-md bg-card shadow-md rounded-2xl border border-border /30 cursor-not-allowed px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
              />
            </div>
            <div>
              <label htmlFor="code" className="text-sm text-muted-foreground">Код восстановления</label>
              <input
                type="text"
                id="code"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg hover:shadow-md transition-all duration-200  border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
              />
            </div>
            <div>
              <label htmlFor="new_password" className="text-sm text-muted-foreground">Новый пароль</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg hover:shadow-md transition-all duration-200  border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className="text-sm text-muted-foreground">Подтверждение пароля</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg hover:shadow-md transition-all duration-200  border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary px-4 py-2 border border-input rounded-md focus:outline-none focus:ring focus:ring-primary/40 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border rounded-lg hover:shadow-md transition-all duration-200  border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
            >
              Изменить пароль
            </button>
          </form>
        )}
      </div>
    </PageLayout>
  );
}