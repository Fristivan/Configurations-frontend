// src/components/layout/footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ConfigGen</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">О проекте</Link></li>
              <li><Link to="/team" className="text-muted-foreground hover:text-foreground">Команда</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Контакты</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Продукт</h3>
            <ul className="space-y-2">
              <li><Link to="/configurator" className="text-muted-foreground hover:text-foreground">Конфигуратор</Link></li>
              <li><Link to="/features" className="text-muted-foreground hover:text-foreground">Возможности</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Тарифы</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Документация</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground">Руководство</Link></li>
              <li><Link to="/api" className="text-muted-foreground hover:text-foreground">API</Link></li>
              <li><Link to="/examples" className="text-muted-foreground hover:text-foreground">Примеры</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Юридическая информация</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Условия использования</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Политика конфиденциальности</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ConfigGen. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;