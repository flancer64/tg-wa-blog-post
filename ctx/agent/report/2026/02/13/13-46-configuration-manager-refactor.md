# Итерационный отчёт

## Резюме изменений

Выполнен рефакторинг конфигурационного слоя production-кода в `src/` для приведения к контракту `ctx/docs/code/configuration.md`: введён единый управляющий компонент `ConfigurationManager` с lifecycle `load -> get`, исключено прямое использование `ConfigurationLoader` прикладными компонентами, обновлены unit/dev-тесты и декларации типов.

## Детали работ

- Загружены и учтены нормативные документы:
  - `ctx/docs/code/configuration.md`
  - `ctx/docs/code/di.md`
  - `ctx/docs/code/conventions.md`
  - `ctx/docs/code/testing.md`
  - `ctx/docs/code/error-handling.md`
- Добавлен `src/Configuration/Manager.mjs`:
  - `load({ projectRoot })` выполняется ровно один раз;
  - повторный `load()` выбрасывает исключение;
  - `get()` до `load()` выбрасывает исключение;
  - объект конфигурации deep-freeze (immutable).
- Обновлён `src/App.mjs`:
  - `App.run()` вызывает `ConfigurationManager.load({ projectRoot })` до запуска run-cycle.
- Обновлён `src/RunCycle.mjs`:
  - удалена зависимость от `ConfigurationLoader$`;
  - используется `ConfigurationManager.get()`.
- Обновлены внешние адаптеры:
  - `src/External/LlmTranslator.mjs`
  - `src/External/TelegramReader.mjs`
  - `src/External/TelegramPublisher.mjs`
  - удалён прямой вызов `load()`, используется `manager.get()`.
- Удалён устаревший `src/Configuration.mjs`, где конфигурация регистрировалась как отдельный DI-компонент.
- Обновлён `types.d.ts`:
  - удалён `Ttp_Back_Configuration`;
  - добавлен `Ttp_Back_Configuration_Manager`.
- Обновлены тесты:
  - `test/unit/back/Configuration.test.mjs` переписан под lifecycle `ConfigurationManager`;
  - `test/unit/back/App.test.mjs`, `test/unit/back/RunCycle.test.mjs`, `test/unit/back/External/*.test.mjs` переведены на `ConfigurationManager$`;
  - `test/dev/dev-bootstrap.mjs` теперь выполняет `manager.load({ projectRoot })`;
  - `test/dev/back/External/LlmTranslator.test.mjs` получает конфиг через `manager.get()`.
- Дополнительно устранено нарушение доступа к окружению:
  - `src/Logger.mjs` больше не читает `process.env`.

## Результаты

- Контракт конфигурационного слоя выровнен:
  - lifecycle `load -> get` реализован и принудительно контролируется;
  - загрузка конфигурации выполняется один раз за lifecycle контейнера;
  - прикладные компоненты не используют `ConfigurationLoader` напрямую;
  - прикладные компоненты не выполняют загрузку конфигурации;
  - доступ к конфигурации централизован через `ConfigurationManager`.
- `types.d.ts` синхронизирован с текущим DI-графом.
- Unit-тесты выполнены успешно:
  - команда: `npm run test:unit`
  - результат: 10 passed, 0 failed.
