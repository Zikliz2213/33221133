const API_URL = '33221133-production.up.railway.app';

// ======================================================
// MOCK MODE — поменяй на true чтобы работать без сервера
// ======================================================
export const USE_MOCK = false;

const mockDelay = () => new Promise(res => setTimeout(res, 600));

// Храним пользователей в localStorage чтобы не терять при перезагрузке
function getMockDB(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem('mock_users') || '{}');
  } catch {
    return {};
  }
}

function saveMockDB(db: Record<string, any>) {
  localStorage.setItem('mock_users', JSON.stringify(db));
}

async function mockRequest(endpoint: string, method: string, data?: any): Promise<any> {
  await mockDelay();

  // Регистрация
  if (endpoint === '/auth/register' && method === 'POST') {
    const { username, email, password, displayName } = data;
    const db = getMockDB();
    const cleanUsername = username.replace('@', '').toLowerCase();

    if (db[cleanUsername]) {
      throw new Error('Пользователь с таким именем уже существует');
    }

    const user = { id: Date.now(), username: cleanUsername, email, displayName, avatar: null };
    db[cleanUsername] = { ...user, password };
    saveMockDB(db);

    const token = `mock-token-${cleanUsername}`;
    localStorage.setItem('mock_current_token', token);
    localStorage.setItem('mock_token_user', cleanUsername);

    return { token, user };
  }

  // Вход
  if (endpoint === '/auth/login' && method === 'POST') {
    const { username, password } = data;
    const db = getMockDB();
    const cleanUsername = username.replace('@', '').toLowerCase();
    const found = db[cleanUsername];

    if (!found || found.password !== password) {
      throw new Error('Неверное имя пользователя или пароль');
    }

    const token = `mock-token-${cleanUsername}`;
    localStorage.setItem('mock_current_token', token);
    localStorage.setItem('mock_token_user', cleanUsername);

    const { password: _, ...user } = found;
    return { token, user };
  }

  // Получить текущего пользователя
  if (endpoint === '/auth/me' && method === 'GET') {
    const storedUsername = localStorage.getItem('mock_token_user');
    if (!storedUsername) throw new Error('Не авторизован');

    const db = getMockDB();
    const found = db[storedUsername];
    if (!found) throw new Error('Пользователь не найден');

    const { password: _, ...user } = found;
    return user;
  }

  // Получить список чатов (заглушка)
  if (endpoint === '/chats' && method === 'GET') {
    return [];
  }

  // Получить сообщения (заглушка)
  if (endpoint.startsWith('/chats/') && method === 'GET') {
    return [];
  }

  // Для всех остальных — возвращаем пустой ответ
  console.warn(`Mock: нет обработчика для ${method} ${endpoint}`);
  return {};
}

export class ApiService {
  private static token: string | null = null;

  static setToken(token: string | null) {
    this.token = token;
  }

  static async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  static async get(endpoint: string) {
    if (USE_MOCK) return mockRequest(endpoint, 'GET');
    return this.request(endpoint, { method: 'GET' });
  }

  static async post(endpoint: string, data: any) {
    if (USE_MOCK) return mockRequest(endpoint, 'POST', data);
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put(endpoint: string, data: any) {
    if (USE_MOCK) return mockRequest(endpoint, 'PUT', data);
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(endpoint: string) {
    if (USE_MOCK) return mockRequest(endpoint, 'DELETE');
    return this.request(endpoint, { method: 'DELETE' });
  }

  static async uploadFile(endpoint: string, file: File, onProgress?: (progress: number) => void) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_URL}${endpoint}`);
      if (this.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      }
      xhr.send(formData);
    });
  }
}
