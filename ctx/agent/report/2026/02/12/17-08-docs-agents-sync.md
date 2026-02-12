# Итерационный отчёт `docs-agents-sync`

## Резюме изменений

В ветке `ctx/docs` выполнена синхронизация локальных входных инструкций для агентов: созданы недостающие `AGENTS.md` во всех подкаталогах и обновлён `ctx/docs/architecture/AGENTS.md` для соответствия фактическому составу каталога.

## Детали работ

1. Проанализированы иерархические требования файлов `AGENTS.md`: `AGENTS.md`, `ctx/AGENTS.md`, `ctx/docs/AGENTS.md`, `ctx/docs/architecture/AGENTS.md`, `ctx/docs/product/AGENTS.md`, а также правила отчётности `ctx/agent/AGENTS.md` и `ctx/agent/report/AGENTS.md`.
2. Созданы файлы:
   - `ctx/docs/code/AGENTS.md`
   - `ctx/docs/code/configuration/AGENTS.md`
   - `ctx/docs/code/external/AGENTS.md`
   - `ctx/docs/code/storage/AGENTS.md`
   - `ctx/docs/composition/AGENTS.md`
   - `ctx/docs/constraints/AGENTS.md`
   - `ctx/docs/environment/AGENTS.md`
3. Обновлён `ctx/docs/architecture/AGENTS.md`: в раздел «Карта уровня» добавлен `glossary.md`; карта приведена к актуальному составу каталога и алфавитному порядку.
4. Проверено покрытие подкаталогов `ctx/docs`: для каждого каталога присутствует локальный `AGENTS.md`.

## Результаты

- Требование «создать или обновить `AGENTS.md` во всех подкаталогах `ctx/docs`» выполнено.
- Новые и обновлённые документы содержат секцию «Карта уровня» и учитывают правила иерархии контекста.
- Для документов уровня `ctx/docs` сохранены локальные инварианты: декларативный стиль и отсутствие ручных переносов внутри абзацев.
