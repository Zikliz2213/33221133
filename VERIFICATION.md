# Проверка целостности проекта

## ✅ Список всех необходимых файлов

### Корневые файлы проекта

- [x] `index.html` - HTML шаблон
- [x] `package.json` - NPM зависимости
- [x] `tsconfig.json` - TypeScript конфигурация
- [x] `vite.config.ts` - Vite конфигурация
- [x] `.gitignore` - Git ignore правила

### Исходный код (src/)

#### Главные файлы
- [x] `src/main.tsx` - Точка входа приложения
- [x] `src/App.tsx` - Корневой компонент
- [x] `src/index.css` - Глобальные стили

#### Компоненты (src/components/)
- [x] `src/components/AuthScreen.tsx` - Авторизация/Регистрация
- [x] `src/components/MainScreen.tsx` - Главный экран
- [x] `src/components/Sidebar.tsx` - Боковая панель
- [x] `src/components/ChatWindow.tsx` - Окно чата
- [x] `src/components/ProfileModal.tsx` - Профиль
- [x] `src/components/CallModal.tsx` - Звонки
- [x] `src/components/EmojiPicker.tsx` - Emoji picker

#### Сервисы (src/services/)
- [x] `src/services/api.ts` - HTTP API клиент
- [x] `src/services/websocket.ts` - WebSocket клиент

#### Типы (src/types/)
- [x] `src/types/index.ts` - TypeScript интерфейсы

#### Утилиты (src/utils/)
- [x] `src/utils/cn.ts` - Утилиты

### Документация

- [x] `README.md` - Основная документация
- [x] `API_DOCUMENTATION.md` - API документация
- [x] `FEATURES.md` - Описание функционала
- [x] `DEPLOYMENT.md` - Руководство по деплою
- [x] `USAGE_EXAMPLES.md` - Примеры использования
- [x] `ROADMAP.md` - План развития
- [x] `TECH_SPEC.md` - Техническая спецификация
- [x] `USER_GUIDE.md` - Руководство пользователя
- [x] `PROJECT_SUMMARY.md` - Краткое резюме
- [x] `QUICK_REFERENCE.md` - Быстрая справка
- [x] `CHANGELOG.md` - История изменений
- [x] `FILES_OVERVIEW.md` - Обзор файлов
- [x] `GIT_SETUP.md` - Git инструкции
- [x] `VERIFICATION.md` - Этот файл

## 🔍 Команды для проверки

### 1. Проверка наличия всех файлов

```bash
# Проверить структуру src/
ls -R src/

# Должно показать:
# src/:
# App.tsx  components/  index.css  main.tsx  services/  types/  utils/
# 
# src/components:
# AuthScreen.tsx  CallModal.tsx  ChatWindow.tsx  EmojiPicker.tsx  MainScreen.tsx  ProfileModal.tsx  Sidebar.tsx
#
# src/services:
# api.ts  websocket.ts
#
# src/types:
# index.ts
#
# src/utils:
# cn.ts
```

### 2. Проверка содержимого файлов

```bash
# Проверить что main.tsx не пустой
cat src/main.tsx

# Проверить что App.tsx не пустой
cat src/App.tsx

# Проверить package.json
cat package.json
```

### 3. Проверка зависимостей

```bash
# Установить зависимости
npm install

# Должно успешно завершиться без ошибок
```

### 4. Проверка TypeScript

```bash
# Проверка типов (если есть)
npx tsc --noEmit

# Или просто попробовать собрать
npm run build
```

### 5. Проверка запуска

```bash
# Запустить dev сервер
npm run dev

# Должно запуститься на http://localhost:5173
# Откройте в браузере и проверьте что загружается
```

## 📊 Проверка размеров файлов

### Ожидаемые размеры

```bash
# Проверить размеры
du -h src/components/*.tsx
du -h src/services/*.ts

# Примерные размеры:
# src/components/AuthScreen.tsx     ~4K
# src/components/MainScreen.tsx     ~5K
# src/components/Sidebar.tsx        ~8K
# src/components/ChatWindow.tsx     ~10K
# src/components/ProfileModal.tsx   ~6K
# src/components/CallModal.tsx      ~7K
# src/components/EmojiPicker.tsx    ~2K
# src/services/api.ts               ~3K
# src/services/websocket.ts         ~3K
```

## 🧪 Функциональные тесты

### 1. Тест авторизации

```bash
# Запустить приложение
npm run dev

# Открыть http://localhost:5173
# Должен показаться экран авторизации с:
# - Логотип Telegram
# - Поля для ввода
# - Кнопка "Войти"
# - Ссылка "Нет аккаунта? Зарегистрируйтесь"
```

### 2. Тест компонентов

Проверьте что каждый компонент импортируется без ошибок:

```javascript
// В browser console после запуска dev сервера
// Не должно быть ошибок импорта
```

### 3. Тест сборки

