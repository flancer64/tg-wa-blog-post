# Итерация: удаление неиспользуемой зависимости `node-fetch`

## Резюме изменений

Проверено использование `node-fetch` в продукте: прямых импортов и runtime-зависимости в исходниках нет, используется `globalThis.fetch`. Пакет удалён из зависимостей проекта.

## Детали работ

- Выполнен поиск по коду и конфигурации зависимостей (`rg -n "node-fetch|node:node-fetch" -S ...`).
- Подтверждено, что в `src/` и `bin/` отсутствуют импорты `node-fetch`; зависимость использовалась только в `package.json`/`package-lock.json` и исторических отчётах.
- Выполнена команда `npm uninstall node-fetch`.
- Из `test/unit/unit-bootstrap.mjs` удалена устаревшая ветка резолва `node_Fetch -> node-fetch`, не используемая текущими CDC-зависимостями.
- Зафиксирован lock-файл без побочного обновления pin-записи `@teqfw/di`.
- Выполнены unit-тесты после изменений.

## Результаты

- Обновлён [`package.json`](../../../../../package.json): удалён `node-fetch` из `dependencies`.
- Обновлён [`package-lock.json`](../../../../../package-lock.json): удалены `node-fetch` и его транзитивные пакеты.
- Обновлён [`test/unit/unit-bootstrap.mjs`](../../../../../test/unit/unit-bootstrap.mjs): удалён устаревший special-case резолва `node-fetch`.
- Unit-тесты пройдены: 12/12.
