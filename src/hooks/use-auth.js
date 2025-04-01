// src/hooks/use-auth.js
import { useContext } from 'react';
import { AuthContext } from '../context/auth-provider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  
  return context;
};