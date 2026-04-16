# Итерационный отчёт

## Резюме изменений

Из проекта удалён устаревший compatibility-адаптер `lib/NodeColonCompatParser.mjs`, который подменял канонические идентификаторы `node:*` на формат `node_*`. Production и dev bootstrap переведены на штатный парсер `@teqfw/di`.

## Детали работ

Выполнены изменения:

- из `bin/bootstrap.mjs` удалены импорт адаптера и вызов `container.setParser(new NodeColonCompatParser())`;
- из `test/dev/dev-bootstrap.mjs` удалены импорт адаптера и вызов `container.setParser(new NodeColonCompatParser())`;
- файл `lib/NodeColonCompatParser.mjs` удалён.

Проведена проверка запуском `node ./bin/bootstrap.mjs`.

Подтверждено по логам контейнера:

- парсер получает `Parser.parse: input='node:fs'`;
- зависимость резолвится как Node built-in: `Resolver.specifier: module='fs' -> 'node:fs'`.

## Результаты

Совместимый адаптер больше не участвует в конфигурации контейнера и не искажает CDC зависимостей. Ошибка с преобразованием `node:fs` в `node_fs` устранена.

Проверка запуска дошла дальше DI-инициализации и завершилась на внешнем сетевом вызове `fetch failed`, что не связано с удалённым адаптером.
