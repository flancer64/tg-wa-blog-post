# Отчёт итерации

Path: `ctx/agent/report/2026/03/06/13-43-source-file-runtime-support.md`

## Резюме изменений

В production-код добавлена поддержка аварийного ручного запуска перевода и публикации из локального plain text файла через CLI-параметр `--source-file`.

## Детали работ

В `src/App.mjs` добавлен разбор CLI-аргументов с поддержкой `--source-file <path>` и fail-fast поведением для неподдерживаемых или неполных аргументов.

В `src/RunCycle.mjs` добавлено чтение ru-текста из локального файла через DI-зависимости `node_fs` и `node_path`, исключение штатного обращения к `TelegramReader` при активном `source-file` и генерация отрицательного `ru_message_id` формата `-YYYYMMDDHHMM`.

В unit-тестах `test/unit/back/App.test.mjs` и `test/unit/back/RunCycle.test.mjs` добавлены проверки разбора CLI, отказа при невалидном использовании `--source-file` и успешного ручного run-cycle без чтения из Telegram.

## Результаты

CLI теперь поддерживает запуск вида `node bin/bootstrap.mjs --source-file ./var/manual/post.txt`.

При таком запуске приложение читает plain text из файла, переводит его в en и es, публикует результаты в целевые каналы и сохраняет агрегат с отрицательным `ru_message_id`.

Выполнены unit-тесты командой `npm run test:unit`; результат: 12/12 passed.
