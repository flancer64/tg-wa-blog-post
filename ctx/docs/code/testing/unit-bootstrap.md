# Unit Test Bootstrap

Path: `./ctx/docs/code/testing/unit-bootstrap.md`

## Назначение

Документ фиксирует нормативную форму тестового composition root для unit-тестов ADSM-проектов.

Файл размещается строго в:

```txt
test/unit/unit-bootstrap.mjs
```

`unit-bootstrap.mjs` является единственной точкой инициализации DI-контейнера в тестовой зоне и используется всеми unit-тестами.

Helper не использует production bootstrap и не изменяет декларативную namespace-модель проекта.

## Инварианты

`unit-bootstrap.mjs`:

- создаёт новый экземпляр `@teqfw/di` Container;
- включает `enableTestMode()`;
- вычисляет `projectRoot` относительно собственного расположения;
- создаёт `TeqFw_Di_Config_NamespaceRegistry`;
- строит namespace registry через metadata auto-discovery;
- передаёт namespace registry в конфигурацию контейнера;
- переводит контейнер в frozen-состояние до `container.get(...)`;
- возвращает готовый контейнер;
- не выполняет `container.register` по умолчанию;
- не выполняет ручную регистрацию namespace roots;
- не содержит бизнес-логики.

Каждый unit-тест создаёт собственный контейнер через данный bootstrap. Переиспользование контейнера между тестами не допускается.

## Нормативный шаблон

```js
/**
 * @description Test composition root for backend unit tests.
 */

import Container from "@teqfw/di";
import NamespaceRegistry from "@teqfw/di/src2/Config/NamespaceRegistry.js";
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

  /** @type {TeqFw_Di_Config_NamespaceRegistry} */
  const namespaceRegistry = new NamespaceRegistry();
  await namespaceRegistry.build({ projectRoot });
  container.setNamespaceRegistry(namespaceRegistry);
  container.freeze();

  return container;
}
```

## Итог

`unit-bootstrap.mjs` является тестовым composition root, обеспечивающим строгую DI-изоляцию, независимость от production bootstrap и детерминированную среду выполнения unit-тестов.
