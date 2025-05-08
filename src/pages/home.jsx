// src/pages/home.jsx
import React from 'react';
import PageLayout from '../components/layout/page-layout';
import { GearIcon, MagicWandIcon, AppsIcon, CodeIcon } from '../components/icons/Index';

const Home = () => {
  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <div className="mb-8 animate-float">
            <MagicWandIcon className="w-20 h-20 mx-auto text-primary drop-shadow-xl" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Генерация конфигураций в один клик
          </h1>
          <p className="text-xl text-gray-300 md:max-w-2xl mx-auto mb-10">
            Наш сервис позволяет быстро создавать оптимальные конфигурации для любых приложений 
            на основе ваших требований, экономя ваше время и усилия.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/configurator" 
              className="px-8 py-4 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 rounded-lg font-medium flex items-center gap-2"
            >
              <GearIcon className="w-5 h-5" />
              Попробовать
            </a>
            <a 
              href="/login" 
              className="px-8 py-4 border border-gray-600 hover:border-primary hover:text-primary transition-all duration-300 rounded-lg font-medium"
            >
              Войти
            </a>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-gray-400">
            Ключевые возможности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Карточка фичи 1 */}
            <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-xl mb-6 transition-colors group-hover:bg-primary/20">
                <AppsIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-100">Простая настройка</h3>
              <p className="text-gray-400 leading-relaxed">
                Интуитивно понятный интерфейс для создания конфигураций. Не требует специальных технических знаний.
              </p>
            </div>

            {/* Карточка фичи 2 */}
            <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-xl mb-6 transition-colors group-hover:bg-primary/20">
                <CodeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-100">Множество приложений</h3>
              <p className="text-gray-400 leading-relaxed">
                Поддержка различных типов приложений и ПО с постоянно растущим списком.
              </p>
            </div>

            {/* Карточка фичи 3 */}
            <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-xl mb-6 transition-colors group-hover:bg-primary/20">
                <GearIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-100">Гибкий API</h3>
              <p className="text-gray-400 leading-relaxed">
                Мощный API для интеграции с вашими системами и автоматизации рабочих процессов.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-100">
              Начните настраивать приложения прямо сейчас
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Присоединяйтесь к тысячам пользователей, которые уже упростили процесс настройки своих приложений.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="/configurator" 
                className="px-8 py-4 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 rounded-lg font-medium"
              >
                Начать бесплатно
              </a>
              <a 
                href="/docs" 
                className="px-8 py-4 border border-gray-600 hover:border-primary hover:text-primary transition-all duration-300 rounded-lg font-medium"
              >
                Изучить документацию
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;