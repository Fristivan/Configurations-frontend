// src/pages/forgot-password.jsx
import React, { useState } from 'react';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/password/reset/request', { email });
      if (!response.ok) throw new Error('Ошибка при отправке запроса');
      setSuccess(true);
      // Перенаправление на страницу подтверждения с передачей email
      setTimeout(() => navigate('/reset-password', { state: { email } }), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Восстановление пароля</h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4" />
            <p>Отправка запроса...</p>
          </div>
        ) : success ? (
          <div className="bg-green-50 border rounded-lg hover:shadow-md transition-all duration-200  border-green-200 text-green-700 px-4 py-3 rounded-md">
            <p>Код восстановления отправлен на вашу почту!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card shadow-md rounded-2xl border border-border  p-6 rounded-lg shadow-sm border rounded-lg hover:shadow-md transition-all duration-200  border-border max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm text-muted-foreground">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg hover:shadow-md transition-all duration-200  border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                Отправить код
              </button>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
}