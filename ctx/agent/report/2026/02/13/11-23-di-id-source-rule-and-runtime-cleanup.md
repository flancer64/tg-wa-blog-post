# Итерационный отчёт

## Резюме изменений

Исправлен DI-контракт в документации: запрещены выдуманные Dependency ID без исходного компонента. Код пересобран без `Ttp_Back_Runtime_ProjectRoot$`: runtime-данные передаются явно через аргументы методов.

## Детали работ

- Обновлён `ctx/docs/code/di.md`:
  - добавлен раздел «Разрешённые Dependency ID»;
  - закреплён запрет на произвольные DI-ID без исходного кода в `src/` или `node:*`;
  - зафиксировано правило передачи runtime-данных (например, `projectRoot`) только через аргументы runtime-методов.
- Пересобран код без выдуманного ID:
  - `src/Configuration.mjs` больше не использует `Ttp_Back_Runtime_ProjectRoot$`;
  - `test/unit/back/Configuration.test.mjs` убраны регистрации несуществующего DI-ID, тесты переведены на подмену `Ttp_Back_Configuration_Loader$`.
- Проверено отсутствие `Ttp_Back_Runtime_ProjectRoot$` в кодовой базе.

## Результаты

- `npm test` — успешно.
- `npm run test:dev:llm` — успешно.
- Артефакты итерации:
  - `ctx/docs/code/di.md`
  - `src/Configuration.mjs`
  - `test/unit/back/Configuration.test.mjs`
