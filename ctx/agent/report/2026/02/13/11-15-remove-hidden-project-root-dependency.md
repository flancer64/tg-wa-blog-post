# Итерационный отчёт

## Резюме изменений

Устранена скрытая зависимость через `process.env.TTP_PROJECT_ROOT`. `projectRoot` теперь передаётся явно по runtime-цепочке в загрузчик конфигурации через аргументы методов.

## Детали работ

- Удалена запись `processModule.env.TTP_PROJECT_ROOT = projectRoot` из `bin/bootstrap.mjs`.
- `Ttp_Back_Configuration_Loader.load` переведён на явный контракт: `load({ projectRoot })`.
- `Ttp_Back_RunCycle` перестроен на использование `Ttp_Back_Configuration_Loader$` вместо `Ttp_Back_Configuration$`; конфигурация загружается в `execute({ projectRoot })`.
- Внешние адаптеры (`LlmTranslator`, `TelegramReader`, `TelegramPublisher`) перестроены на `Ttp_Back_Configuration_Loader$` и принимают `projectRoot` в runtime-методах.
- `Logger` отвязан от `Ttp_Back_Configuration$`; редактирование секретов берётся из `process.env`.
- Dev bootstrap обновлён: реальная конфигурация грузится через loader, `configOverride` реализован как обёртка над loader с частичным merge.
- Обновлены unit/dev тесты под новый явный контракт.

## Результаты

- `npm test` — успешно.
- `npm run test:dev:llm` — успешно.
- Артефакты итерации:
  - `bin/bootstrap.mjs`
  - `src/Configuration/Loader.mjs`
  - `src/RunCycle.mjs`
  - `src/External/LlmTranslator.mjs`
  - `src/External/TelegramReader.mjs`
  - `src/External/TelegramPublisher.mjs`
  - `src/Logger.mjs`
  - `src/Configuration.mjs`
  - `test/dev/dev-bootstrap.mjs`
  - `test/dev/back/External/LlmTranslator.test.mjs`
  - `test/unit/back/Configuration.test.mjs`
  - `test/unit/back/Configuration/Loader.test.mjs`
  - `test/unit/back/External/LlmTranslator.test.mjs`
  - `test/unit/back/External/TelegramPublisher.test.mjs`
  - `test/unit/back/External/TelegramReader.test.mjs`
  - `test/unit/back/Logger.test.mjs`
  - `test/unit/back/RunCycle.test.mjs`
