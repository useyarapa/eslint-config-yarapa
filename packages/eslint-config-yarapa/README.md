# eslint-config-yarapa

Strict, high-assurance ESLint Flat Config presets for JavaScript and
TypeScript repositories in regulated Thai banking environments.

> **Status: work in progress.** This package is being implemented per
> [`docs/POLICY.md`](../../docs/POLICY.md) and the ADRs in
> [`docs/adr/`](../../docs/adr/). See
> [issue #1](https://github.com/useyarapa/eslint-config-yarapa/issues/1) for
> the full implementation checklist and current progress.

## Public API (target)

```ts
import { configs } from "eslint-config-yarapa";
```

`configs` will expose sixteen Flat Config array presets: `recommended`,
`base`, `typescript`, `typeChecked`, `disableTypeChecked`, `node`, `browser`,
`stylistic`, `ignores`, `security`, `testingLibrary`, `vitest`, `ava`, `json`,
`packageJson`, and `jsdoc`. See `docs/POLICY.md` for the full contract.

## Development

```sh
pnpm --filter eslint-config-yarapa build
pnpm --filter eslint-config-yarapa test
pnpm --filter eslint-config-yarapa check-types
```
