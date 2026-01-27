# Решение проблемы: директория не найдена

## Проблема
```
-bash: cd: /home/mrlvq/sound-link-hub-main: No such file or directory
```

## Решение

### Шаг 1: Найдите где находится проект

Проект находится на рабочем столе Windows. В WSL это доступно через `/mnt/c/`.

### Шаг 2: Выберите один из вариантов

#### Вариант A: Работа напрямую из Windows (быстро)

```bash
# Перейдите в директорию проекта
cd /mnt/c/Users/mrlvv/Desktop/sound-link-hub-main

# Проверьте что вы в правильной директории
pwd
ls -la

# Запустите Docker
docker compose up -d --build
```

**Примечание:** Замените `mrlvv` на ваше имя пользователя Windows, если оно отличается.

#### Вариант B: Копирование в WSL (рекомендуется)

```bash
# Скопируйте проект в домашнюю директорию
cp -r /mnt/c/Users/mrlvv/Desktop/sound-link-hub-main ~/

# Перейдите в скопированную директорию
cd ~/sound-link-hub-main

# Проверьте содержимое
ls -la

# Запустите Docker
docker compose up -d --build
```

### Шаг 3: Если имя пользователя отличается

Если ваше имя пользователя Windows отличается от `mrlvv`, найдите правильный путь:

```bash
# Посмотрите содержимое Desktop
ls /mnt/c/Users/*/Desktop/

# Или найдите проект
find /mnt/c/Users -name "sound-link-hub-main" -type d 2>/dev/null
```

### Шаг 4: Проверка текущей директории

```bash
# Узнайте где вы сейчас
pwd

# Узнайте ваше имя пользователя
whoami

# Посмотрите содержимое текущей директории
ls -la
```

## Быстрая команда для копирования

Если проект точно на рабочем столе Windows:

```bash
cp -r /mnt/c/Users/*/Desktop/sound-link-hub-main ~/ 2>/dev/null && cd ~/sound-link-hub-main && pwd
```

Эта команда найдет проект на рабочем столе любого пользователя и скопирует его в WSL.
