# Подробная инструкция по установке Docker и запуску приложения на Ubuntu

Эта инструкция поможет вам установить Docker на чистую Ubuntu и запустить приложение Sound Link Hub в контейнере.

## Шаг 1: Обновление системы

Сначала обновим список пакетов и установим необходимые утилиты:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
```

## Шаг 2: Установка Docker

### 2.1. Добавление официального GPG ключа Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 2.2. Добавление репозитория Docker

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 2.3. Установка Docker Engine

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2.4. Проверка установки Docker

```bash
sudo docker --version
sudo docker run hello-world
```

Если команды выполнились успешно, Docker установлен правильно!

### 2.5. Добавление текущего пользователя в группу docker (опционально, но рекомендуется)

Это позволит запускать Docker без `sudo`:

```bash
sudo usermod -aG docker $USER
```

**ВАЖНО:** После выполнения этой команды необходимо выйти из системы и войти снова, чтобы изменения вступили в силу. Или выполните:

```bash
newgrp docker
```

Проверьте, что Docker работает без sudo:

```bash
docker run hello-world
```

## Шаг 3: Установка Docker Compose (если не установлен)

Docker Compose обычно устанавливается вместе с Docker, но проверим:

```bash
docker compose version
```

Если команда не найдена, установите отдельно:

```bash
sudo apt install -y docker-compose-plugin
```

## Шаг 4: Подготовка проекта

### 4.1. Клонирование репозитория (если проект еще не скачан)

Если у вас есть Git репозиторий:

```bash
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
cd sound-link-hub-main
```

Если проект уже есть на сервере, просто перейдите в его директорию:

```bash
cd /path/to/sound-link-hub-main
```

### 4.2. Проверка наличия необходимых файлов

Убедитесь, что в директории проекта есть следующие файлы:
- `Dockerfile`
- `docker-compose.yml`
- `package.json`
- `nginx.conf`

## Шаг 5: Сборка и запуск контейнера

### Вариант A: Использование Docker Compose (рекомендуется)

Это самый простой способ:

```bash
# Сборка и запуск контейнера
docker compose up -d --build
```

Флаг `-d` запускает контейнер в фоновом режиме (detached mode).
Флаг `--build` пересобирает образ, если он уже существует.

### Вариант B: Использование Docker напрямую

Если предпочитаете использовать Docker без Compose:

```bash
# Сборка образа
docker build -t sound-link-hub .

# Запуск контейнера
docker run -d -p 8080:80 --name sound-link-hub --restart unless-stopped sound-link-hub
```

## Шаг 6: Проверка работы приложения

### 6.1. Проверка статуса контейнера

```bash
docker ps
```

Вы должны увидеть контейнер `sound-link-hub` в списке запущенных контейнеров.

### 6.2. Просмотр логов

```bash
# Если использовали Docker Compose
docker compose logs -f

# Если использовали Docker напрямую
docker logs -f sound-link-hub
```

### 6.3. Доступ к приложению

Откройте браузер и перейдите по адресу:
- `http://localhost:8080` (если открываете на том же сервере)
- `http://ВАШ_IP_СЕРВЕРА:8080` (если открываете с другого компьютера)

**Важно:** Если вы открываете приложение с другого компьютера, убедитесь, что порт 8080 открыт в файрволе:

```bash
sudo ufw allow 8080/tcp
sudo ufw reload
```

## Шаг 6.5: Запуск в режиме разработки (опционально)

Если вы хотите запустить приложение в режиме разработки с hot-reload (автоматической перезагрузкой при изменении кода):

### Вариант A: Использование Docker Compose

1. Откройте файл `docker-compose.yml` и раскомментируйте секцию `sound-link-hub-dev`
2. Закомментируйте или остановите production контейнер:

```bash
# Остановите production контейнер
docker compose stop sound-link-hub

# Запустите dev контейнер
docker compose up -d --build sound-link-hub-dev
```

### Вариант B: Использование Docker напрямую

```bash
# Сборка dev образа
docker build -f Dockerfile.dev -t sound-link-hub-dev .

# Запуск dev контейнера с монтированием кода
docker run -d -p 8080:8080 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name sound-link-hub-dev \
  --restart unless-stopped \
  sound-link-hub-dev
```

**Примечание:** В режиме разработки изменения в коде будут автоматически применяться благодаря hot-reload Vite.

## Шаг 7: Управление контейнером

### Остановка контейнера

```bash
# Docker Compose
docker compose stop

# Docker напрямую
docker stop sound-link-hub
```

### Запуск остановленного контейнера

```bash
# Docker Compose
docker compose start

# Docker напрямую
docker start sound-link-hub
```

### Перезапуск контейнера

```bash
# Docker Compose
docker compose restart

# Docker напрямую
docker restart sound-link-hub
```

### Остановка и удаление контейнера

```bash
# Docker Compose
docker compose down

# Docker напрямую
docker stop sound-link-hub
docker rm sound-link-hub
```

### Удаление образа

```bash
# Docker Compose (удаляет образы)
docker compose down --rmi all

# Docker напрямую
docker rmi sound-link-hub
```

## Шаг 8: Автозапуск при перезагрузке сервера

Контейнер уже настроен на автозапуск благодаря флагу `--restart unless-stopped` в docker-compose.yml.

Чтобы убедиться, что Docker запускается при загрузке системы:

```bash
sudo systemctl enable docker
sudo systemctl status docker
```

## Дополнительные команды

### Просмотр использования ресурсов

```bash
docker stats
```

### Вход в контейнер (для отладки)

```bash
docker exec -it sound-link-hub sh
```

### Просмотр информации об образе

```bash
docker images
docker inspect sound-link-hub
```

## Решение проблем

### Проблема: "Cannot connect to the Docker daemon"

**Решение:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

Или добавьте пользователя в группу docker (см. Шаг 2.5).

### Проблема: Порт 8080 уже занят

**Решение:** Измените порт в `docker-compose.yml`:
```yaml
ports:
  - "8081:80"  # Вместо 8080 используйте другой порт
```

Или найдите и остановите процесс, использующий порт 8080:
```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

### Проблема: Ошибка при сборке образа

**Решение:** Проверьте логи:
```bash
docker compose build --no-cache
docker compose logs
```

### Проблема: Контейнер не запускается

**Решение:** Проверьте логи:
```bash
docker compose logs sound-link-hub
```

## Обновление приложения

Когда нужно обновить приложение:

```bash
# Остановите текущий контейнер
docker compose down

# Обновите код (если используете Git)
git pull

# Пересоберите и запустите
docker compose up -d --build
```

## Резервное копирование

Для создания резервной копии образа:

```bash
docker save sound-link-hub > sound-link-hub-backup.tar
```

Для восстановления:

```bash
docker load < sound-link-hub-backup.tar
```

---

## Краткая шпаргалка команд

```bash
# Установка Docker
sudo apt update && sudo apt install -y docker.io docker-compose

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker

# Запуск приложения
docker compose up -d --build

# Просмотр логов
docker compose logs -f

# Остановка
docker compose stop

# Перезапуск
docker compose restart

# Удаление
docker compose down
```

---

**Готово!** Ваше приложение должно быть доступно по адресу `http://localhost:8080` или `http://ВАШ_IP:8080`.
