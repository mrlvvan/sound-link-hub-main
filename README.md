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
