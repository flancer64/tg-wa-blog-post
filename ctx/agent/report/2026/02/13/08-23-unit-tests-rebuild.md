# Итерационный отчёт

## Резюме изменений

Пересобрана unit-тестовая зона в соответствии с обновлённым контрактом `ctx/docs/code/testing.md`: тесты перенесены в `test/unit/back/` с зеркальной структурой относительно `src/`, введён единый тестовый bootstrap `test/unit/unit-bootstrap.mjs`, обновлён сценарий запуска тестов в `package.json`.

## Детали работ

- Создана структура `test/unit/back/` с каталогами `Aggregate/`, `Configuration/`, `External/`, `Storage/`.
- Перенесены и переименованы тесты в зеркальные пути:
  - `src/Aggregate/Factory.mjs` → `test/unit/back/Aggregate/Factory.test.mjs`
  - `src/App.mjs` → `test/unit/back/App.test.mjs`
  - `src/Configuration.mjs` → `test/unit/back/Configuration.test.mjs`
  - `src/Configuration/Loader.mjs` → `test/unit/back/Configuration/Loader.test.mjs`
  - `src/External/LlmTranslator.mjs` → `test/unit/back/External/LlmTranslator.test.mjs`
  - `src/External/TelegramPublisher.mjs` → `test/unit/back/External/TelegramPublisher.test.mjs`
  - `src/External/TelegramReader.mjs` → `test/unit/back/External/TelegramReader.test.mjs`
  - `src/Logger.mjs` → `test/unit/back/Logger.test.mjs`
  - `src/RunCycle.mjs` → `test/unit/back/RunCycle.test.mjs`
  - `src/Storage/Repository.mjs` → `test/unit/back/Storage/Repository.test.mjs`
- Старый helper `test/di-node.mjs` перенесён в `test/unit/unit-bootstrap.mjs` и адаптирован:
  - вычисление `projectRoot` относительно `test/unit/`;
  - сохранён test mode контейнера;
  - namespace roots для `Ttp_Back_` и `Teqfw_Di_` настроены в одном месте.
- Обновлены импорты `createTestContainer` во всех тестах на пути к `../unit-bootstrap.mjs` или `../../unit-bootstrap.mjs`.
- Обновлён `npm test` в `package.json` на запуск unit-тестов из `test/unit/back/**/*.test.mjs`.

## Результаты

- Выполнен прогон тестов: `npm test`.
- Результат: `10 passed`, `0 failed`.
- Тестовая зона соответствует новой структуре и использует единый тестовой composition root.
