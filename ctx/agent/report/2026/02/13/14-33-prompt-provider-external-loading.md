# Итерация: prompt-provider-external-loading

## Резюме изменений

Реализована загрузка translation prompt из внешних файлов `var/prompt/translate_en.md` и `var/prompt/translate_es.md` через новый DI-компонент `Ttp_Back_Prompt_Provider` с безопасным fallback на встроенные значения. `RunCycle` переведён на использование провайдера и больше не содержит inline prompt-логики.

## Детали работ

- Добавлен production-компонент `src/Prompt/Provider.mjs`.
- Реализован контракт `getTranslatePrompt({ lang, projectRoot })`:
  - чтение prompt-файла из `projectRoot/var/prompt/`;
  - использование UTF-8 при чтении;
  - fallback на встроенные строки для `en`/`es`, если файл отсутствует, недоступен или пуст.
- Обновлён `src/RunCycle.mjs`:
  - внедрён `Ttp_Back_Prompt_Provider$` через DI;
  - удалена inline-функция prompt;
  - вызов `llmTranslator.translate(...)` теперь получает prompt из провайдера.
- Обновлён `types.d.ts`:
  - добавлена декларация `Ttp_Back_Prompt_Provider`.
- Добавлены unit-тесты `test/unit/back/Prompt/Provider.test.mjs`:
  - загрузка существующего файла;
  - fallback при отсутствии файла;
  - fallback при пустом файле;
  - fallback при ошибке чтения;
  - проверка резолва пути относительно `projectRoot`.
- Обновлены unit-тесты `test/unit/back/RunCycle.test.mjs`:
  - добавлена DI-подмена `Ttp_Back_Prompt_Provider$`;
  - проверка использования провайдера в обеих языковых ветках;
  - проверка передачи prompt из провайдера в `LlmTranslator`.

## Результаты

- Контракт загрузки prompt из внешних файлов реализован в production-коде.
- Fallback-модель работает без выброса ошибок в сценариях недоступности файлов.
- `RunCycle` не использует `fs` и не содержит hardcoded prompt-логики.
- Unit-тесты выполнены успешно:

```bash
npm run test:unit
# pass 11, fail 0
```

## Артефакты

- `src/Prompt/Provider.mjs`
- `src/RunCycle.mjs`
- `test/unit/back/Prompt/Provider.test.mjs`
- `test/unit/back/RunCycle.test.mjs`
- `types.d.ts`
