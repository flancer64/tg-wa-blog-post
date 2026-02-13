# Итерация: пересборка `types.d.ts` по шаблону `InstanceType`

## Резюме изменений

`types.d.ts` пересобран по корректному шаблону: `type Namespace_Component = InstanceType<typeof import("...").default>`.

## Детали работ

- В `types.d.ts` заменены все alias-объявления:
  - было: `type X = import("...").default`
  - стало: `type X = InstanceType<typeof import("...").default>`
- Обновление выполнено для всех модулей из `src/`.

## Результаты

- Обновлён файл: `types.d.ts`.
- Формат типов приведён к шаблону из `ctx/docs/code/conventions.md`.
