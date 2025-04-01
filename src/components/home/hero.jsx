import React from 'react';
import { Button } from '../ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 py-20 text-primary-foreground">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]" />
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Генерация конфигураций в один клик
          </h1>
          <p className="mb-10 text-lg md:text-xl">
            Наш сервис позволяет быстро создавать оптимальные конфигурации для любых приложений 
            на основе ваших требований, экономя ваше время и усилия.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" to="/configurator">
              Попробовать
            </Button>
            <Button size="lg" variant="outline" to="/login">
              Войти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;