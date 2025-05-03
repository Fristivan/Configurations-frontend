// src/pages/WebhookSimulator.jsx
import React, { useState } from 'react';
import PageLayout from '../components/layout/page-layout';
import { api } from '../lib/api';

export default function WebhookSimulator() {
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      event: 'payment.succeeded',
      object: {
        id: paymentId || 'SIMULATED_PAYMENT_ID',
        status: 'succeeded',
        amount: { value: '0.00', currency: 'RUB' },
        description: `simulator ${orderId}`,
        metadata: { order_id: orderId }
      }
    };

    try {
      const resp = await api.post('/payments/webhook', payload);
      if (!resp.ok) throw new Error(resp.error || `HTTP ${resp.status}`);
      setResult(resp.data);
    } catch (err) {
      console.error('Ошибка эмуляции webhook:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Эмулятор Webhook</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="Введите order_id"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment ID</label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="Введите payment_id (необязательно)"
            />
          </div>
          <button
            onClick={handleSimulate}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !orderId}
          >
            {loading ? 'Отправка...' : 'Эмулировать Webhook'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-4">Ошибка: {error}</p>}
        {result && (
          <pre className="bg-gray-700 text-white p-4 mt-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </PageLayout>
  );
}
