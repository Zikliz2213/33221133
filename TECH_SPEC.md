# Техническая спецификация

## 🏗️ Архитектура

### Общая структура
```
┌─────────────────────────────────────────┐
│         Frontend (React + TS)           │
│  ┌───────────────────────────────────┐  │
│  │      UI Components Layer          │  │
│  │  (AuthScreen, MainScreen, etc.)   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Business Logic Layer         │  │
│  │  (State Management, WebSocket)    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      API Service Layer            │  │
│  │   (HTTP Client, WS Client)        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
        ┌───────────────────────┐
        │   Network Layer       │
        │  (HTTP + WebSocket)   │
        └───────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      Backend (Railway Platform)         │
│  - REST API (Express/Fastify)           │
│  - WebSocket Server                     │
│  - Database (PostgreSQL/MongoDB)        │
│  - File Storage (S3/CloudFlare)         │
└─────────────────────────────────────────┘
```

## 📦 Компоненты

### Core Components

#### App.tsx
- **Назначение**: Корневой компонент приложения
- **Ответственность**:
  - Проверка аутентификации
  - Инициализация WebSocket
  - Роутинг между Auth и Main экранами
- **State**: 
  - `isAuthenticated: boolean`
  - `currentUser: User | null`
  - `loading: boolean`

#### AuthScreen.tsx
- **Назначение**: Экран авторизации/регистрации
- **Props**:
  - `onLogin: (token: string) => void`
- **State**:
  - `isLogin: boolean`
  - `formData: FormData`
  - `error: string`
  - `loading: boolean`

#### MainScreen.tsx
- **Назначение**: Главный экран мессенджера
- **Props**:
  - `currentUser: User`
  - `onLogout: () => void`
  - `wsService: WebSocketService`
- **State**:
  - `selectedChat: Chat | null`
  - `chats: Chat[]`
  - `messages: Message[]`
  - `showProfile: boolean`
  - `showCall: boolean`
  - `theme: 'light' | 'dark'`

#### Sidebar.tsx
- **Назначение**: Боковая панель с чатами
- **Props**: Множество (см. код)
- **State**:
  - `searchQuery: string`
  - `activeFolder: 'all' | 'chats' | 'channels'`
  - `searchResults: any[]`

#### ChatWindow.tsx
- **Назначение**: Окно чата с сообщениями
- **Props**: Chat, messages, handlers
- **State**:
  - `messageText: string`
  - `showEmojiPicker: boolean`
  - `attachments: File[]`
  - `isTyping: boolean`

#### ProfileModal.tsx
- **Назначение**: Модальное окно профиля
- **Props**: user, onClose, onLogout
- **State**:
  - `isEditing: boolean`
  - `formData: FormData`
  - `avatarFile: File | null`

#### CallModal.tsx
- **Назначение**: Окно звонков
- **Props**: chat, type, onClose
- **State**:
  - `callStatus: 'calling' | 'connected' | 'ended'`
  - `isMuted: boolean`
  - `isVideoOff: boolean`
  - `callDuration: number`

## 🔧 Services

### ApiService

**Файл**: `src/services/api.ts`

**Методы**:
```typescript
class ApiService {
  static setToken(token: string | null): void
  static request(endpoint: string, options?: RequestInit): Promise<any>
  static get(endpoint: string): Promise<any>
  static post(endpoint: string, data: any): Promise<any>
  static put(endpoint: string, data: any): Promise<any>
  static delete(endpoint: string): Promise<any>
  static uploadFile(
    endpoint: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<any>
}
```

**Особенности**:
- Автоматическая установка Authorization header
- Обработка ошибок
- JSON автопарсинг
- XMLHttpRequest для загрузки файлов с прогрессом

### WebSocketService

**Файл**: `src/services/websocket.ts`

**Методы**:
```typescript
class WebSocketService {
  constructor(token: string)
  on(type: string, handler: WSMessageHandler): void
  off(type: string, handler: WSMessageHandler): void
  send(type: string, data: any): void
  disconnect(): void
}
```

**Особенности**:
- Автоматическое переподключение (exponential backoff)
- Event-based архитектура
- Wildcard handlers ('*')
- Graceful disconnect

## 📊 Data Flow

### Отправка сообщения

```
User Input
    ↓
ChatWindow.handleSend()
    ↓
MainScreen.handleSendMessage()
    ├─→ ApiService.uploadFile() (если есть файлы)
    ├─→ WebSocketService.send('message')
    └─→ ApiService.post('/chats/:id/messages')
    ↓
Update local state
    ↓
UI Update
```

### Получение сообщения

```
Backend WebSocket
    ↓
WebSocketService.handleMessage()
    ↓
Trigger registered handlers
    ↓
MainScreen.handleNewMessage()
    ↓
Update messages state
    ↓
ChatWindow re-render
```

## 🗄️ State Management

### Local Component State
- Используется `useState` для компонентного состояния
- `useRef` для DOM refs и mutable values
- `useEffect` для side effects

### Global State
- Пропсы передаются через компоненты
- Можно добавить Context API или Zustand

### Persistent State
- `localStorage` для токена
- `localStorage` для темы
- Можно добавить IndexedDB для кэша

