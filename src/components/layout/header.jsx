// src/components/layout/header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Закрытие меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-foreground">
            Конфигуратор
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Главная
            </Link>
            <Link to="/configurator" className="text-foreground hover:text-primary transition-colors">
              Конфигуратор
            </Link>
            {user?.isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button 
                  className="flex items-center text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="mr-2">{user.email || 'Аккаунт'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {/* Выпадающее меню */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-10">
                    <div className="py-1">
                      <Link 
                        to="/account" 
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Настройки аккаунта
                      </Link>
                      <Link 
                        to="/configurations" 
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Мои конфигурации
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-foreground hover:text-primary transition-colors">
                  Войти
                </Link>
                <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  Регистрация
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;