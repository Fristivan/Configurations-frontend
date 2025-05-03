// src/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Configurator from './pages/configurator';
import Account from './pages/account';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Subscribe from './pages/Subscribe';
import PaymentReturn from './pages/PaymentReturn';
import WebhookSimulator from './pages/WebhookSimulator';
import SavedConfigurations from './pages/SavedConfigurations';
import PageLayout from './components/layout/page-layout';
import ProtectedRoute from './components/auth/protected-route';

// Временные страницы для тестирования
const TempPage = ({ title }) => (
  <PageLayout>
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg">Страница в разработке</p>
    </div>
  </PageLayout>
);

const AppRoutes = () => (
  <Routes>
    {/* Публичные маршруты */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/configurator" element={<Configurator />} />
    <Route path="/configurations" element={<SavedConfigurations />} />

    {/* Маршруты оплаты */}
    <Route
      path="/subscribe"
      element={
        <ProtectedRoute>
          <Subscribe />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment-return"
      element={
        <ProtectedRoute>
          <PaymentReturn />
        </ProtectedRoute>
      }
    />
    <Route
      path="/simulate-webhook"
      element={
        <ProtectedRoute>
          <WebhookSimulator />
        </ProtectedRoute>
      }
    />

    {/* Защищённые маршруты */}
    <Route
      path="/account"
      element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      }
    />

    {/* Временные маршруты для тестирования */}
    <Route path="/about" element={<TempPage title="О проекте" />} />
    <Route path="/docs" element={<TempPage title="Документация" />} />

    {/* Redirect всех остальных */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
