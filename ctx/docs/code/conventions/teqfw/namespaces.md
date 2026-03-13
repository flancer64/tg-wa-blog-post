# Namespaces in TeqFW

Path: `./ctx/docs/code/convention/teqfw/namespaces.md`
Template Version: `20260312`

## Definition

A namespace identifier in TeqFW is the canonical logical address of a software component. It identifies the component itself rather than its file path, module specifier, or implementation.

In TeqFW, components are addressed by namespace identifiers rather than module paths. The dependency container resolves these identifiers to concrete implementations, usually ES modules.

## Concept

A namespace identifier is a structured logical name that uniquely identifies a component within the system. The identifier represents the logical component, while the implementation providing the behavior of that component is resolved separately by the dependency container.

General form:

```
Namespace_Component_Path
```

Example:

```
Fl32_Web_Back_Dispatcher
```

The identifier refers to the component identity. The implementation providing the behavior of this component is determined during application composition.

## Component Identity and Implementation

A namespace identifier refers to a component, not to the module implementing that component. The namespace identifies the architectural component, while the container resolves the concrete implementation.

Conceptual resolution chain:

```
Namespace identifier
        ↓
     component
        ↓
  implementation
        ↓
     ES module
```

Because of this separation, applications may substitute implementations or provide implementations for abstract components.

## Relationship to ES Modules

In most TeqFW projects, components are implemented by ES modules. The namespace identifier therefore usually resolves to a module file that provides the implementation.

Example:

```
Fl32_Web_Back_Dispatcher
        ↓
src/Back/Dispatcher.mjs
```

The module provides the implementation of the component, but the namespace identifier represents the component itself rather than the module.

## Namespace Structure

A namespace identifier consists of a namespace prefix and a component path.

Namespace prefix:

```
Namespace_
```

Component path:

```
Component_Path
```

Example:

```
Fl32_Web_Back_Dispatcher
```

Prefix:

```
Fl32_Web_
```

Component path:

```
Back_Dispatcher
```

The namespace prefix determines the root directory used to locate implementations.

## Mapping to Source Files

The dependency container uses namespace mappings to resolve component implementations. A common convention maps namespace identifiers to source files by translating underscore-separated segments into directory paths.

Example:

```
Namespace_A_B_C
        ↓
<namespace root>/A/B/C.mjs
```

Example:

```
Fl32_Web_Back_Dispatcher
        ↓
src/Back/Dispatcher.mjs
```

This mapping is a project convention used by the container and does not define the meaning of the namespace itself.

## Role in the Platform

Namespaces provide a unified addressing system for components in TeqFW. The same identifier is used consistently across multiple mechanisms of the platform.

Namespaces are used for:

```
component identification
dependency addressing in CDC
type addressing in JSDoc
container resolution
architectural documentation
```

Because of this role, namespace identifiers form the primary naming system for components within the platform.

## Default Export Convention

TeqFW commonly uses default exports for component implementations. When a component is implemented using a default export, the namespace identifier resolves to the module implementing the component, and the container uses the module's default export as the component implementation.

Example:

```javascript
export default class Dispatcher {}
```

In this case the identifier

```
Fl32_Web_Back_Dispatcher
```

addresses the component implemented by the module, and the container retrieves the default export as the implementation of that component.

## Named Export Addressing

A module may expose multiple exports. When a specific export must be referenced, the export is selected explicitly by the mechanism that references the component.

Example module:

```javascript
export function createDispatcher() {}
```

### Dependency addressing (CDC syntax)

In dependency declarations the export is selected using CDC addressing syntax:

```
Fl32_Web_Back_Dispatcher__createDispatcher$
```

### Type addressing (JSDoc syntax)

In JSDoc type references the export is selected using JSDoc addressing syntax:

```
Fl32_Web_Back_Dispatcher$createDispatcher
```

In both cases the namespace identifier still refers to the component identity, while the export selection syntax specifies which export of the implementation module should be used.

## Avoiding Incorrect Analogies

Namespaces in TeqFW should not be interpreted as common language constructs.

In Java a namespace corresponds to a package name.
In TypeScript or JavaScript it usually corresponds to a module path.
In Python it corresponds to a module path inside a package.

In TeqFW a namespace identifier represents the address of a component within the architecture of the system. It is therefore an architectural identifier rather than a filesystem identifier.

## Summary

A namespace identifier in TeqFW is the canonical logical address of a software component. Components are referenced through namespace identifiers rather than module paths, and the dependency container resolves these identifiers to concrete implementations, usually provided by ES modules.

Export selection may be expressed by context-specific addressing syntax used by dependency declarations or JSDoc annotations, but the namespace itself always refers to the component identity.

This mechanism provides a stable addressing system for components across runtime composition, dependency resolution, type annotations, and architectural documentation.
