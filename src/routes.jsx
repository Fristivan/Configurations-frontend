// src/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Configurator from './pages/configurator';
import Account from './pages/account';
import PageLayout from './components/layout/page-layout';
import ProtectedRoute from './components/auth/protected-route';  // Импортируем из отдельного файла
import SavedConfigurations from './pages/SavedConfigurations';


// Временные страницы для тестирования
const TempPage = ({ title }) => (
  <PageLayout>
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg">Страница в разработке</p>
    </div>
  </PageLayout>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/configurator" element={<Configurator />} />
      <Route path="/configurations" element={<SavedConfigurations />} />
      
      {/* Используем импортированный ProtectedRoute */}
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;