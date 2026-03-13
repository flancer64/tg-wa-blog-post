# ES6 Modules Convention in TeqFW

Path: `./ctx/docs/code/convention/teqfw/es6-modules.md`
Template Version: `20260312`

## Document Scope

The TeqFW platform operates on standard ES6 modules. This document defines the structural conventions used by the platform for modules that are instantiated and linked by the TeqFW dependency container.

These conventions do not modify the ES module specification. Any valid ES module may exist in a TeqFW application. The rules defined here apply only to modules that participate in container-managed instantiation.

## Container Interaction Model

The dependency container interacts with modules in three modes.

### Module Import

Any valid ES module can be imported by the container. No structural restrictions apply.

### Export Access

Any export of an imported module may be returned by the container as-is.

### Managed Instantiation

The container may instantiate exported entities and inject dependencies into them. This capability requires the module to follow the DI-compatible structure defined in this document.

## Module Categories

Modules used in a TeqFW application fall into two categories.

### Generic ES Module

A generic module follows only the ES module specification. The container can import such modules and return their exports. The container does not manage their lifecycle and does not instantiate their exports.

### DI-Compatible Module

A DI-compatible module follows the structural conventions required by the container. The container may instantiate its exports, inject dependencies, and manage their lifecycle.

## DI-Compatible Module Structure

A DI-compatible module exports a class intended to be instantiated by the container.

### Default Export

The module exports a default class.

```javascript
export default class Service {}
```

### Constructor Injection

Dependencies are provided through constructor parameters as a single structured object.

```javascript
constructor({ dependencyA, dependencyB }) {}
```

### Dependency Descriptor

Dependencies may be declared through a dependency descriptor exported as `__deps__`.

```javascript
export const __deps__ = { ... };
```

The descriptor maps constructor parameter names to Canonical Dependency Codes (CDC) used by the container.

When the module exports only a single container-managed `default` entity, the short descriptor form is preferred.

This form reduces the surface area for external mutation and keeps the module structure minimal.

## Dependency Descriptor Specification

The dependency descriptor defines how constructor parameters are resolved by the container.

### Descriptor Export

The descriptor is exported as a constant named `__deps__`.

```javascript
export const __deps__ = { ... };
```

The descriptor SHOULD be treated as immutable. Freezing the descriptor object is recommended.

### Descriptor Structure

The descriptor may appear in two forms.

#### Short Form

The short form is permitted when the module exports a single container-managed entity via `default`.

```javascript
export const __deps__ = Object.freeze({
  parameterName: "Namespace_Package_Service_Dependency$",
});
```

This form is interpreted as:

```javascript
export const __deps__ = Object.freeze({
  default: Object.freeze({
    parameterName: "Namespace_Package_Service_Dependency$",
  }),
});
```

### Full Form

The full form explicitly declares dependencies for each managed export.

```javascript
export const __deps__ = Object.freeze({
  ExportName: Object.freeze({
    parameterName: "Namespace_Package_Service_Dependency$",
  }),
});
```

### Constructor Binding

Constructor parameter names correspond to keys in the descriptor. The container resolves the CDC defined for each parameter and supplies the resolved dependency during instantiation.

### Descriptor Normalization

If the short form is used, the container internally normalizes it to the full form before processing.

## Encapsulation

DI-compatible modules SHOULD encapsulate dependencies using constructor closures.

Methods SHOULD be defined inside the constructor and assigned directly to the instance.

Constructor parameters SHOULD be used directly in closures and SHOULD NOT be copied into instance properties.

Prototype-based mutation SHOULD be avoided.

This pattern prevents external mutation of instance behaviour and works reliably with container-managed immutability.

## Composition Guidance

The TeqFW platform performs dependency resolution at runtime. Late binding through the container makes object composition the preferred approach for structuring behaviour and reduces the need for inheritance.

## Module Evaluation Constraints

Modules SHOULD remain safe to import. Top-level module code SHOULD NOT execute business logic.

## Structural Invariants

The following invariants apply to DI-compatible modules.

The module MUST remain safe to import. Top-level code MUST NOT execute business logic.

The dependency descriptor `__deps__`, if present, MUST be a static object and MUST NOT depend on runtime state.

Constructor dependencies MUST be received as a single structured object and destructured by parameter name.

Dependency validation MUST NOT be performed by the module. Dependency correctness is guaranteed by the container.

If multiple container-managed exports exist, each export MUST be explicitly declared in the dependency descriptor.

## Non-Conforming Modules

Modules that do not follow the DI-compatible structure remain valid ES modules. They may still be imported and their exports accessed by the container. Such modules cannot participate in container-managed instantiation.

## Examples

### Generic ES Module

```javascript
export function sum(a, b) {
  return a + b;
}
```

### DI-Compatible Module Without Dependencies

```javascript
export default class Clock {
  constructor() {
    this.now = function () {
      return Date.now();
    };
  }
}
```

### Canonical DI-Compatible Module

```javascript
export const __deps__ = Object.freeze({
  logger: "Namespace_Package_Service_Logger$",
});

export default class UserService {
  constructor({ logger }) {
    this.createUser = function (user) {
      logger.info("create user", user);
    };
  }
}
```

### Default Export With Explicit Descriptor

```javascript
export const __deps__ = Object.freeze({
  default: Object.freeze({
    logger: "Namespace_Package_Service_Logger$",
  }),
});

export default class UserService {
  constructor({ logger }) {
    this.createUser = function (user) {
      logger.info("create user", user);
    };
  }
}
```

### Multiple Managed Exports

```javascript
export const __deps__ = Object.freeze({
  Factory1: Object.freeze({
    userRepo: "Namespace_Package_Service_SubFactory1$",
    logger: "Namespace_Package_Service_Logger$",
  }),
  Factory2: Object.freeze({
    userRepo: "Namespace_Package_Service_SubFactory2$",
  }),
});

export class Factory1 {
  constructor({ userRepo, logger }) {
    this.run = function () {
      logger.info(userRepo);
    };
  }
}

export class Factory2 {
  constructor({ userRepo }) {
    this.run = function () {
      userRepo.execute();
    };
  }
}
```
