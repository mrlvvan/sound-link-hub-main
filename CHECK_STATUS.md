# Проверка статуса контейнера

## Шаг 1: Проверьте что контейнер запущен

```bash
docker ps
```

Должен быть виден контейнер `sound-link-hub` со статусом "Up".

## Шаг 2: Если контейнер не запущен, запустите его

```bash
docker compose start
```

Или:

```bash
docker start sound-link-hub
```

## Шаг 3: Проверьте логи

```bash
docker compose logs -f
```

Или:

```bash
docker logs -f sound-link-hub
```

## Шаг 4: Откройте приложение

Откройте в браузере: **http://localhost:8080**

## Если контейнер не запускается

Проверьте логи на ошибки:

```bash
docker compose logs sound-link-hub
```
