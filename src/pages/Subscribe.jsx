// src/pages/Subscribe.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';

export default function Subscribe() {
  const [plan, setPlan] = useState('premium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Стоимости для каждого плана
  const priceMap = {
    basic: '0.00',
    premium: '100.00',
    professional: '200.00',
  };

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    const amount = priceMap[plan];

    try {
      const resp = await api.post('/payments/create', { amount, plan });
      if (!resp.ok) throw new Error(resp.error || 'Не удалось создать платёж');
      const { payment_url } = resp.data;
      window.location.href = payment_url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Оформление подписки</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Выберите тариф:</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="basic">Базовый ({priceMap.basic} ₽/мес)</option>
            <option value="premium">Премиум ({priceMap.premium} ₽/мес)</option>
            <option value="professional">Профессиональный ({priceMap.professional} ₽/мес)</option>
          </select>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Переадресация...' : `Оплатить ${priceMap[plan]} ₽`}
        </button>
      </div>
    </PageLayout>
  );
}