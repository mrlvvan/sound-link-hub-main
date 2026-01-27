# Быстрый старт: WSL + Ubuntu + Docker на Windows

## Минимальная установка (3 шага)

### 1. Установка WSL и Ubuntu

Откройте PowerShell **от имени администратора** (`Win + X` → PowerShell (администратор)):

```powershell
wsl --install
```

**Перезагрузите компьютер** после выполнения команды.

После перезагрузки откроется Ubuntu - создайте пользователя (имя и пароль).

### 2. Установка Docker Desktop

1. Скачайте: https://www.docker.com/products/docker-desktop/
2. Установите Docker Desktop
3. При установке отметьте "Use WSL 2 based engine"
4. Запустите Docker Desktop
5. Settings → Resources → WSL Integration → включите Ubuntu

### 3. Запуск приложения

Откройте Ubuntu (через меню Пуск или `wsl` в PowerShell):

```bash
# Перейдите в директорию проекта
cd ~/sound-link-hub-main
# или если проект на рабочем столе Windows:
cd /mnt/c/Users/ВАШЕ_ИМЯ/Desktop/sound-link-hub-main

# Запустите контейнер
docker compose up -d --build

# Проверьте логи
docker compose logs -f
```

## Доступ к приложению

Откройте в браузере Windows: `http://localhost:8080`

## Основные команды

```bash
# Остановка контейнера
docker compose stop

# Запуск контейнера
docker compose start

# Перезапуск
docker compose restart

# Остановка и удаление
docker compose down
```

**Подробная инструкция:** См. файл `WSL_UBUNTU_INSTALLATION_RU.md`
