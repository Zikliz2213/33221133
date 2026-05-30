import { useEffect, useRef, useState } from 'react';
import { ApiService, USE_MOCK } from './services/api';
import { WebSocketService } from './services/websocket';
import { AuthScreen } from './components/AuthScreen';
import { MainScreen } from './components/MainScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      ApiService.setToken(token);
      ApiService.get('/auth/me')
        .then((user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          // WebSocket не нужен в mock-режиме
          if (!USE_MOCK) {
            wsRef.current = new WebSocketService(token);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          if (USE_MOCK) {
            localStorage.removeItem('mock_current_token');
            localStorage.removeItem('mock_token_user');
          }
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (token: string) => {
    localStorage.setItem('token', token);
    ApiService.setToken(token);

    try {
      const user = await ApiService.get('/auth/me');
      setCurrentUser(user);
      setIsAuthenticated(true);
      if (!USE_MOCK) {
        wsRef.current = new WebSocketService(token);
      }
    } catch (error) {
      console.error('Failed to get user info:', error);
      // В mock-режиме /auth/me должен работать — если всё же упало, сбрасываем
      localStorage.removeItem('token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (USE_MOCK) {
      localStorage.removeItem('mock_current_token');
      localStorage.removeItem('mock_token_user');
    }
    ApiService.setToken(null);
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-tg-dark-bg dark:bg-tg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-tg-primary mx-auto"></div>
          <p className="mt-4 text-white">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      {!isAuthenticated ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <MainScreen
          currentUser={currentUser}
          onLogout={handleLogout}
          wsService={wsRef.current}
        />
      )}
    </div>
  );
}

export default App;
