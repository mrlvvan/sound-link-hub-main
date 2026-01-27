# Решение конфликта зависимостей npm

## Проблема
```
npm error ERESOLVE could not resolve
npm error peer react@"^0.14.9 || ^15.x || ^16.x || ^17.x" from react-yandex-maps@4.6.0
```

Пакет `react-yandex-maps` требует старую версию React (16-17), а в проекте используется React 18.

## Решение: Использовать --legacy-peer-deps

Выполните команду с флагом `--legacy-peer-deps`:

```powershell
npm install --legacy-peer-deps
```

Этот флаг говорит npm игнорировать конфликты peer dependencies и установить зависимости в старом формате.

---

## Альтернативное решение: Использовать --force

Если `--legacy-peer-deps` не помогает:

```powershell
npm install --force
```

**Примечание:** `--force` более агрессивный и может привести к проблемам, но обычно работает.

---

## После установки зависимостей

После успешной установки запустите dev-сервер:

```powershell
npm run dev
```

---

## Если проблемы продолжаются

### Вариант 1: Удалить node_modules и переустановить

```powershell
# Удалите node_modules и package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Установите заново с флагом
npm install --legacy-peer-deps
```

### Вариант 2: Настроить npm по умолчанию

Чтобы всегда использовать `--legacy-peer-deps`:

```powershell
npm config set legacy-peer-deps true
```

Теперь можно просто использовать:
```powershell
npm install
```

---

## Почему это происходит?

Пакет `react-yandex-maps@4.6.0` устарел и не обновлялся для поддержки React 18. Однако он обычно работает с React 18, просто npm видит конфликт в зависимостях.

---

## Готово!

После выполнения `npm install --legacy-peer-deps` зависимости должны установиться успешно.

Затем запустите:
```powershell
npm run dev
```

Приложение будет доступно на **http://localhost:8080** 🚀
