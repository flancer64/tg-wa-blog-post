# Итерационный отчёт

## Резюме изменений

Перестроен `Ttp_Back_Configuration_Loader`: путь к `.env` вычисляется от `projectRoot`, заданного bootstrap через runtime-параметр окружения, без использования `process.cwd()`. Dev-test инфраструктура обновлена: по умолчанию загружается реальная конфигурация, при этом в тесте можно переопределять отдельные параметры.

## Детали работ

- В `bin/bootstrap.mjs` добавлена инициализация `process.env.TTP_PROJECT_ROOT` до сборки DI-графа.
- В `src/Configuration/Loader.mjs` удалена зависимость от `process.cwd()`; loader теперь требует `TTP_PROJECT_ROOT` и строит путь к `.env` от него.
- Обновлены unit-тесты конфигурации:
  - `test/unit/back/Configuration/Loader.test.mjs`
  - `test/unit/back/Configuration.test.mjs`
  Теперь тесты передают `TTP_PROJECT_ROOT` и покрывают ошибку при его отсутствии.
- Перестроен `test/dev/dev-bootstrap.mjs`:
  - выставляет `TTP_PROJECT_ROOT` для dev-зоны;
  - загружает реальную конфигурацию через `Ttp_Back_Configuration_Loader$`;
  - поддерживает частичное переопределение через `options.configOverride`.
- Обновлён `test/dev/back/External/LlmTranslator.test.mjs`:
  - убрана полная подмена `Ttp_Back_Configuration$`;
  - добавлен сценарий частичного override конфигурации.
- В `package.json` добавлены скрипты `test:dev` и `test:dev:llm`.

## Результаты

- `npm test` — успешно.
- `npm run test:dev:llm` — успешно.
- Артефакты итерации:
  - `bin/bootstrap.mjs`
  - `src/Configuration/Loader.mjs`
  - `test/unit/back/Configuration/Loader.test.mjs`
  - `test/unit/back/Configuration.test.mjs`
  - `test/dev/dev-bootstrap.mjs`
  - `test/dev/back/External/LlmTranslator.test.mjs`
  - `package.json`
