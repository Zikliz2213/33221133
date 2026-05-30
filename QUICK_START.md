# 🚀 Быстрый старт

## За 3 минуты до первого запуска!

### Шаг 1: Клонирование (если из Git)

```bash
git clone <ваш-репозиторий-url>
cd telegram-web-clone
```

### Шаг 2: Установка зависимостей

```bash
npm install
```

**Примечание**: Установится только React и React-DOM. Tailwind CSS и Font Awesome загружаются через CDN.

### Шаг 3: Запуск

```bash
npm run dev
```

Откройте в браузере: **http://localhost:5173**

## ✅ Что вы увидите

1. **Экран авторизации** с:
   - Логотип Telegram
   - Форма входа/регистрации
   - Переключатель между режимами

2. **После входа** (нужен backend):
   - Боковая панель с чатами
   - Окно чата
   - Темная тема по умолчанию

## 🔧 Проблемы?

### "npm не найден"
Установите Node.js: https://nodejs.org/

### "Ошибка при установке"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Белый экран"
Откройте DevTools (F12) → Console, проверьте ошибки

### "Backend не отвечает"
Backend должен работать на:
- HTTP API: `https://pipipupu-production.up.railway.app`
- WebSocket: `wss://pipipupu-production.up.railway.app`

## 📦 Production сборка

```bash
npm run build
```

Результат в `dist/index.html` (~236 KB)

## 🌐 Деплой

### Vercel (самое простое)
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

## 📚 Дальше

- [README.md](README.md) - Полная документация
- [USER_GUIDE.md](USER_GUIDE.md) - Как использовать
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API

## 🎯 Тестовые данные

Для тестирования зарегистрируйте нового пользователя через форму регистрации.

---

**Время запуска**: < 3 минуты  
**Требования**: Node.js 16+  
**Порт**: 5173  

🎉 **Готово к использованию!**
