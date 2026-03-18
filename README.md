# Sound Link Hub

## 🚀 Запуск приложения с Docker

### Выберите вашу операционную систему:

#### 🪟 Windows
Если у вас Windows и нужно установить WSL и Ubuntu:
- **[Быстрый старт](WSL_QUICK_START_RU.md)** - минимальная инструкция
- **[Подробная инструкция](WSL_UBUNTU_INSTALLATION_RU.md)** - полное руководство по установке WSL, Ubuntu и Docker

#### 🐧 Linux (Ubuntu)
Если у вас уже установлена Ubuntu:
- **[Быстрый старт](QUICK_START_RU.md)** - минимальная инструкция
- **[Подробная инструкция](DOCKER_INSTALLATION_RU.md)** - полное руководство по установке Docker и запуску приложения

---

## 📋 Краткая инструкция

### Windows (с WSL):
```powershell
# 1. Установка WSL и Ubuntu (в PowerShell от администратора)
wsl --install
# Перезагрузите компьютер

# 2. Установите Docker Desktop для Windows
# Скачайте: https://www.docker.com/products/docker-desktop/

# 3. В Ubuntu запустите:
docker compose up -d --build
```

### Linux (Ubuntu):
```bash
# 1. Установка Docker
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker

# 2. Запуск приложения
docker compose up -d --build
```

Приложение будет доступно по адресу: **http://localhost:8080**

---

## 🛠️ Разработка без Docker

Если вы хотите разрабатывать без Docker:

### Требования:
- Node.js 20+ и npm
- [Установка через nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Запуск:

```sh
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev
```

---

## Supabase (регистрация и чат)

Для работы регистрации и чата по заказам/бронированиям нужен Supabase:

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте `.env.example` в `.env` и заполните:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. В Supabase SQL Editor выполните скрипт из `supabase/schema.sql`
4. В Dashboard → Database → Replication включите Realtime для таблиц `order_messages` и `booking_messages`

### Storage для загрузки WAV (биты)

1. Dashboard → **Storage** → **New bucket**
2. Имя: `beats`, включи **Public bucket**
3. После выполнения schema.sql политики загрузки уже применены

---

## 🌐 Деплой на домен

### Вариант 1: Vercel (рекомендуется)

1. Залейте проект на GitHub
2. Зайдите на [vercel.com](https://vercel.com) → **Add New Project** → импортируйте репозиторий
3. Добавьте переменные окружения: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Нажмите **Deploy**
5. **Домен:** Settings → Domains → Add → ваш домен

### Вариант 2: Netlify

1. Залейте на GitHub
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`, Publish directory: `dist`
4. В **Environment variables** добавьте Supabase-переменные
5. **Домен:** Domain settings → Add custom domain

### Вариант 3: Cloudflare Pages

1. Залейте на GitHub
2. [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create project** → **Connect to Git**
3. Build: `npm run build`, Output: `dist`
4. В **Settings → Environment variables** добавьте Supabase-переменные
5. **Домен:** Custom domains → Add

---

## 📚 Технологии

- **Vite** - сборщик
- **TypeScript** - язык программирования
- **React** - UI библиотека
- **shadcn-ui** - компоненты UI
- **Tailwind CSS** - стилизация
- **Docker** - контейнеризация

---

## 📖 Дополнительная информация

- [Lovable Project](https://lovable.dev/projects/4711cf78-a85f-42e3-8899-f329958b06f5)
- [Lovable Documentation](https://docs.lovable.dev/)
