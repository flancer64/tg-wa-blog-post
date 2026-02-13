# Unit Test Bootstrap

Path: `./ctx/docs/code/testing/unit-bootstrap.md`

## Назначение

Документ фиксирует нормативную форму тестового composition root для unit-тестов ADSM-проектов.

Файл размещается строго в:

```txt
test/unit/unit-bootstrap.mjs
```

`unit-bootstrap.mjs` является единственной точкой инициализации DI-контейнера в тестовой зоне и используется всеми unit-тестами.

Helper не использует production bootstrap и не расширяет namespace-модель проекта.

## Инварианты

`unit-bootstrap.mjs`:

- создаёт новый экземпляр `@teqfw/di` Container;
- включает `enableTestMode()`;
- вычисляет `projectRoot` относительно собственного расположения;
- настраивает namespace root:
  - `Namespace_Back_ → src/`
  - `Teqfw_Di_ → node_modules/@teqfw/di/src`

- возвращает готовый контейнер;
- не выполняет `container.register` по умолчанию;
- не добавляет дополнительных namespace;
- не содержит бизнес-логики.

Каждый unit-тест создаёт собственный контейнер через данный bootstrap. Переиспользование контейнера между тестами не допускается.

## Нормативный шаблон

```js
/**
 * @description Test composition root for backend unit tests.
 */

import Container from "@teqfw/di";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Create and configure a clean DI container for backend unit tests.
 * @returns {Promise<TeqFw_Di_Container>}
 */
export async function createTestContainer() {
  /** @type {TeqFw_Di_Container} */
  const container = new Container();
  container.enableTestMode();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(__dirname, "../..");

  /** @type {TeqFw_Di_Container_Resolver} */
  const resolver = container.getResolver();

  resolver.addNamespaceRoot("Namespace_Back_", path.join(projectRoot, "src"), "mjs");

  resolver.addNamespaceRoot("Teqfw_Di_", path.join(projectRoot, "node_modules", "@teqfw", "di", "src"), "js");

  return container;
}
```

## Итог

`unit-bootstrap.mjs` является тестовым composition root, обеспечивающим строгую DI-изоляцию, независимость от production bootstrap и детерминированную среду выполнения unit-тестов.
