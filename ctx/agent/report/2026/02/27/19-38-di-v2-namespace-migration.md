# Отчёт итерации: DI v2 Namespace Migration

## Резюме изменений

Цель итерации: синхронизировать документацию проекта с моделью namespace auto-discovery в `@teqfw/di` v2 и удалить устаревшие описания ручной регистрации namespace roots.

Изменены файлы:
- `ctx/docs/code/di.md`
- `ctx/docs/code/bootstrap.md`
- `ctx/docs/code/conventions.md`
- `ctx/docs/code/testing.md`
- `ctx/docs/code/testing/unit-bootstrap.md`
- `ctx/docs/code/testing/dev-bootstrap.md`

## Детали работ

Удалены устаревшие секции и формулировки:
- ручной namespace mapping в bootstrap-документации;
- примеры `addNamespaceRoot(...)` в тестовых bootstrap-контрактах;
- утверждения о фиксированном единственном namespace root;
- формулировки о namespace-конфигурации внутри bootstrap как hardcoded логике.

Введена DI v2 namespace-модель:
- декларация namespace roots только в `package.json` через `teqfw.namespaces`;
- auto-discovery namespace через `TeqFw_Di_Config_NamespaceRegistry`;
- запрет ручной регистрации namespace roots в bootstrap и test bootstrap;
- поддержка одного или нескольких namespace roots при статической metadata-конфигурации;
- fail-fast при дублировании namespace prefix;
- обязательная сборка namespace registry и freeze контейнера до резолва зависимостей.

Добавлены агент-ориентированные ограничения в DI-контракт:
- namespace mapping обязан быть в `package.json`;
- агент не должен добавлять hardcoded namespace registration;
- агент не должен обходить namespace registry компонент;
- namespace roots должны быть обнаружимы без исполнения project-кода.

## Результаты

- Документация `di.md` и `bootstrap.md` приведена к единой модели DI v2.
- Сопутствующие документы кодовой ветки (`conventions.md`, `testing.md`, `testing/unit-bootstrap.md`, `testing/dev-bootstrap.md`) синхронизированы с новой namespace-моделью.
- Поиск по `ctx/docs/` подтвердил отсутствие примеров ручного namespace mapping и `addNamespaceRoot(...)`.
- Требование по обязательному отчёту итерации выполнено.
