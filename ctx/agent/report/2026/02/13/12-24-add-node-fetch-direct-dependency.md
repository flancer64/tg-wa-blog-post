# Итерационный отчёт

## Резюме изменений

Проверена корректность зависимости `node:node-fetch` и устранена скрытая транзитивная зависимость: `node-fetch` добавлен как прямая dependency проекта.

## Детали работ

- Подтверждено, что `node:node-fetch` не является встроенным модулем Node.js (`ERR_UNKNOWN_BUILTIN_MODULE`).
- Выявлено, что ранее `node-fetch` присутствовал только транзитивно через `grammy`.
- Обновлён `package.json`: добавлен `node-fetch` в `dependencies`.
- Обновлён `package-lock.json` через `npm install --package-lock-only --ignore-scripts`.

## Результаты

- `npm ls node-fetch --depth=0` показывает прямую зависимость `node-fetch@2.7.0`.
- `npm run test:unit` — успешно.
- Артефакты итерации:
  - `package.json`
  - `package-lock.json`
