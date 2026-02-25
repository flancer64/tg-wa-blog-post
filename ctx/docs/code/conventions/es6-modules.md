# ES6 Module Form — DI-Compatible Runtime Module

Path: `./ctx/docs/code/conventions/es6-modules.md`
Version: `20260223`

## Purpose

This document defines the normative structural form of ES6 runtime modules intended for use with a dependency injection container.

It specifies implementation-level conventions governing:

- module export form,
- constructor structure,
- dependency descriptor format,
- instance API exposure,
- interaction with JSDoc structural typing.

This document defines engineering conventions only.
It does not define architectural semantics, dependency graph construction, product meaning, or execution dynamics.

## Normative Module Form

A DI-compatible ES6 module MUST:

- be a valid ES6 module;
- include `// @ts-check`;
- contain a module-level JSDoc block describing structural role;
- export exactly one `default` class;
- optionally export a static dependency descriptor named `__deps__`.

The `default` export MUST be a `class`.

Default-exported factory functions are prohibited.

Absence of a class default export constitutes structural non-conformance.

## Canonical Module Example

```js
// @ts-check

/**
 * Service responsible for user-related operations.
 * Instantiated via dependency injection container.
 */

export const __deps__ = {
  default: {
    userRepo: "Namespace_Package_Service_UserRepo$",
    logger: "Namespace_Package_Service_Logger$",
  },
};

/**
 * @typedef {Object} UserService$Deps
 * @property {Namespace_Package_Service_UserRepo$} userRepo
 * @property {Namespace_Package_Service_Logger$} logger
 */

export default class UserService {
  /**
   * Creates service instance with resolved dependencies.
   *
   * @param {UserService$Deps} deps
   */
  constructor({ userRepo, logger }) {
    logger.log(userRepo.save("User data"));
  }
}
```

The example is normative in structure, not in business logic.

## Constructor Contract

The constructor MUST:

- accept exactly one argument — a structured dependency object;
- destructure dependencies from that object;
- reference an explicit `@typedef` describing dependency structure;
- not perform dependency presence validation;
- not mutate the dependency object.

Dependency correctness is assumed to be guaranteed by the container layer.

The dependency object is considered logically immutable.

## Dependency Descriptor (`__deps__`)

If present, `__deps__`:

- MUST be a pure static object;
- MUST declare dependencies using symbolic identifiers;
- MUST not execute logic;
- MUST not depend on runtime state.

`__deps__` defines structural linkage only.

Its presence is optional at module level but required by containers that rely on explicit dependency declaration.

## Instance API Exposure

Public instance API MAY be defined:

- as prototype methods,
- or via assignments inside the constructor (`this.method = …`).

No restriction is imposed on method placement provided that:

- the API surface is explicit,
- no side effects occur at module evaluation time.

Inheritance is permitted but MUST remain structurally transparent and MUST NOT encode implicit dependency semantics.

## Encapsulation and State

Internal state MAY be stored:

- in private fields,
- in constructor-local variables (closure),
- in standard instance properties.

No specific encapsulation mechanism is mandated.

Encapsulation strategy MUST NOT interfere with predictable construction and structural typing discipline.

## Top-Level Module Rules

Top-level module code:

- MUST NOT execute business logic;
- MUST NOT access platform APIs;
- MUST NOT instantiate runtime objects that alter global state.

Only static declarations and pure structural constants are allowed.

All runtime behavior MUST originate from instance construction.

## Structural Typing Alignment

Modules MUST comply with the JSDoc Structural Typing Specification.

In particular:

- constructors MUST reference declared typedefs;
- structured contracts MUST be explicit;
- type guards MAY be used only for union narrowing;
- assertion-style predicates are prohibited;
- domain invariants MUST NOT be encoded in JSDoc.

Structural typing MUST remain runtime-neutral.

## Prohibited Practices

Within DI-compatible ES6 modules, the following are prohibited:

- default export as non-class;
- mutation of dependency object;
- implicit dependency access outside constructor parameters;
- business logic executed at module evaluation time;
- encoding domain rules in JSDoc types;
- parallel typing systems.

## Determinism Requirement

The module form MUST ensure:

- structurally predictable construction;
- explicit dependency declaration;
- reviewable structural contracts;
- machine-parsable static linkage.

Structural form must remain stable under static analysis.

## Conformance Boundary

Violation of any structural rule defined in this document constitutes an implementation-level defect.

Deviation is not stylistic and must be corrected.
