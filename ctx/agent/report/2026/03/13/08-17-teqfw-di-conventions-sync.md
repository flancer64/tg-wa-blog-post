# Отчёт итерации

## Резюме изменений

Цель итерации состояла в приведении исходников к новым документам `ctx/docs/code/conventions/teqfw/`, обновлении зависимости `@teqfw/di` до актуальной версии и проверке работоспособности тестов.

В production-коде DI-декларации переведены в нормализованную TeqFW-форму с `Object.freeze(...)`, platform dependency ID приведены к каноническому виду `node:*`, а `types.d.ts` синхронизирован с текущим `types-map` контрактом.

Зависимость `@teqfw/di` обновлена с `2.0.0` до `2.0.4`. Для совместимости текущего релиза контейнера с новой документированной формой `node:*` добавлен composition-root compatibility parser в `lib/NodeColonCompatParser.mjs`, используемый в production и dev bootstrap.

## Детали работ

Изменены `bin/bootstrap.mjs`, `test/dev/dev-bootstrap.mjs` и `test/unit/unit-bootstrap.mjs`. Production и dev bootstrap теперь используют пакетный вход `@teqfw/di`; unit bootstrap сохранён как специализированный тестовый контейнер с рекурсивной подменой зависимостей и поддержкой `node:*`.

Изменены модули в `src/`: `App.mjs`, `Logger.mjs`, `RunCycle.mjs`, `Aggregate/Factory.mjs`, `Configuration/Loader.mjs`, `Configuration/Manager.mjs`, `External/Fetch.mjs`, `External/LlmTranslator.mjs`, `External/TelegramPublisher.mjs`, `External/TelegramReader.mjs`, `Prompt/Provider.mjs`, `Storage/Repository.mjs`.

Обновлены `package.json` и `package-lock.json`. В `types.d.ts` заменены `InstanceType<typeof import(...).default>` на прямые alias-объявления `import("./src/...").default` в соответствии с документом `ctx/docs/code/conventions/teqfw/types-map.md`.

Скорректированы unit-тесты, регистрирующие platform mocks, чтобы они использовали канонические `node:*` ID.

## Результаты

Команда `npm install @teqfw/di@2.0.4` выполнена успешно.

Команда `npm run test:unit` выполнена успешно: 12 тестов, 12 passed, 0 failed.

Изменения готовы к фиксации в git.
