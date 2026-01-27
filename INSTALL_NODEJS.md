# Установка Node.js в Windows

## Быстрая установка

### Шаг 1: Скачайте Node.js

1. Откройте браузер и перейдите на: **https://nodejs.org/**
2. Скачайте **LTS версию** (рекомендуется, например v20.x.x)
3. Запустите установщик `.msi` файл

### Шаг 2: Установите Node.js

1. В установщике нажмите "Next"
2. **ВАЖНО:** Убедитесь, что отмечена опция **"Add to PATH"** или **"Automatically install the necessary tools"**
3. Нажмите "Install"
4. Дождитесь завершения установки
5. Нажмите "Finish"

### Шаг 3: Перезапустите терминал

**ОБЯЗАТЕЛЬНО:** Закройте текущий терминал/PowerShell и откройте новый!

Или в текущем терминале выполните:
```powershell
refreshenv
```

### Шаг 4: Проверьте установку

В новом терминале выполните:

```powershell
node --version
npm --version
```

Должны отобразиться версии, например:
```
v20.11.0
10.2.4
```

### Шаг 5: Установите зависимости проекта

```powershell
cd C:\Users\mrlvv\Desktop\sound-link-hub-main
npm install
```

### Шаг 6: Запустите приложение

```powershell
npm run dev
```

---

## Вариант 2: Использование WSL (если Node.js уже есть там)

Если у вас уже настроен WSL и там может быть Node.js:

### Шаг 1: Откройте WSL

В PowerShell выполните:
```powershell
wsl
```

### Шаг 2: Проверьте есть ли Node.js

```bash
node --version
npm --version
```

### Шаг 3: Если Node.js нет, установите его

```bash
# Быстрая установка через apt (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Или через nvm (рекомендуется)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

### Шаг 4: Перейдите в проект и запустите

```bash
cd /mnt/c/Users/mrlvv/Desktop/sound-link-hub-main
npm install
npm run dev
```

---

## Решение проблем

### Проблема: После установки npm все еще не найден

**Решение:**
1. Закройте ВСЕ окна терминала/PowerShell
2. Откройте новый терминал
3. Проверьте PATH: `echo $env:PATH` (должен содержать путь к Node.js)
4. Если пути нет, переустановите Node.js с опцией "Add to PATH"

### Проблема: "Access denied" при установке

**Решение:** Запустите PowerShell от имени администратора:
- Нажмите `Win + X`
- Выберите "Windows PowerShell (администратор)"

### Проблема: Старая версия Node.js

**Решение:** Скачайте и установите последнюю LTS версию с сайта nodejs.org

---

## Альтернатива: Использовать Chocolatey (для продвинутых)

Если у вас установлен Chocolatey:

```powershell
choco install nodejs-lts
```

---

## Готово!

После установки Node.js выполните:

```powershell
cd C:\Users\mrlvv\Desktop\sound-link-hub-main
npm install
npm run dev
```

Приложение будет доступно на **http://localhost:8080** 🚀
