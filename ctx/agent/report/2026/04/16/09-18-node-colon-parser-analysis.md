# Итерационный отчёт

## Резюме изменений

Проведён анализ трассировки запуска приложения и кода библиотеки `@teqfw/di` в части разбора зависимостей `node:*`. Установлено, что источник значения `input='node_fs'` находится не в библиотеке `@teqfw/di`, а в локальном compatibility-адаптере `lib/NodeColonCompatParser.mjs`, который принудительно переписывает `node:` в `node_` перед вызовом штатного парсера.

## Детали работ

Изучены файлы `bin/bootstrap.mjs`, `lib/NodeColonCompatParser.mjs`, `src/Configuration/Loader.mjs`, `node_modules/@teqfw/di/src/Def/Parser.mjs` и `node_modules/@teqfw/di/src/Container/Resolve/GraphResolver.mjs`.

Подтверждена цепочка выполнения:

- `src/Configuration/Loader.mjs` объявляет зависимости в канонической форме `node:fs`, `node:path`, `node:process`.
- `GraphResolver` читает значения из `__deps__` и передаёт их в `parser.parse(...)` без модификации.
- В `bin/bootstrap.mjs` контейнеру подставляется пользовательский парсер `NodeColonCompatParser`.
- `NodeColonCompatParser` заменяет префикс `node:` на `node_` до передачи строки в библиотечный `Parser`.
- Текущий `Parser` из `@teqfw/di` версии `2.5.1` уже умеет нативно распознавать `node:` и поэтому compatibility-слой стал конфликтующим и устаревшим.

## Результаты

Причина ошибки локализована: лог `Parser.parse: input='node_fs'` появляется из-за вызова `container.setParser(new NodeColonCompatParser())` в `bin/bootstrap.mjs`, а не из-за внутреннего преобразования в `@teqfw/di`.

Практический вывод:

- библиотека ожидает `node:` и корректно его обрабатывает;
- проектный compatibility-парсер искажает CDC до устаревшего формата;
- последующее разрешение зависимости идёт как для `teq::node_fs`, что ломает поиск Node built-in модуля.
