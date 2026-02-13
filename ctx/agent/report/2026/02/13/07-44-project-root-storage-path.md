# Итерация: project-root-storage-path

## Резюме изменений

Композиция пути хранения артефактов переведена с `process.cwd()` на `projectRoot`, вычисляемый в bootstrap и передаваемый по цепочке `App -> RunCycle -> Repository`.

## Детали работ

- Обновлён `src/Storage/Repository.mjs`: добавлен явный резолвер базового каталога по `projectRoot` и удалена зависимость от `node:process`.
- Обновлён `src/RunCycle.mjs`: `projectRoot` принят в `execute` и передаётся в `storage.existsByRuMessageId(...)` и `storage.saveAggregate(...)`.
- Обновлены unit-тесты:
  - `test/Storage.test.mjs` — вызовы storage-методов теперь передают `{ projectRoot }`.
  - `test/RunCycle.test.mjs` — добавлены проверки прокидывания `{ projectRoot }` в storage-слой.
- Синхронизирована документация по источнику базового пути хранения:
  - `ctx/docs/code/storage/overview.md`;
  - `ctx/docs/environment/overview.md`;
  - `ctx/docs/code/testing.md`.
- Выполнен прогон тестов: `npm test`.

## Результаты

- Базовый путь хранения теперь однозначно определяется от `projectRoot` из bootstrap.
- Контракт между слоями исполнения и хранения стал явным и проверяется тестами.
- Все unit-тесты пройдены: 10/10.
- Изменённые артефакты:
  - `src/Storage/Repository.mjs`
  - `src/RunCycle.mjs`
  - `test/Storage.test.mjs`
  - `test/RunCycle.test.mjs`
  - `ctx/docs/code/storage/overview.md`
  - `ctx/docs/environment/overview.md`
  - `ctx/docs/code/testing.md`
  - `ctx/agent/report/2026/02/13/07-44-project-root-storage-path.md`
