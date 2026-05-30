# Примеры использования

## 🔐 Аутентификация

### Регистрация нового пользователя

```typescript
import { ApiService } from './services/api';

async function register() {
  try {
    const response = await ApiService.post('/auth/register', {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'securePassword123',
      displayName: 'John Doe'
    });
    
    const { token, user } = response;
    localStorage.setItem('token', token);
    console.log('Registered:', user);
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}
```

### Вход в систему

```typescript
async function login() {
  try {
    const response = await ApiService.post('/auth/login', {
      username: 'johndoe',
      password: 'securePassword123'
    });
    
    const { token } = response;
    localStorage.setItem('token', token);
    ApiService.setToken(token);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}
```

### Проверка аутентификации

```typescript
async function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  ApiService.setToken(token);
  
  try {
    const user = await ApiService.get('/auth/me');
    console.log('Current user:', user);
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
}
```

## 👤 Работа с профилем

### Получение профиля

```typescript
async function getProfile() {
  try {
    const user = await ApiService.get('/auth/me');
    console.log(user);
  } catch (error) {
    console.error('Failed to get profile:', error);
  }
}
```

### Обновление профиля

```typescript
async function updateProfile() {
  try {
    const updatedUser = await ApiService.put('/users/me', {
      displayName: 'John Doe Updated',
      bio: 'Full-stack developer',
      username: 'johndoe2024'
    });
    
    console.log('Profile updated:', updatedUser);
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
}
```

### Загрузка аватара

```typescript
async function uploadAvatar(file: File) {
  try {
    const result = await ApiService.uploadFile(
      '/upload/avatar',
      file,
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
      }
    );
    
    console.log('Avatar uploaded:', result);
    
    // Обновить профиль с новым аватаром
    await ApiService.put('/users/me', {
      avatar: result.url
    });
  } catch (error) {
    console.error('Failed to upload avatar:', error);
  }
}
```

## 💬 Работа с чатами

### Получение списка чатов

```typescript
async function getChats() {
  try {
    const chats = await ApiService.get('/chats');
    console.log('My chats:', chats);
    return chats;
  } catch (error) {
    console.error('Failed to get chats:', error);
    return [];
  }
}
```

### Создание нового чата

```typescript
async function createChat(userId: string) {
  try {
    const chat = await ApiService.post('/chats', { userId });
    console.log('Chat created:', chat);
    return chat;
  } catch (error) {
    console.error('Failed to create chat:', error);
  }
}
```

### Получение сообщений чата

```typescript
async function getChatMessages(chatId: string) {
  try {
    const messages = await ApiService.get(`/chats/${chatId}/messages`);
    console.log('Messages:', messages);
    return messages;
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
}
```

### Отправка текстового сообщения

```typescript
async function sendMessage(chatId: string, content: string) {
  try {
    const message = await ApiService.post(`/chats/${chatId}/messages`, {
      content
    });
    
    console.log('Message sent:', message);
    return message;
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}
```

### Отправка сообщения с вложениями

```typescript
async function sendMessageWithAttachments(
  chatId: string,
  content: string,
  files: File[]
) {
  try {
    // Сначала загружаем файлы
    const attachments = [];
    for (const file of files) {
      const uploaded = await ApiService.uploadFile('/upload', file);
      attachments.push(uploaded);
    }
    
    // Затем отправляем сообщение
    const message = await ApiService.post(`/chats/${chatId}/messages`, {
      content,
      attachments
    });
    
    console.log('Message with attachments sent:', message);
    return message;
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}
```

## 📢 Работа с каналами

### Создание канала

```typescript
async function createChannel(name: string, description: string) {
  try {
    const channel = await ApiService.post('/channels', {
      name,
      description
    });
    
    console.log('Channel created:', channel);
    return channel;
  } catch (error) {
    console.error('Failed to create channel:', error);
  }
}
```

### Подписка на канал

```typescript
async function subscribeToChannel(channelId: string) {
  try {
    const result = await ApiService.post(`/channels/${channelId}/subscribe`);
    console.log('Subscribed to channel:', result);
  } catch (error) {
    console.error('Failed to subscribe:', error);
  }
}
```

### Отписка от канала

```typescript
async function unsubscribeFromChannel(channelId: string) {
  try {
    const result = await ApiService.post(`/channels/${channelId}/unsubscribe`);
    console.log('Unsubscribed from channel:', result);
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
  }
}
```

## 🔍 Поиск

### Поиск пользователей

```typescript
async function searchUsers(query: string) {
  try {
    const users = await ApiService.get(
      `/users/search?q=${encodeURIComponent(query)}`
    );
    
    console.log('Found users:', users);
    return users;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
```

### Глобальный поиск

```typescript
async function globalSearch(query: string) {
  try {
    const results = await ApiService.get(
      `/search?q=${encodeURIComponent(query)}`
    );
    
    console.log('Search results:', results);
    // results = { chats: [...], channels: [...], messages: [...] }
    return results;
  } catch (error) {
    console.error('Search failed:', error);
    return { chats: [], channels: [], messages: [] };
  }
}
```

## 😊 Реакции на сообщения

### Добавление реакции

```typescript
async function addReaction(messageId: string, emoji: string) {
  try {
    const result = await ApiService.post(
      `/messages/${messageId}/reactions`,
      { emoji }
    );
    
    console.log('Reaction added:', result);
  } catch (error) {
    console.error('Failed to add reaction:', error);
  }
}
```

