# Git Setup - Инструкции по работе с репозиторием

## 📦 Инициализация Git репозитория

Если вы еще не инициализировали Git репозиторий, выполните:

```bash
# Инициализация репозитория
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: Telegram Web Clone v1.0.0"
```

## 🔗 Подключение к удаленному репозиторию

### GitHub

```bash
# Создайте новый репозиторий на GitHub, затем:
git remote add origin https://github.com/YOUR_USERNAME/telegram-web-clone.git
git branch -M main
git push -u origin main
```

### GitLab

```bash
git remote add origin https://gitlab.com/YOUR_USERNAME/telegram-web-clone.git
git branch -M main
git push -u origin main
```

### Bitbucket

```bash
git remote add origin https://bitbucket.org/YOUR_USERNAME/telegram-web-clone.git
git branch -M main
git push -u origin main
```

## 📋 Проверка перед коммитом

Убедитесь, что все исходные файлы добавлены:

```bash
# Проверить статус
git status

# Должны быть добавлены:
# - src/ (все файлы)
# - index.html
# - package.json
# - tsconfig.json
# - vite.config.ts
# - Все .md файлы
# - .gitignore
```

## 📁 Структура файлов для Git

### ✅ Обязательно должны быть в репозитории:

```
✅ src/
   ✅ components/
      ✅ AuthScreen.tsx
      ✅ MainScreen.tsx
      ✅ Sidebar.tsx
      ✅ ChatWindow.tsx
      ✅ ProfileModal.tsx
      ✅ CallModal.tsx
      ✅ EmojiPicker.tsx
   ✅ services/
      ✅ api.ts
      ✅ websocket.ts
   ✅ types/
      ✅ index.ts
   ✅ utils/
      ✅ cn.ts
   ✅ App.tsx
   ✅ main.tsx
   ✅ index.css
✅ index.html
✅ package.json
✅ tsconfig.json
✅ vite.config.ts
✅ .gitignore
✅ README.md
✅ (все остальные .md файлы)
```

### ❌ НЕ должны быть в репозитории:

```
❌ node_modules/
❌ dist/
❌ .env
❌ .env.local
❌ *.log
```

## 🔍 Проверка содержимого src/

Выполните для проверки:

```bash
# Показать все файлы в src/
find src -type f

# Должно показать:
# src/App.tsx
# src/main.tsx
# src/index.css
# src/components/AuthScreen.tsx
# src/components/MainScreen.tsx
# src/components/Sidebar.tsx
# src/components/ChatWindow.tsx
# src/components/ProfileModal.tsx
# src/components/CallModal.tsx
# src/components/EmojiPicker.tsx
# src/services/api.ts
# src/services/websocket.ts
# src/types/index.ts
# src/utils/cn.ts
```

## 🚀 После первого push

### Автоматический деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Импортируйте ваш Git репозиторий
4. Vercel автоматически определит Vite
5. Нажмите "Deploy"

### Автоматический деплой на Netlify

1. Зайдите на [netlify.com](https://netlify.com)
2. Нажмите "Add new site" → "Import an existing project"
3. Выберите Git provider
4. Выберите репозиторий
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Нажмите "Deploy"

## 🔄 Workflow для разработки

### Добавление новых изменений

```bash
# Проверить что изменилось
git status

# Добавить все изменения
git add .

# Или добавить конкретные файлы
git add src/components/NewComponent.tsx

# Создать коммит с описанием
git commit -m "Add new feature: ..."

# Отправить на GitHub
git push
```

### Создание веток для фич

```bash
# Создать новую ветку
git checkout -b feature/new-feature

# Работать над фичей...
git add .
git commit -m "Implement new feature"

# Отправить ветку
git push -u origin feature/new-feature

# Создать Pull Request на GitHub
```

## 📝 Рекомендуемые commit messages

Используйте понятные сообщения:

```bash
# Новая функция
git commit -m "feat: add voice messages support"

# Исправление бага
git commit -m "fix: resolve WebSocket reconnection issue"

# Улучшение UI
git commit -m "ui: improve chat window design"

# Документация
git commit -m "docs: update API documentation"

# Рефакторинг
git commit -m "refactor: optimize message rendering"

# Тесты
git commit -m "test: add unit tests for ApiService"
```

## 🏷️ Создание релизов

### Создание тега версии

```bash
# Создать тег
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"

# Отправить тег
git push origin v1.0.0

# Или отправить все теги
git push --tags
```

### Создание релиза на GitHub

1. Перейдите в раздел "Releases"
2. Нажмите "Create a new release"
3. Выберите тег v1.0.0
4. Заполните описание из CHANGELOG.md
5. Опционально: прикрепите dist/index.html
6. Нажмите "Publish release"

## 🔧 Troubleshooting

### Проблема: "src/main.tsx not found"

```bash
# Убедитесь что файл существует
ls -la src/main.tsx

# Если файла нет, проверьте что он был добавлен в Git
git ls-files | grep main.tsx

# Если не добавлен, добавьте явно
git add src/main.tsx
git commit -m "Add missing main.tsx"
git push
```

### Проблема: "node_modules in repository"

```bash
# Удалить node_modules из Git (но не с диска)
git rm -r --cached node_modules
git commit -m "Remove node_modules from repository"
git push
```

### Проблема: Большой размер репозитория

```bash
# Проверить размер
du -sh .git

# Очистить историю (осторожно!)
git gc --aggressive --prune=now
```

## 📊 GitHub Actions (опционально)

Создайте `.github/workflows/deploy.yml`:

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

## 📦 .gitattributes (опционально)

Создайте `.gitattributes` для нормализации line endings:

```
* text=auto
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.css text eol=lf
*.html text eol=lf
```

## ✅ Финальный чеклист

Перед push убедитесь:

- [x] Все файлы в `src/` добавлены
- [x] `package.json` и `package-lock.json` добавлены
- [x] `.gitignore` настроен правильно
- [x] `node_modules/` НЕ в репозитории
- [x] `dist/` НЕ в репозитории
- [x] README.md и документация добавлены
- [x] Проект собирается (`npm run build`)
- [x] Проект запускается локально (`npm run dev`)

## 🎉 Готово!

После выполнения всех шагов ваш репозиторий готов к использованию!

```bash
# Финальная проверка
git log --oneline
git remote -v
git branch -a
```

---

**Следующие шаги**:
1. ✅ Push в GitHub/GitLab
2. ✅ Настройка CI/CD
3. ✅ Деплой на Vercel/Netlify
4. ✅ Добавить badges в README
5. ✅ Пригласить contributors
