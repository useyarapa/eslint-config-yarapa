# eslint-config-yarapa

Strict, high-assurance ESLint Flat Config presets for JavaScript and
TypeScript repositories in regulated Thai banking environments.

## Public API

```ts
import { configs } from "eslint-config-yarapa";
```

`configs` exposes sixteen Flat Config array presets: `recommended`, `base`,
`typescript`, `typeChecked`, `disableTypeChecked`, `node`, `browser`,
`stylistic`, `ignores`, `security`, `testingLibrary`, `vitest`, `ava`, `json`,
`packageJson`, and `jsdoc`.

## Development

```sh
pnpm --filter eslint-config-yarapa build
pnpm --filter eslint-config-yarapa test
pnpm --filter eslint-config-yarapa check-types
```
