# Отчёт итерации: Bootstrap Namespace Auto-Discovery (Code)

## Резюме изменений

Цель итерации: обновить код в соответствии с DI v2 namespace-моделью и убрать ручную регистрацию namespace roots в bootstrap.

Изменены файлы:
- `bin/bootstrap.mjs`
- `package.json`
- `test/dev/dev-bootstrap.mjs`
- `test/unit/unit-bootstrap.mjs`
- `node_modules/@teqfw/di/package.json`

## Детали работ

В production bootstrap (`bin/bootstrap.mjs`):
- удалена ручная регистрация `container.addNamespaceRoot('Ttp_Back_', ...)`;
- добавлен `TeqFw_Di_Config_NamespaceRegistry`;
- namespace roots теперь собираются автоматически из metadata и применяются циклом по registry entries.

В `package.json`:
- добавлена декларация namespace roots в `teqfw.namespaces`:
  - `Ttp_Back_ -> ./src` (`.mjs`).

В test bootstrap:
- `test/dev/dev-bootstrap.mjs` переведён на auto-discovery через `NamespaceRegistry` вместо hardcoded mapping.
- `test/unit/unit-bootstrap.mjs` сохранён как lightweight recursive mock container (для совместимости unit-тестов), но источник namespace roots переведён на `NamespaceRegistry` (без hardcoded mapping).

По запросу пользователя открыты экспорты в локальном `@teqfw/di`:
- добавлены subpath exports для:
  - `./src/Container.mjs`
  - `./src/Config/NamespaceRegistry.mjs`

## Результаты

- В bootstrap-коде отсутствует ручной hardcoded namespace mapping.
- Namespace roots декларативно заданы в `package.json` и обнаруживаются автоматически.
- Unit-тесты проходят полностью: `12 passed, 0 failed` (`npm run test:unit`).
- Совместимость тестовой зоны сохранена, включая recursive `__deps__`-aware mocking.
