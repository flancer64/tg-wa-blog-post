# Итерация: dev-llm-test-prompt-provider

## Резюме изменений

В `test/dev/back/External/LlmTranslator.test.mjs` интегрирован `Ttp_Back_Prompt_Provider$`: тесты больше не используют inline-строки prompt и получают prompt через DI-компонент.

## Детали работ

- В оба dev-теста перевода (`en`, `es`) добавлено получение провайдера:
  - `const promptProvider = await container.get('Ttp_Back_Prompt_Provider$');`
- Перед вызовом `translate(...)` добавлено получение prompt:
  - `await promptProvider.getTranslatePrompt({ lang, projectRoot })`
- Параметр `prompt` в `adapter.translate(...)` заменён с hardcoded-строки на значение из провайдера.

## Результаты

- Dev-тест использует ту же prompt-модель, что и production-run-cycle.
- Синтаксическая и runtime-валидность подтверждена запуском:

```bash
node --test test/dev/back/External/LlmTranslator.test.mjs
# pass 1, fail 0
```

## Артефакты

- `test/dev/back/External/LlmTranslator.test.mjs`
