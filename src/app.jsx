// src/app.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth-provider';
import AppRoutes from './routes';
import { ThemeProvider } from './context/theme-provider';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;