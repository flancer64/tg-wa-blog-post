# Итерация: проверка `src` на code conventions и добавление `types.d.ts`

## Резюме изменений

Проверен каталог `src/` на соответствие `ctx/docs/code/conventions.md`. Выполнены правки для усиления immutable-контракта конфигурации и добавлен новый файл `types.d.ts` с декларациями классов `Ttp_Back_*`.

## Детали работ

- Проведён аудит всех исходников в `src/` по ключевым инвариантам: ESM `.mjs`, DI через конструктор, отсутствие `console.*`, отсутствие `container.get/register` в production-коде, отсутствие статических импортов platform API.
- Обновлён `src/Configuration/Loader.mjs`: возвращаемая конфигурация теперь замораживается (`Object.freeze`) на всех вложенных уровнях (`telegram`, `chatId`, `llm`) для соблюдения immutable-модели.
- Обновлён `src/Logger.mjs`: сохранено маскирование секретов и добавлено regex-маскирование токеноподобных фрагментов (`Bearer ...`, `token/api_key` шаблоны) без изменения внешнего контракта логгера.
- Создан `types.d.ts` в корне проекта с декларациями классов из `src/`:
  - `Ttp_Back_Aggregate_Factory`
  - `Ttp_Back_App`
  - `Ttp_Back_Configuration`
  - `Ttp_Back_Configuration_Loader`
  - `Ttp_Back_External_LlmTranslator`
  - `Ttp_Back_External_TelegramPublisher`
  - `Ttp_Back_External_TelegramReader`
  - `Ttp_Back_Logger`
  - `Ttp_Back_RunCycle`
  - `Ttp_Back_Storage_Repository`

## Результаты

- Все unit-тесты выполнены успешно: `npm run test:unit` (10/10 pass).
- Изменённые артефакты:
  - `src/Configuration/Loader.mjs`
  - `src/Logger.mjs`
  - `types.d.ts`
