# Руководство по развертыванию

## 🚀 Быстрый старт

### Требования
- Node.js 16+ 
- npm или yarn
- Современный браузер

### Установка и запуск

```bash
# Клонировать репозиторий
git clone <repository-url>
cd telegram-web-clone

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Открыть в браузере
# http://localhost:5173
```

## 📦 Production сборка

### Сборка проекта

```bash
# Создать production сборку
npm run build

# Результат будет в папке dist/
# - dist/index.html - единый HTML файл со встроенными CSS и JS
```

### Предпросмотр сборки

```bash
# Запустить локальный сервер для предпросмотра
npm run preview

# Открыть в браузере
# http://localhost:4173
```

## 🌐 Развертывание

### Vercel (рекомендуется)

1. Создать аккаунт на [vercel.com](https://vercel.com)
2. Установить Vercel CLI:
```bash
npm i -g vercel
```

3. Развернуть:
```bash
vercel
```

4. Следовать инструкциям в терминале

**Или через веб-интерфейс:**
1. Импортировать Git репозиторий
2. Выбрать Vite фреймворк
3. Нажать Deploy

### Netlify

1. Создать аккаунт на [netlify.com](https://netlify.com)
2. Установить Netlify CLI:
```bash
npm i -g netlify-cli
```

3. Развернуть:
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Или через веб-интерфейс:**
1. Перетащить папку `dist/` в Netlify Drop
2. Или подключить Git репозиторий

### GitHub Pages

1. Установить gh-pages:
```bash
npm install -D gh-pages
```

2. Добавить в package.json:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/telegram-web-clone"
}
```

3. Развернуть:
```bash
npm run deploy
```

### Railway

1. Создать аккаунт на [railway.app](https://railway.app)
2. Создать новый проект
3. Подключить Git репозиторий
4. Railway автоматически определит Vite и развернет

### Render

1. Создать аккаунт на [render.com](https://render.com)
2. Создать новый Static Site
3. Подключить Git репозиторий
4. Настройки:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Docker

Создать `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Собрать и запустить:
```bash
docker build -t telegram-web .
docker run -p 80:80 telegram-web
```

## ⚙️ Конфигурация

### Переменные окружения

Создать файл `.env` в корне проекта:

```env
# Backend URL (если отличается от дефолтного)
VITE_API_URL=https://your-backend-url.com
VITE_WS_URL=wss://your-backend-url.com
```

Использование в коде:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://pipipupu-production.up.railway.app';
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://pipipupu-production.up.railway.app';
```

### Настройка Vite

Файл `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
```

## 🔧 Настройка для разных окружений

### Development

```json
{
  "scripts": {
    "dev": "vite --host",
    "dev:https": "vite --host --https"
  }
}
```

### Staging

```json
{
  "scripts": {
    "build:staging": "vite build --mode staging"
  }
}
```

Создать `.env.staging`:
```env
VITE_API_URL=https://staging-backend.com
VITE_WS_URL=wss://staging-backend.com
```

### Production

```json
{
  "scripts": {
    "build:production": "vite build --mode production"
  }
}
```

## 🌍 Настройка домена

### Custom Domain на Vercel

1. Перейти в настройки проекта
2. Domains → Add Domain
3. Ввести ваш домен
4. Настроить DNS записи у регистратора:
   - Type: `A` → Value: `76.76.21.21`
   - Type: `CNAME` → Value: `cname.vercel-dns.com`

### Custom Domain на Netlify

1. Site settings → Domain management
2. Add custom domain
3. Настроить DNS:
   - Type: `A` → Value: `75.2.60.5`
   - Type: `CNAME` → Value: `yoursitename.netlify.app`

## 📱 PWA (Progressive Web App)

Для превращения в PWA:

1. Установить плагин:
```bash
npm install -D vite-plugin-pwa
```

2. Обновить `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Telegram Web Clone',
        short_name: 'Telegram',
        description: 'Full-featured Telegram Web clone',
        theme_color: '#3390ec',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 🔒 HTTPS и SSL

### Development с HTTPS

```bash
# Создать самоподписанный сертификат
npm install -D @vitejs/plugin-basic-ssl

# В vite.config.ts
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()]
})

# Запустить
npm run dev
```

### Production
- Vercel, Netlify, Railway автоматически предоставляют SSL
- Для собственного сервера: Let's Encrypt

## 📊 Мониторинг и аналитика

### Google Analytics

Добавить в `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Sentry для error tracking

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## 🧪 Тестирование production сборки

### Локальное тестирование

```bash
# Собрать
npm run build

# Запустить локально
npx serve dist

# Или
npm run preview
```

### Проверка производительности

1. Lighthouse в Chrome DevTools
2. [WebPageTest.org](https://www.webpagetest.org/)
3. [GTmetrix](https://gtmetrix.com/)

### Проверка доступности

1. [WAVE](https://wave.webaim.org/)
2. [axe DevTools](https://www.deque.com/axe/devtools/)

## 🔄 CI/CD

### GitHub Actions

Создать `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📦 Оптимизация сборки

### Анализ размера bundle

```bash
# Установить плагин
npm install -D rollup-plugin-visualizer

# В vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});

# Собрать и открыть отчет
npm run build
```

### Code splitting

Vite автоматически делает code splitting, но можно оптимизировать:

```typescript
// Lazy loading компонентов
const ProfileModal = lazy(() => import('./components/ProfileModal'));
const CallModal = lazy(() => import('./components/CallModal'));
```

### Минификация

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
```

## 🛠️ Troubleshooting

### Build fails

```bash
# Очистить кэш
rm -rf node_modules dist
npm install
npm run build
```

### WebSocket не подключается

1. Проверить CORS на бэкенде
2. Убедиться в правильности URL
3. Проверить firewall/proxy настройки

### Белый экран после деплоя

1. Проверить console в DevTools
2. Проверить base path в vite.config.ts
3. Проверить 404 errors

### Медленная загрузка

1. Включить gzip на сервере
2. Использовать CDN
3. Оптимизировать изображения
4. Включить кэширование

## 📞 Поддержка

При возникновении проблем:
1. Проверить логи сборки
2. Проверить browser console
3. Проверить network tab
4. Создать issue в репозитории