## 🌐 Network Layer

### HTTP Requests

**Base URL**: `https://pipipupu-production.up.railway.app`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Error Handling**:
- Network errors → retry
- 401 → logout
- 404 → show not found
- 500 → show error message

### WebSocket Connection

**URL**: `wss://pipipupu-production.up.railway.app?token=<token>`

**Reconnection Strategy**:
```javascript
delay = min(1000 * 2^attempt, 30000)
maxAttempts = 5
```

**Message Format**:
```json
{
  "type": "message" | "typing" | "read" | "online" | "offline",
  "data": { ... }
}
```

## 🎨 Styling

### Tailwind CSS
- Используется CDN версия
- Custom theme configuration в index.html
- Dark mode: class-based

### Custom Styles
```css
.scrollbar-thin - тонкий скроллбар
.message-bubble - стили сообщения
.emoji-picker - стили emoji picker
.chat-item - стили элемента чата
.typing-indicator - анимация "печатает"
.slide-in - анимация появления
```

### Theme Colors
```javascript
'tg-primary': '#3390ec',
'tg-dark-bg': '#212121',
'tg-dark-secondary': '#181818',
'tg-dark-chat': '#0e0e0e',
'tg-light-bg': '#ffffff',
'tg-light-secondary': '#f4f4f5',
'tg-light-chat': '#fafafa',
```

## 📱 Responsive Design

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1023px`
- Desktop: `≥ 1024px`

### Adaptive Elements
- Sidebar width: `w-full md:w-96`
- Hide elements on mobile: `hidden md:block`
- Touch-friendly buttons: min-height 44px

## 🔐 Security

### Authentication Flow
1. User enters credentials
2. POST /auth/login or /auth/register
3. Receive JWT token
4. Store in localStorage
5. Include in all requests
6. Verify on each app load

### Token Management
```typescript
// Set token
localStorage.setItem('token', token);
ApiService.setToken(token);

// Get token
const token = localStorage.getItem('token');

// Remove token (logout)
localStorage.removeItem('token');
ApiService.setToken(null);
```

### Secure Practices
- HTTPS only
- No sensitive data in localStorage
- Token expiration handling
- XSS protection (React default)
- CSRF protection (backend)

## 📊 Performance

### Bundle Size
- Current: ~259 KB (76 KB gzipped)
- Target: < 300 KB total

### Load Time
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

### Optimizations
- Single file build (vite-plugin-singlefile)
- Minification (Terser)
- Tree shaking (Vite default)
- Code splitting (можно добавить)

### Runtime Performance
- Virtual scrolling (TODO)
- Debounced search
- Memoization (TODO)
- Lazy loading (TODO)

## 🧪 Testing Strategy

### Unit Tests (TODO)
- Component tests
- Service tests
- Utility functions

### Integration Tests (TODO)
- API integration
- WebSocket integration
- User flows

### E2E Tests (TODO)
- Login flow
- Send message flow
- Create chat flow

## 📈 Monitoring

### Metrics to Track
- User sessions
- Message volume
- API response times
- WebSocket connections
- Error rates
- Feature usage

### Tools (можно добавить)
- Google Analytics
- Sentry (errors)
- LogRocket (session replay)
- Performance API

## 🔄 Data Synchronization

### Optimistic Updates
```typescript
// Add message to UI immediately
setMessages([...messages, tempMessage]);

// Send to server
try {
  const savedMessage = await api.post(...);
  // Replace temp with real
  updateMessage(tempMessage.id, savedMessage);
} catch (error) {
  // Remove temp message
  removeMessage(tempMessage.id);
  showError();
}
```

### Conflict Resolution
- Last write wins
- Server is source of truth
- Local cache for offline

## 🚀 Build & Deploy

### Build Process
```bash
npm run build
├─ TypeScript compilation
├─ Vite bundling
├─ CSS processing
├─ Minification
└─ Single file output
```

### Environment Variables
```
VITE_API_URL - Backend API URL
VITE_WS_URL - WebSocket URL
```

### CI/CD (можно настроить)
```yaml
- Lint
- Type check
- Build
- Test
- Deploy
```

## 📚 Dependencies

### Production
- react: ^18.x
- react-dom: ^18.x

### Development
- typescript: ^5.x
- vite: ^7.x
- @vitejs/plugin-react: ^4.x
- tailwindcss: CDN

### External
- Font Awesome: CDN
- Tailwind CSS: CDN

## 🎯 Browser Support

### Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features requiring modern browsers
- WebSocket
- MediaDevices API (calls)
- File API
- Fetch API
- ES2020+

## 📝 Coding Standards

### TypeScript
- Strict mode enabled
- Explicit types preferred
- Any type discouraged

### React
- Functional components
- Hooks for state
- Props validation

### Naming
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_CASE
- Files: PascalCase for components

### File Organization
```
src/
├── components/     # React components
├── services/       # API, WebSocket
├── types/          # TypeScript types
├── utils/          # Utility functions
└── App.tsx         # Root component
```

## 🔧 Development Tools

### Recommended
- VS Code
- ESLint extension
- Prettier extension
- TypeScript IntelliSense

### Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```