```bash
# Собрать проект
npm run build

# Должно создать dist/index.html
ls -lh dist/

# Размер должен быть около 236-260 KB
```

## 🔧 Исправление проблем

### Проблема: "Cannot find module './App'"

**Решение**:
```bash
# Проверить что файл существует
ls src/App.tsx

# Если нет, файл был потерян
# Восстановите из бэкапа или пересоздайте
```

### Проблема: "src/main.tsx not found"

**Решение**:
```bash
# Убедитесь что файл существует
cat src/main.tsx

# Содержимое должно быть:
# import { StrictMode } from "react";
# import { createRoot } from "react-dom/client";
# import "./index.css";
# import App from "./App";
# 
# createRoot(document.getElementById("root")!).render(
#   <StrictMode>
#     <App />
#   </StrictMode>
# );
```

### Проблема: TypeScript ошибки

**Решение**:
```bash
# Удалить node_modules и переустановить
rm -rf node_modules package-lock.json
npm install

# Попробовать снова
npm run build
```

### Проблема: "Module not found"

**Решение**:
```bash
# Проверить пути импорта в файлах
# Все импорты должны использовать относительные пути:
# import { ApiService } from '../services/api';
# import { Sidebar } from './Sidebar';
```

## ✅ Финальный чеклист

Перед деплоем проверьте:

### Файлы
- [ ] Все файлы в src/ существуют
- [ ] package.json содержит правильные зависимости
- [ ] tsconfig.json настроен
- [ ] vite.config.ts настроен
- [ ] index.html содержит корректный HTML

### Сборка
- [ ] `npm install` выполняется без ошибок
- [ ] `npm run build` создает dist/index.html
- [ ] Размер dist/index.html ~236-260 KB
- [ ] `npm run dev` запускает сервер
- [ ] Приложение открывается в браузере

### Функционал
- [ ] Показывается экран авторизации
- [ ] Нет ошибок в browser console
- [ ] Нет TypeScript ошибок
- [ ] Все стили применяются (Tailwind работает)

### Git
- [ ] Все файлы добавлены в Git
- [ ] .gitignore настроен правильно
- [ ] node_modules НЕ в репозитории
- [ ] dist/ НЕ в репозитории

## 📋 Автоматическая проверка

Создайте скрипт `verify.sh`:

```bash
#!/bin/bash

echo "🔍 Проверка проекта Telegram Web Clone..."
echo ""

# Проверка файлов
echo "📁 Проверка файлов..."
files=(
  "src/main.tsx"
  "src/App.tsx"
  "src/index.css"
  "src/components/AuthScreen.tsx"
  "src/components/MainScreen.tsx"
  "src/components/Sidebar.tsx"
  "src/components/ChatWindow.tsx"
  "src/components/ProfileModal.tsx"
  "src/components/CallModal.tsx"
  "src/components/EmojiPicker.tsx"
  "src/services/api.ts"
  "src/services/websocket.ts"
  "src/types/index.ts"
  "package.json"
  "index.html"
)

missing_files=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - ОТСУТСТВУЕТ!"
    missing_files=$((missing_files + 1))
  fi
done

echo ""
if [ $missing_files -eq 0 ]; then
  echo "✅ Все файлы на месте!"
else
  echo "❌ Отсутствует файлов: $missing_files"
  exit 1
fi

# Проверка node_modules
echo ""
echo "📦 Проверка зависимостей..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules существует"
else
  echo "⚠️  node_modules не найден, устанавливаем..."
  npm install
fi

# Проверка сборки
echo ""
echo "🔨 Проверка сборки..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Сборка успешна!"
  
  # Проверка размера
  if [ -f "dist/index.html" ]; then
    size=$(du -h dist/index.html | cut -f1)
    echo "📊 Размер: $size"
  fi
else
  echo "❌ Ошибка сборки!"
  exit 1
fi

echo ""
echo "🎉 Все проверки пройдены успешно!"
```

Запустить:
```bash
chmod +x verify.sh
./verify.sh
```

## 📞 Поддержка

Если проверка не проходит:

1. Проверьте версии:
   ```bash
   node --version  # Должно быть >= 16
   npm --version   # Должно быть >= 7
   ```

2. Очистите кэш:
   ```bash
   rm -rf node_modules package-lock.json dist
   npm install
   npm run build
   ```

3. Проверьте логи:
   ```bash
   npm run build 2>&1 | tee build.log
   cat build.log
   ```

4. Проверьте права доступа:
   ```bash
   ls -la src/
   chmod -R 755 src/
   ```

## ✨ Все в порядке!

Если все проверки пройдены:

```
✅ Файлы: OK
✅ Зависимости: OK  
✅ Сборка: OK
✅ Размер: OK
✅ Запуск: OK

🚀 Готово к деплою!
```

---

**Последняя проверка**: 2024-01-15  
**Статус**: ✅ Все файлы на месте  
**Размер сборки**: ~236 KB (71 KB gzipped)
