// src/pages/PaymentReturn.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';

export default function PaymentReturn() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const orderId = new URLSearchParams(search).get('order_id');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get(`/payments/${orderId}/status`);
        if (!resp.ok) {
          throw new Error(resp.error || `HTTP ${resp.status}`);
        }
        setStatus(resp.data.payment_status);
      } catch (err) {
        console.error('Ошибка при проверке статуса:', err);
        setError('Не удалось проверить статус оплаты');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchStatus();
  }, [orderId]);

  return (
    <PageLayout>
      <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Результат оплаты</h2>
        {loading ? (
          <p className="text-gray-200">Проверяем статус оплаты...</p>
        ) : error ? (
          <p className="text-red-400 mb-4">{error}</p>
        ) : status === 'succeeded' ? (
          <p className="text-green-400 mb-4">Оплата успешно завершена! Подписка активирована.</p>
        ) : (
          <p className="text-gray-200 mb-4">
            Статус платежа: <strong className="text-white">{status}</strong>
          </p>
        )}
        <button
          onClick={() => navigate('/account')}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
        >
          Назад в профиль
        </button>
      </div>
    </PageLayout>
  );
}
