# Подробная инструкция: Установка WSL, Ubuntu и Docker на Windows

Эта инструкция поможет вам установить WSL (Windows Subsystem for Linux), Ubuntu и Docker на Windows 10/11.

## Шаг 1: Проверка требований

### Минимальные требования:
- Windows 10 версии 2004 или выше (сборка 19041 или выше)
- Windows 11 (любая версия)
- 64-битная система
- Включенная виртуализация в BIOS/UEFI

### Проверка версии Windows:

1. Нажмите `Win + R`
2. Введите `winver` и нажмите Enter
3. Проверьте версию Windows (должна быть 2004 или выше)

## Шаг 2: Установка WSL и Ubuntu

### Вариант A: Автоматическая установка (рекомендуется для Windows 11)

Это самый простой способ:

1. Откройте PowerShell или командную строку **от имени администратора**:
   - Нажмите `Win + X`
   - Выберите "Windows PowerShell (администратор)" или "Терминал (администратор)"

2. Выполните одну команду:

```powershell
wsl --install
```

Эта команда автоматически:
- Устанавливает WSL
- Устанавливает последнюю версию Ubuntu
- Устанавливает необходимые компоненты

3. После выполнения команды **перезагрузите компьютер**:

```powershell
Restart-Computer
```

4. После перезагрузки откроется окно Ubuntu. Создайте пользователя:
   - Введите имя пользователя (например: `user`)
   - Нажмите Enter
   - Введите пароль (пароль не будет отображаться при вводе - это нормально)
   - Подтвердите пароль

### Вариант B: Ручная установка (для Windows 10 или если автоматическая не работает)

#### 2.1. Включение компонентов Windows

1. Откройте PowerShell **от имени администратора**

2. Выполните команды по порядку:

```powershell
# Включение WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Включение компонента виртуализации
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Включение Hyper-V (если доступно)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

3. **Перезагрузите компьютер**:

```powershell
Restart-Computer
```

#### 2.2. Установка WSL2

После перезагрузки:

1. Откройте PowerShell **от имени администратора**

2. Установите WSL2 как версию по умолчанию:

```powershell
wsl --set-default-version 2
```

Если появится ошибка о том, что WSL2 требует обновления ядра:
- Скачайте и установите обновление ядра WSL2: https://aka.ms/wsl2kernel
- После установки повторите команду выше

#### 2.3. Установка Ubuntu

1. Откройте Microsoft Store
2. Найдите "Ubuntu" (или "Ubuntu 22.04 LTS")
3. Нажмите "Установить" или "Get"
4. Дождитесь завершения установки
5. Нажмите "Запустить" или найдите Ubuntu в меню Пуск

6. При первом запуске создайте пользователя:
   - Введите имя пользователя
   - Введите пароль (не будет видно при вводе)
   - Подтвердите пароль

## Шаг 3: Настройка Ubuntu в WSL

### 3.1. Обновление системы

Откройте Ubuntu (через меню Пуск или командой `wsl` в PowerShell) и выполните:

```bash
sudo apt update
sudo apt upgrade -y
```

### 3.2. Установка необходимых утилит

```bash
sudo apt install -y curl wget git vim
```

### 3.3. Проверка версии WSL

```bash
wsl --version
```

Или внутри Ubuntu:

```bash
uname -a
```

Вы должны увидеть что-то вроде `...Microsoft...WSL2...`

## Шаг 4: Установка Docker в WSL Ubuntu

### 4.1. Обновление системы

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
```

### 4.2. Добавление официального GPG ключа Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 4.3. Добавление репозитория Docker

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 4.4. Установка Docker Engine

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 4.5. Запуск Docker службы

В WSL Docker работает немного иначе. Есть два варианта:

#### Вариант A: Использование Docker Desktop (рекомендуется для Windows)

1. Скачайте Docker Desktop для Windows: https://www.docker.com/products/docker-desktop/
2. Установите Docker Desktop
3. При установке отметьте опцию "Use WSL 2 based engine"
4. Запустите Docker Desktop
5. В настройках Docker Desktop перейдите в Settings → Resources → WSL Integration
6. Включите интеграцию с вашим дистрибутивом Ubuntu

После этого Docker будет доступен в WSL Ubuntu без дополнительных настроек.

#### Вариант B: Запуск Docker daemon в WSL (альтернативный способ)

Если не хотите использовать Docker Desktop:

```bash
# Запуск Docker daemon
sudo service docker start

# Проверка статуса
sudo service docker status

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Выход и повторный вход в WSL для применения изменений
exit
```

Затем снова откройте Ubuntu.

### 4.6. Проверка установки Docker

```bash
docker --version
docker compose version
docker run hello-world
```

Если команды выполнились успешно, Docker установлен правильно!

## Шаг 5: Настройка доступа к файлам Windows из WSL