### Удаление реакции

```typescript
async function removeReaction(messageId: string, emoji: string) {
  try {
    await ApiService.delete(`/messages/${messageId}/reactions/${emoji}`);
    console.log('Reaction removed');
  } catch (error) {
    console.error('Failed to remove reaction:', error);
  }
}
```

## 🔌 WebSocket

### Подключение

```typescript
import { WebSocketService } from './services/websocket';

const token = localStorage.getItem('token');
const ws = new WebSocketService(token);
```

### Подписка на события

```typescript
// Новое сообщение
ws.on('message', (msg) => {
  console.log('New message:', msg.data);
  // Обновить UI
});

// Пользователь печатает
ws.on('typing', (msg) => {
  console.log(`User ${msg.data.userId} is typing in chat ${msg.data.chatId}`);
  // Показать индикатор
});

// Пользователь онлайн
ws.on('online', (msg) => {
  console.log(`User ${msg.data.userId} is online`);
  // Обновить статус
});

// Пользователь офлайн
ws.on('offline', (msg) => {
  console.log(`User ${msg.data.userId} is offline`);
  // Обновить статус
});

// Все события (wildcard)
ws.on('*', (msg) => {
  console.log('Any event:', msg);
});
```

### Отправка событий

```typescript
// Отправить сообщение
ws.send('message', {
  chatId: 'chat_123',
  content: 'Hello via WebSocket!',
  attachments: []
});

// Отправить индикатор печатания
ws.send('typing', {
  chatId: 'chat_123'
});

// Отметить как прочитанное
ws.send('read', {
  chatId: 'chat_123',
  messageId: 'msg_456'
});
```

### Отписка от событий

```typescript
const handler = (msg) => {
  console.log('Message:', msg);
};

// Подписаться
ws.on('message', handler);

// Отписаться
ws.off('message', handler);
```

### Закрытие соединения

```typescript
ws.disconnect();
```

## 📤 Загрузка файлов

### Загрузка с прогрессом

```typescript
async function uploadFileWithProgress(file: File) {
  try {
    const result = await ApiService.uploadFile(
      '/upload',
      file,
      (progress) => {
        console.log(`Upload progress: ${Math.round(progress)}%`);
        // Обновить progress bar
        updateProgressBar(progress);
      }
    );
    
    console.log('File uploaded:', result);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Загрузка нескольких файлов

```typescript
async function uploadMultipleFiles(files: File[]) {
  const uploadedFiles = [];
  
  for (const file of files) {
    try {
      const result = await ApiService.uploadFile('/upload', file);
      uploadedFiles.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
    }
  }
  
  return uploadedFiles;
}
```

### Загрузка изображений

```typescript
async function uploadImage(imageFile: File) {
  // Проверка типа файла
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Проверка размера (макс 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (imageFile.size > maxSize) {
    throw new Error('Image is too large (max 10MB)');
  }
  
  try {
    const result = await ApiService.uploadFile('/upload', imageFile);
    return result;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
}
```

## 🎨 Работа с темами

### Переключение темы

```typescript
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.classList.remove(currentTheme);
  html.classList.add(newTheme);
  
  // Сохранить в localStorage
  localStorage.setItem('theme', newTheme);
}
```

### Загрузка сохраненной темы

```typescript
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.add(savedTheme);
}

// Вызвать при загрузке приложения
loadTheme();
```

## 🔔 Обработка ошибок

### Централизованная обработка

```typescript
async function handleApiRequest<T>(
  request: () => Promise<T>
): Promise<T | null> {
  try {
    return await request();
  } catch (error) {
    if (error.message.includes('401')) {
      // Неавторизован - выйти
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.message.includes('404')) {
      console.error('Resource not found');
    } else if (error.message.includes('500')) {
      console.error('Server error');
    } else {
      console.error('Request failed:', error);
    }
    return null;
  }
}

// Использование
const chats = await handleApiRequest(() => ApiService.get('/chats'));
```

### Retry логика

```typescript
async function retryRequest<T>(
  request: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await request();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
}

// Использование
const data = await retryRequest(() => ApiService.get('/chats'));
```

## 💾 Кэширование

### Простой кэш

```typescript
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 минут

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new SimpleCache();

async function getCachedChats() {
  const cached = cache.get('chats');
  if (cached) return cached;
  
  const chats = await ApiService.get('/chats');
  cache.set('chats', chats);
  return chats;
}
```

## 🎯 Полный пример: Отправка сообщения

```typescript
async function sendCompleteMessage(
  chatId: string,
  content: string,
  files?: File[]
) {
  try {
    // 1. Показать индикатор загрузки
    setLoading(true);
    
    // 2. Загрузить файлы (если есть)
    let attachments = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploaded = await ApiService.uploadFile(
          '/upload',
          file,
          (progress) => {
            updateUploadProgress(file.name, progress);
          }
        );
        attachments.push(uploaded);
      }
    }
    
    // 3. Отправить сообщение через WebSocket для real-time
    ws.send('message', {
      chatId,
      content,
      attachments
    });
    
    // 4. Отправить через API для надежности
    const message = await ApiService.post(`/chats/${chatId}/messages`, {
      content,
      attachments
    });
    
    // 5. Обновить UI
    addMessageToChat(message);
    
    // 6. Скрыть индикатор загрузки
    setLoading(false);
    
    return message;
  } catch (error) {
    setLoading(false);
    showError('Failed to send message');
    console.error(error);
  }
}
```
