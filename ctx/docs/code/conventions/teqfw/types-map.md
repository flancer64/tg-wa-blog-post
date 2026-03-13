# Type Maps in TeqFW

Path: `ctx/docs/code/conventions/teqfw/types-map.md`
Template Version: `20260312`

## 1. Purpose

A type map provides a static bridge between architectural namespace identifiers used by the dependency container and concrete JavaScript implementation modules.

Type maps exist solely for static tooling and support:

- IDE navigation
- static analysis
- JSDoc type inference
- automated analysis by development agents

Type maps do not participate in runtime execution and do not influence dependency resolution.

## 2. Namespace Domains

TeqFW architecture separates two addressing domains.

Runtime domain:

```
namespace identifiers
```

Static analysis domain:

```
files and types
```

Runtime code resolves dependencies using namespace identifiers through the DI container.

Static tooling operates on files and types.

A type map bridges these domains without introducing runtime coupling.

## 3. Type Map Definition

A type map is a deterministic mapping between architectural namespace identifiers and module types.

Example:

```ts
type Ns_Component = import("./src/Component.mjs").default;
```

Each mapping references the JavaScript module implementing the component.

The type map does not define behavior or structure. Structural information is derived from the referenced implementation module.

## 4. Type Map File

Each npm package that exposes namespace-addressable components contains exactly one type map file.

Convention:

```
types.d.ts
```

The file is referenced in `package.json`:

```json
{
  "types": "types.d.ts"
}
```

## 5. Global Type Registry

All type aliases defined in the type map are declared in the global type namespace.

This is required because JSDoc annotations cannot reference module-scoped type exports.

Example:

```ts
declare global {
  type Ns_Component = import("./src/Component.mjs").default;
}
```

### Module Invariant

The `types.d.ts` file is a module file and **must end with**:

```ts
export {};
```

This ensures that:

- the declaration file is treated as a module by `tsserver`
- global namespace augmentation remains stable
- IDE type resolution functions correctly.

## 6. Namespace Mapping Rules

Namespace identifiers correspond deterministically to source modules.

### 6.1 Namespace → File Path

Namespace identifiers map to file paths using the rule:

```
Namespace prefix removed
Underscore "_" → directory separator "/"
```

Example:

```
Ns_Module_Service
→
src/Module/Service.mjs
```

The type map must not contradict this rule.

### 6.2 Class Component Mapping

For class-based modules the namespace identifier maps to the instance type of the default export.

```ts
type Ns_Component = import("./src/Component.mjs").default;
```

Constructor type may be obtained using:

```
typeof Ns_Component
```

### 6.3 Enum Component Mapping

Enum modules export constant value objects.

The namespace identifier maps to the value type of the exported object.

```ts
type Ns_Enum = typeof import("./src/Enum/Name.mjs").default;
```

### 6.4 Named Export Aliases

Named exports may be referenced using the convention:

```
Namespace$ExportName
```

Example:

```ts
type Ns_Component$Config = import("./src/Component.mjs").Config;
```

Properties:

- `$` separates module namespace from export name
- the alias exists only in the type namespace
- it is not a CDC dependency identifier

### 6.5 Nested Module Mapping

If a concept is implemented as a separate module file it becomes a normal namespace component.

Example file:

```
src/Dto/Resolver/Config/DTO.mjs
```

Namespace:

```
TeqFw_Di_Dto_Resolver_Config_DTO
```

Mapping:

```ts
type TeqFw_Di_Dto_Resolver_Config_DTO = import("./src/Dto/Resolver/Config/DTO.mjs").default;
```

Such identifiers belong to the runtime namespace and therefore must not contain `$`.

## 7. Deterministic File Structure

The structure of `types.d.ts` is deterministic.

The file contains a single global declaration block.

Example:

```ts
declare global {
  type Ns_Component = import("./src/Component.mjs").default;

  type Ns_Component$Options = import("./src/Component.mjs").Options;

  type Ns_Enum = typeof import("./src/Enum/Life.mjs").default;
}

export {};
```

Entries must be sorted alphabetically by type identifier.

## 8. Allowed Declaration Forms

Only the following declaration forms are allowed.

Class component mapping

```
type Ns_Component =
  import("./src/...").default;
```

Enum value mapping

```
type Ns_Enum =
  typeof import("./src/...").default;
```

Named export alias

```
type Ns_Component$Export =
  import("./src/...").Export;
```

Type maps must not contain:

- interfaces
- structural type definitions
- method signatures
- custom type declarations.

## 9. Generation Invariants

The type map is a generated artifact derived from:

```
namespace registry
+
source file structure
```

The generated file satisfies the following invariants:

- every namespace identifier has a corresponding type alias
- referenced source files exist
- namespace → path rule holds
- no duplicate type identifiers exist
- entries are sorted alphabetically
- `$` never appears in CDC namespace identifiers
- `types.d.ts` ends with `export {}`

## 10. IDE Integration

When a package declares:

```
"types": "types.d.ts"
```

VSCode automatically loads the type map and:

- resolves `import()` references
- derives type information from implementation modules
- exposes type aliases globally.

## 11. Summary

Type maps bind architectural namespace identifiers to implementation modules while remaining independent from runtime dependency resolution.

A type map:

- maps namespace identifiers to module types
- supports class components and enum modules
- supports named export aliases using `Namespace$Export`
- declares all types globally for JSDoc compatibility
- follows deterministic namespace → file path rules
- is generated automatically
- ends with `export {}`

The structure is deterministic and can be validated mechanically.
