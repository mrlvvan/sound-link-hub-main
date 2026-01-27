# Многоэтапная сборка для оптимизации размера образа
FROM node:20-alpine AS builder

# Установка необходимых инструментов для сборки нативных модулей
RUN apk add --no-cache python3 make g++

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./

# Установка зависимостей с подробным выводом
RUN npm install --verbose || npm install --legacy-peer-deps

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Production образ
FROM nginx:alpine

# Копирование собранных файлов из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx (если нужна кастомная)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
