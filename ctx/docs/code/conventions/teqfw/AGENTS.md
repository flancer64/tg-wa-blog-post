# TeqFW Conventions

Path: `./ctx/docs/code/conventions/teqfw/AGENTS.md`
Template Version: `20260312`

## Purpose

The `ctx/docs/code/conventions/teqfw/` directory contains declarative engineering conventions specific to TeqFW component addressing, module structure, and static typing aids. Documents at this level define stable implementation forms used by TeqFW packages without redefining broader code-level boundaries.

## Level Map

- `AGENTS.md` — this document, defining the boundaries and structure of the `teqfw/` convention level.
- `component-types.md` — architectural component categories used in TeqFW and their normative ES module publication forms.
- `es6-modules.md` — normative structural convention for TeqFW DI-compatible ES modules managed by the dependency container.
- `namespaces.md` — canonical addressing convention for TeqFW components using namespace identifiers.
- `types-map.md` — convention for TeqFW type maps that connect namespace identifiers to static type declarations.

The list above is alphabetical and serves navigation purposes.

## Reading Order

For conceptual understanding the documents should be read in the following order:

1. `namespaces.md` — defines the canonical addressing model of components.
2. `component-types.md` — defines architectural component categories used in the system.
3. `es6-modules.md` — defines how components are published through ES modules and instantiated by the container.
4. `types-map.md` — defines the static bridge between namespace identifiers and implementation modules used by IDE tooling.

This order reflects the conceptual model of TeqFW:

```
namespace identifier
↓
component type
↓
ES module publication
↓
static type mapping
```

## Level Boundary

This level defines TeqFW-specific implementation conventions only. It may refine component addressing, module form, and static type mapping, but it must not redefine repository topology, product semantics, runtime environment, or agent procedures.

## Summary

`ctx/docs/code/conventions/teqfw/AGENTS.md` defines the scope, navigation, and reading order of TeqFW-specific code conventions.
