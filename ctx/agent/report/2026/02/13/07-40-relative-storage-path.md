# Итерация: relative-storage-path

## Резюме изменений

Исправлена ошибка записи артефактов в абсолютный путь `/var/data`: слой хранения переведён на каталог `./var/data` относительно `process.cwd()`. Документация синхронизирована с новым инвариантом, тесты обновлены и успешно пройдены.

## Детали работ

- Подтверждена причина ошибки `EACCES`: в `src/Storage/Repository.mjs` был жёстко задан абсолютный путь `'/var/data'`.
- Изменён `src/Storage/Repository.mjs`: базовый каталог хранения теперь вычисляется как `path.join(process.cwd(), 'var', 'data')`.
- Обновлён `test/Storage.test.mjs` под новый контракт пути и внедрение `node:process` в DI для репозитория.
- Обновлены документы с явной фиксацией относительного пути хранения:
  - `ctx/docs/code/storage/overview.md`;
  - `ctx/docs/environment/overview.md`;
  - `ctx/docs/code/testing.md`.
- Выполнен полный прогон unit-тестов (`npm test`).

## Результаты

- Ошибка прав доступа к `/var/data` устранена на уровне кода и контрактов.
- Хранение агрегатов выполняется в `./var/data` относительно рабочей директории процесса.
- Все тесты пройдены: 10/10.
- Изменённые артефакты:
  - `src/Storage/Repository.mjs`
  - `test/Storage.test.mjs`
  - `ctx/docs/code/storage/overview.md`
  - `ctx/docs/environment/overview.md`
  - `ctx/docs/code/testing.md`
  - `ctx/agent/report/2026/02/13/07-40-relative-storage-path.md`