WSL может работать с файлами Windows. Файлы Windows доступны по пути:

```bash
# Доступ к диску C:
cd /mnt/c

# Например, доступ к рабочему столу
cd /mnt/c/Users/ВАШЕ_ИМЯ_ПОЛЬЗОВАТЕЛЯ/Desktop
```

**Важно:** Для лучшей производительности рекомендуется работать с файлами проекта внутри файловой системы WSL (например, в `/home/ваше_имя/`), а не в `/mnt/c/`.

## Шаг 6: Клонирование проекта

### Вариант A: Клонирование в файловую систему WSL (рекомендуется)

```bash
# Перейдите в домашнюю директорию
cd ~

# Клонируйте репозиторий (если есть Git URL)
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
cd sound-link-hub-main

# Или скопируйте проект из Windows
# Если проект уже на рабочем столе Windows:
cp -r /mnt/c/Users/ВАШЕ_ИМЯ/Desktop/sound-link-hub-main ~/
cd ~/sound-link-hub-main
```

### Вариант B: Работа с проектом в Windows

Если проект уже находится в Windows (например, на рабочем столе):

```bash
cd /mnt/c/Users/ВАШЕ_ИМЯ/Desktop/sound-link-hub-main
```

**Примечание:** Работа с файлами в `/mnt/c/` может быть медленнее, чем в файловой системе WSL.

## Шаг 7: Запуск приложения

Теперь следуйте инструкциям из файла `DOCKER_INSTALLATION_RU.md`, начиная с шага 5:

```bash
# Убедитесь, что вы в директории проекта
cd ~/sound-link-hub-main
# или
cd /mnt/c/Users/ВАШЕ_ИМЯ/Desktop/sound-link-hub-main

# Запустите контейнер
docker compose up -d --build

# Проверьте логи
docker compose logs -f
```

## Шаг 8: Доступ к приложению

После запуска контейнера приложение будет доступно по адресу:

- `http://localhost:8080` в браузере Windows

WSL автоматически пробрасывает порты, поэтому вы можете использовать браузер Windows для доступа к приложению, запущенному в WSL.

## Полезные команды WSL

### Открытие Ubuntu из Windows

```powershell
# В PowerShell или CMD
wsl

# Или напрямую Ubuntu
ubuntu
```

### Запуск команды в WSL из Windows

```powershell
wsl docker ps
wsl ls -la
```

### Остановка WSL

```powershell
wsl --shutdown
```

### Просмотр установленных дистрибутивов

```powershell
wsl --list --verbose
```

### Установка Ubuntu как дистрибутива по умолчанию

```powershell
wsl --set-default Ubuntu
```

## Решение проблем

### Проблема: Команда `wsl --install` не найдена

**Решение:** Обновите Windows до последней версии или используйте Вариант B (ручная установка).

### Проблема: WSL2 требует обновления ядра

**Решение:**
1. Скачайте обновление: https://aka.ms/wsl2kernel
2. Установите обновление
3. Выполните: `wsl --set-default-version 2`

### Проблема: Docker не запускается в WSL

**Решение:**
- Используйте Docker Desktop для Windows с интеграцией WSL2 (Вариант A в шаге 4.5)
- Или убедитесь, что Docker daemon запущен: `sudo service docker start`

### Проблема: Медленная работа с файлами в `/mnt/c/`

**Решение:** Работайте с файлами внутри файловой системы WSL (`~/` или `/home/ваше_имя/`).

### Проблема: Порт 8080 недоступен в браузере Windows

**Решение:**
1. Убедитесь, что контейнер запущен: `docker ps`
2. Проверьте логи: `docker compose logs`
3. Убедитесь, что порт проброшен правильно в `docker-compose.yml`

### Проблема: Ошибка "Cannot connect to the Docker daemon"

**Решение:**
```bash
# Если используете Docker Desktop - убедитесь, что он запущен
# Если используете Docker в WSL напрямую:
sudo service docker start
sudo usermod -aG docker $USER
# Выйдите и войдите снова в WSL
```

## Дополнительные настройки

### Настройка Git в WSL

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"
```

### Установка дополнительных инструментов

```bash
# Node.js (если нужен для разработки вне Docker)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Zsh и Oh My Zsh (опционально, для улучшения терминала)
sudo apt install -y zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Краткая шпаргалка

```powershell
# Установка WSL и Ubuntu (в PowerShell от администратора)
wsl --install
# Перезагрузка компьютера

# После перезагрузки откроется Ubuntu - создайте пользователя
```

```bash
# В Ubuntu: Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker (или используйте Docker Desktop)
# См. шаг 4 выше

# Запуск приложения
cd ~/sound-link-hub-main
docker compose up -d --build
```

---

**Готово!** Теперь у вас установлены WSL, Ubuntu и Docker. Приложение будет доступно по адресу `http://localhost:8080` в браузере Windows.
