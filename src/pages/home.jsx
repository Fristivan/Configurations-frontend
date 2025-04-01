// src/pages/home.jsx
import React from 'react';
import PageLayout from '../components/layout/page-layout';

const Home = () => {
  return (
    <PageLayout>
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Генерация конфигураций в один клик</h1>
          <p className="text-xl md:max-w-2xl mx-auto mb-10">
            Наш сервис позволяет быстро создавать оптимальные конфигурации для любых приложений 
            на основе ваших требований, экономя ваше время и усилия.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/configurator" className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors">
              Попробовать
            </a>
            <a href="/login" className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors">
              Войти
            </a>
          </div>
        </div>
      </div>

      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ключевые возможности</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Карточка фичи 1 */}
            <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Простая настройка</h3>
              <p className="text-muted-foreground">Интуитивно понятный интерфейс для создания конфигураций. Не требует специальных технических знаний.</p>
            </div>

            {/* Карточка фичи 2 */}
            <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Множество приложений</h3>
              <p className="text-muted-foreground">Поддержка различных типов приложений и программного обеспечения с постоянно растущим списком.</p>
            </div>

            {/* Карточка фичи 3 */}
            <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Гибкий API</h3>
              <p className="text-muted-foreground">Мощный API для интеграции с вашими существующими системами и автоматизации рабочих процессов.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Начните настраивать ваши приложения прямо сейчас</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Присоединяйтесь к тысячам пользователей, которые уже упростили процесс настройки своих приложений с помощью ConfigGen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/configurator" className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors">
              Начать бесплатно
            </a>
            <a href="/docs" className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors">
              Изучить документацию
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;