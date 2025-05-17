// src/pages/PaymentsHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';
import { useAuth } from '../hooks/use-auth';

const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user?.isAuthenticated) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/payments');

        if (!response.ok) {
          throw new Error(`Ошибка получения истории платежей: ${response.status}`);
        }

        setPayments(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке истории платежей:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [user, loading]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 lg:px-8  py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">История платежей</h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border rounded-lg hover:shadow-md transition-all duration-200 -t-2 border-b-2 border-primary mb-4"></div>
            <p>Загрузка истории...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border rounded-lg hover:shadow-md transition-all duration-200  border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="bg-card shadow-md rounded-2xl border border-border  p-6 rounded-lg shadow-sm border rounded-lg hover:shadow-md transition-all duration-200  border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border rounded-lg hover:shadow-md transition-all duration-200 -b border-border">
                    <th className="py-2 px-3">Дата</th>
                    <th className="py-2 px-3">Сумма</th>
                    <th className="py-2 px-3">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr key={idx} className="border rounded-lg hover:shadow-md transition-all duration-200 -b border-border">
                      <td className="py-2 px-3 whitespace-nowrap">{formatDate(payment.created_at)}</td>
                      <td className="py-2 px-3">{payment.amount} {payment.currency || 'RUB'}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${
                          payment.status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status === 'succeeded'
                            ? 'Успешно'
                            : payment.status === 'created'
                            ? 'В ожидании'
                            : 'Ошибка'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>История платежей пуста.</p>
        )}
      </div>
    </PageLayout>
  );
};

export default PaymentsHistory;