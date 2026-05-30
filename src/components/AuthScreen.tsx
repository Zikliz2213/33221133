import { useState } from 'react';
import { ApiService } from '../services/api';

interface AuthScreenProps {
  onLogin: (token: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await ApiService.post(endpoint, data);
      
      if (response.token) {
        onLogin(response.token);
      } else {
        setError('Неверный ответ сервера');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-tg-primary to-blue-600 dark:from-tg-dark-bg dark:to-tg-dark-secondary">
      <div className="bg-white dark:bg-tg-dark-secondary rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-tg-primary rounded-full mb-4">
            <i className="fas fa-paper-plane text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Telegram Web
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Имя
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-tg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-tg-primary focus:border-transparent outline-none transition"
                placeholder="Введите ваше имя"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Имя пользователя
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-tg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-tg-primary focus:border-transparent outline-none transition"
              placeholder="@username"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-tg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-tg-primary focus:border-transparent outline-none transition"
                placeholder="email@example.com"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-tg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-tg-primary focus:border-transparent outline-none transition"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Загрузка...
              </span>
            ) : isLogin ? (
              'Войти'
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-tg-primary hover:underline text-sm font-medium"
          >
            {isLogin
              ? 'Нет аккаунта? Зарегистрируйтесь'
              : 'Уже есть аккаунт? Войдите'}
          </button>
        </div>
      </div>
    </div>
  );
}
