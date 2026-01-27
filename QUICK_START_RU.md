# Быстрый старт - Docker на Ubuntu

## Минимальная установка Docker

```bash
# 1. Обновление системы
sudo apt update && sudo apt upgrade -y

# 2. Установка Docker
sudo apt install -y docker.io docker-compose

# 3. Добавление пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker

# 4. Проверка установки
docker --version
docker run hello-world
```

## Запуск приложения

```bash
# Перейдите в директорию проекта
cd sound-link-hub-main

# Запустите контейнер
docker compose up -d --build

# Проверьте логи
docker compose logs -f
```

## Доступ к приложению

Откройте в браузере: `http://localhost:8080` или `http://ВАШ_IP:8080`

## Основные команды

```bash
# Остановка
docker compose stop

# Запуск
docker compose start

# Перезапуск
docker compose restart

# Остановка и удаление
docker compose down
```

**Подробная инструкция:** См. файл `DOCKER_INSTALLATION_RU.md`
