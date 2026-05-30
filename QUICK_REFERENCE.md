# Быстрая справка

## 🚀 Команды

```bash
npm install          # Установка зависимостей
npm run dev         # Запуск dev сервера (localhost:5173)
npm run build       # Production сборка
npm run preview     # Предпросмотр сборки
```

## 🔗 URLs

- **API**: https://pipipupu-production.up.railway.app
- **WebSocket**: wss://pipipupu-production.up.railway.app
- **Dev Server**: http://localhost:5173

## 📁 Структура проекта

```
telegram-web-clone/
├── src/
│   ├── components/         # React компоненты
│   │   ├── AuthScreen.tsx
│   │   ├── MainScreen.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── ProfileModal.tsx
│   │   ├── CallModal.tsx
│   │   └── EmojiPicker.tsx
│   ├── services/          # API сервисы
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── types/             # TypeScript типы
│   │   └── index.ts
│   ├── App.tsx            # Главный компонент
│   └── main.tsx           # Точка входа
├── index.html             # HTML шаблон
└── vite.config.ts         # Vite конфигурация
```

## 🎯 Ключевые компоненты

| Компонент | Описание |
|-----------|----------|
| `AuthScreen` | Вход/регистрация |
| `MainScreen` | Основной экран мессенджера |
| `Sidebar` | Список чатов и поиск |
| `ChatWindow` | Окно чата с сообщениями |
| `ProfileModal` | Профиль пользователя |
| `CallModal` | Аудио/видео звонки |
| `EmojiPicker` | Выбор эмодзи |

## 🔌 API Endpoints

### Auth
```
POST /auth/register    # Регистрация
POST /auth/login       # Вход
GET  /auth/me          # Текущий пользователь
```

### Chats
```
GET  /chats                      # Список чатов
POST /chats                      # Создать чат
GET  /chats/:id/messages         # Сообщения
POST /chats/:id/messages         # Отправить сообщение
```

### Channels
```
POST /channels                   # Создать канал
POST /channels/:id/subscribe     # Подписаться
POST /channels/:id/unsubscribe   # Отписаться
```

### Other
```
GET  /search?q=...              # Поиск
GET  /users/search?q=...        # Поиск пользователей
POST /upload                     # Загрузка файлов
POST /messages/:id/reactions    # Добавить реакцию
```

## 📡 WebSocket Events

### Отправка
```javascript
ws.send('message', { chatId, content, attachments })
ws.send('typing', { chatId })
ws.send('read', { chatId, messageId })
```

### Получение
```javascript
ws.on('message', handler)   // Новое сообщение
ws.on('typing', handler)    // Печатает
ws.on('online', handler)    // Онлайн
ws.on('offline', handler)   // Офлайн
```

## 🎨 Tailwind Colors

```javascript
tg-primary: '#3390ec'         // Синий Telegram
tg-dark-bg: '#212121'         // Темный фон
tg-dark-secondary: '#181818'  // Вторичный темный
tg-dark-chat: '#0e0e0e'       // Фон чата темный
tg-light-bg: '#ffffff'        // Светлый фон
tg-light-secondary: '#f4f4f5' // Вторичный светлый
tg-light-chat: '#fafafa'      // Фон чата светлый
```

## 💾 LocalStorage

```javascript
token        // JWT токен
theme        // 'dark' | 'light'
```

## 🔐 Аутентификация

```javascript
// Сохранить токен
localStorage.setItem('token', token);
ApiService.setToken(token);

// Получить токен
const token = localStorage.getItem('token');

// Выход
localStorage.removeItem('token');
ApiService.setToken(null);
```

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1023px
Desktop: ≥ 1024px
```

## 🎯 Горячие клавиши

| Клавиша | Действие |
|---------|----------|
| `Enter` | Отправить сообщение |
| `Shift+Enter` | Новая строка |
| `Esc` | Закрыть модальное окно |

## 🐛 Troubleshooting

### Проблема: Не собирается
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Проблема: Не подключается WebSocket
- Проверить URL
- Проверить токен
- Проверить CORS

### Проблема: Не работают звонки
- Разрешить доступ к камере/микрофону
- Использовать HTTPS
- Попробовать Chrome

## 📊 Метрики

- **Размер**: 259 KB (76 KB gzipped)
- **Компонентов**: 7+
- **Endpoints**: 15+
- **WS Events**: 4+

## 🔗 Полезные ссылки

- [README.md](README.md) - Основная документация
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API документация
- [USER_GUIDE.md](USER_GUIDE.md) - Руководство пользователя
- [DEPLOYMENT.md](DEPLOYMENT.md) - Гайд по деплою

## 💡 Быстрые советы

1. **Разработка**: Используйте `npm run dev` для hot reload
2. **Отладка**: Откройте DevTools → Network → WS для WebSocket
3. **Тестирование**: Откройте в нескольких вкладках для тестирования real-time
4. **Производительность**: Используйте React DevTools Profiler

## 🎨 Кастомизация

### Изменить цвета
Отредактируйте в `index.html`:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'tg-primary': '#your-color',
        // ...
      }
    }
  }
}
```

### Изменить backend URL
Отредактируйте в `src/services/api.ts` и `src/services/websocket.ts`:
```typescript
const API_URL = 'https://your-backend.com';
const WS_URL = 'wss://your-backend.com';
```

## 🚀 Быстрый деплой

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## 📈 Следующие шаги

1. ✅ Запустить проект локально
2. ✅ Изучить код компонентов
3. ✅ Протестировать функционал
4. ✅ Прочитать документацию
5. 🔄 Добавить свои фичи
6. 🚀 Задеплоить

## 🎓 Обучающие ресурсы

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Tailwind**: https://tailwindcss.com
- **WebSocket**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- **WebRTC**: https://webrtc.org

---

**Удачи в разработке! 🚀**
