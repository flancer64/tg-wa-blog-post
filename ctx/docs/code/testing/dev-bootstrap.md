# Dev Test Bootstrap

Path: `./ctx/docs/code/testing/dev-bootstrap.md`

## Назначение

Документ фиксирует нормативную форму тестового composition root для dev-тестов Telegram Translation Publisher.

Файл размещается строго в:

```txt
test/dev/dev-bootstrap.mjs
```

`dev-bootstrap.mjs` является единственной точкой инициализации DI-контейнера в зоне dev-тестирования и используется всеми dev-тестами.

Dev bootstrap не использует production bootstrap и не изменяет его поведение. Production по-прежнему имеет единственный composition root.

## Инварианты

`dev-bootstrap.mjs`:

- создаёт новый экземпляр `@teqfw/di` Container;
- включает `enableTestMode()`;
- вычисляет `projectRoot` относительно собственного расположения;
- настраивает namespace root:
  - `Namespace_Back_ → src/`
  - `Teqfw_Di_ → node_modules/@teqfw/di/src`
- допускает использование реального `ConfigurationLoader`;
- допускает ручную регистрацию или переопределение `Configuration` через `container.register`;
- не выполняет прикладного run-cycle;
- не вызывает `App.run()`;
- не содержит бизнес-логики.

Dev bootstrap предназначен для частичной сборки графа зависимостей и запуска изолированного фрагмента системы в реальном окружении.

Каждый dev-тест создаёт собственный контейнер через данный bootstrap. Переиспользование контейнера между тестами не допускается.

## Поведение конфигурации

Dev bootstrap:

- может загружать реальный `.env`;
- может использовать реальные API-ключи;
- допускает переопределение конфигурации вручную;
- не вводит отдельного dev-режима логирования.

Работа с конфигурацией должна оставаться детерминированной на уровне контейнера, но допускает side effects во внешнем окружении.

## Допустимые побочные действия

Dev bootstrap не ограничивает:

- вызовы LLM API;
- вызовы Telegram API;
- запись в `./var/data`;
- сетевые обращения;
- файловые операции.

Dev-тесты могут быть недетерминированными и зависеть от состояния внешнего окружения.

## Нормативный шаблон

```js
import Container from "@teqfw/di";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Create and configure DI container for backend dev tests. Load real configuration.
 *
 * @param {{override?: (container: TeqFw_Di_Container) => Promise<void>|void, configOverride?: Object}} [options]
 * @returns {Promise<TeqFw_Di_Container>}
 */
export async function createDevContainer(options = {}) {
  /** @type {TeqFw_Di_Container} */
  const container = new Container();
  container.enableTestMode();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(__dirname, "../..");

  /** @type {TeqFw_Di_Container_Resolver} */
  const resolver = container.getResolver();
  resolver.addNamespaceRoot("Namespace_Back_", path.join(projectRoot, "src"), "mjs");
  resolver.addNamespaceRoot("Teqfw_Di_", path.join(projectRoot, "node_modules", "@teqfw", "di", "src"), "js");

  // Load real configuration
  /** @type {Namespace_Back_Configuration_Loader} */
  const loader = await container.get("Namespace_Back_Configuration_Loader$");
  await loader.load({ projectRoot });
  return container;
}
```

## Итог

`dev-bootstrap.mjs` является вспомогательным composition root для dev-тестирования, позволяющим запускать реальные части системы в изолированном контейнере с возможностью частичного переопределения зависимостей. Он не влияет на production bootstrap, не расширяет CLI-контракт и не изменяет архитектурные инварианты приложения.
