# Итерационный отчёт

## Резюме изменений

Выполнен перевод зависимости `@teqfw/di` с semver-резолва npm registry на GitHub-источник согласно ограничению `ctx/docs/constraints/overview.md`.

## Детали работ

- В `package.json` зависимость `@teqfw/di` изменена с `^1.2.0` на `github:teqfw/di`.
- Выполнен `npm install` для регенерации `package-lock.json`.
- Подтверждено, что lockfile резолвит DI как git-зависимость: `git+ssh://git@github.com/teqfw/di.git#98dd13965b1773cfb60e0788ce2b451262928ef0`.
- Проверена синхронизация документации:
  - `ctx/docs/code/bootstrap.md`
  - `ctx/docs/code/testing/unit-bootstrap.md`
  - `ctx/docs/code/testing/dev-bootstrap.md`
- По структуре пакета (`node_modules/@teqfw/di/src`) и mapping `Teqfw_Di_ -> node_modules/@teqfw/di/src` конфликтов не выявлено; правки документации не потребовались.
- Выполнены тесты после переключения зависимости:
  - `npm run test:unit`
  - `node --test "test/dev/**/*.test.mjs"`

## Результаты

- Ограничение на источник DI выполнено: semver-резолв для `@teqfw/di` удалён.
- Для `@teqfw/di` в lockfile отсутствует npm registry URL и используется GitHub git-resolved dependency.
- Unit и dev тесты падают с `ERR_MODULE_NOT_FOUND` по пути `node_modules/@teqfw/di/dist/esm.js`, что отражает ожидаемую несовместимость экспериментальной версии DI.
- Изменение зависимости не откатывалось, тесты не патчились, совместимость искусственно не маскировалась.
