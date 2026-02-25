# Итерационный отчёт — DI module form migration

## Резюме изменений

Выполнена структурная миграция runtime-модулей `src/` на новую DI-совместимую форму ES6-модулей: добавлены `// @ts-check`, module-level JSDoc, явные `__deps__`, конструкторные `@typedef`-контракты зависимостей и единая форма `default`-классов.

Тестовая зона обновлена под новый подход мокирования для `__deps__`-графа: `test/unit/unit-bootstrap.mjs` заменён на рекурсивный test-container с явной регистрацией моков и разрешением зависимостей по `__deps__`.

Добавлен инфраструктурный модуль `src/External/Fetch.mjs` для DI-стабильного доступа к runtime `fetch` без изменения бизнес-логики переводчиков/паблишеров.

## Детали работ

- Рефакторинг всех runtime-модулей в `src/`:
  - добавлен `// @ts-check`;
  - добавлены module-level JSDoc-описания структурной роли;
  - добавлены `__deps__`-дескрипторы;
  - добавлены `@typedef` зависимостей конструктора;
  - сохранена существующая бизнес-логика методов.
- Обновлены DI ID platform-зависимостей в `src/` и unit-тестах на новый CDC-формат (`node_*`).
- Добавлен модуль `src/External/Fetch.mjs` и его unit-тест `test/unit/back/External/Fetch.test.mjs`.
- Обновлены внешние адаптеры (`LlmTranslator`, `TelegramReader`, `TelegramPublisher`) на зависимость `Ttp_Back_External_Fetch$`.
- Обновлён `types.d.ts` с alias `Ttp_Back_External_Fetch`.
- Адаптированы test bootstraps:
  - `test/unit/unit-bootstrap.mjs` — новый рекурсивный mock-container для unit-сценариев;
  - `test/dev/dev-bootstrap.mjs` — актуализирован под новый namespace/root API контейнера.
- Production bootstrap (`bin/bootstrap.mjs`) оставлен в актуальной форме нового DI API с `addNamespaceRoot(...)`.

## Результаты

- Выполнена структурная DI-миграция runtime-кода без изменения доменной/продуктовой логики.
- Unit-тесты проходят полностью.

Команда проверки:

```bash
npm run test:unit
```

Итог:
- tests: 12
- pass: 12
- fail: 0
