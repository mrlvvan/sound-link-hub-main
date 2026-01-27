# Запуск приложения без Docker (локальная разработка)

## Вариант 1: Установка Node.js в Windows (рекомендуется)

### Шаг 1: Установите Node.js

1. Скачайте Node.js LTS версию: https://nodejs.org/
2. Установите Node.js (выберите опцию "Add to PATH" при установке)
3. Перезапустите терминал/PowerShell

### Шаг 2: Проверьте установку

Откройте PowerShell или командную строку и выполните:

```powershell
node --version
npm --version
```

Должны отобразиться версии (например, v20.x.x и 10.x.x)

### Шаг 3: Перейдите в директорию проекта

```powershell
cd C:\Users\mrlvv\Desktop\sound-link-hub-main
```

### Шаг 4: Установите зависимости

```powershell
npm install
```

Это может занять несколько минут при первом запуске.

### Шаг 5: Запустите dev-сервер

```powershell
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:8080**

---

## Вариант 2: Использование WSL (Ubuntu)

Если предпочитаете использовать WSL:

### Шаг 1: Откройте Ubuntu (WSL)

В PowerShell выполните:
```powershell
wsl
```

### Шаг 2: Установите Node.js в Ubuntu

```bash
# Обновите систему
sudo apt update

# Установите Node.js через nvm (рекомендуется)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезагрузите терминал или выполните:
source ~/.bashrc

# Установите Node.js LTS
nvm install --lts
nvm use --lts

# Проверьте установку
node --version
npm --version
```

### Шаг 3: Перейдите в директорию проекта

```bash
cd /mnt/c/Users/mrlvv/Desktop/sound-link-hub-main
```

### Шаг 4: Установите зависимости

```bash
npm install
```

### Шаг 5: Запустите dev-сервер

```bash
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:8080**

---

## Полезные команды

### Остановка сервера

Нажмите `Ctrl + C` в терминале где запущен сервер.

### Пересборка приложения

```bash
npm run build
```

Собранные файлы будут в папке `dist/`.

### Просмотр собранного приложения

```bash
npm run preview
```

---

## Решение проблем

### Проблема: "npm не распознан"

**Решение:** 
- Убедитесь, что Node.js установлен
- Перезапустите терминал
- Проверьте PATH: `echo $env:PATH` (PowerShell) или `echo $PATH` (Bash)

### Проблема: Ошибки при установке зависимостей

**Решение:**
```bash
# Очистите кэш npm
npm cache clean --force

# Удалите node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Установите заново
npm install
```

### Проблема: Порт 8080 занят

**Решение:** Измените порт в `vite.config.ts`:

```typescript
server: {
  host: "::",
  port: 3000, // Измените на другой порт
},
```

### Проблема: Медленная установка зависимостей

**Решение:** Используйте yarn вместо npm:

```bash
# Установите yarn
npm install -g yarn

# Используйте yarn
yarn install
yarn dev
```

---

## Преимущества локальной разработки

✅ Быстрая перезагрузка при изменении кода (Hot Module Replacement)
✅ Видите изменения сразу без пересборки Docker
✅ Легче отлаживать код
✅ Не нужно ждать сборки Docker образа

---

## Готово!

После выполнения `npm run dev` откройте браузер и перейдите на **http://localhost:8080**

Вы увидите все изменения адаптивности в реальном времени! 🎉
