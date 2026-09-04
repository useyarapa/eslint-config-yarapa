# eslint-config-yarapa

Opinionated, deterministic ESLint Flat Config for modern JavaScript and TypeScript projects.

YARAPA provides one shared coding style across JavaScript, TypeScript, Node.js, React, Next.js, and NestJS projects. Framework profiles extend the same baseline rather than introducing separate coding philosophies.

## Requirements

- Node.js `>=24.15.0 <25`
- ESLint `^10.0.0`
- TypeScript `>=5.0.0 <6.1.0` for TypeScript projects

## Install

```sh
pnpm add -D eslint eslint-config-yarapa typescript
```

## Configure

Create `eslint.config.mjs`:

```js
import yarapa from "eslint-config-yarapa";

export default yarapa;
```

The default profile applies the shared JavaScript and TypeScript rules, including type-aware TypeScript rules through `projectService`.

## Framework profiles

Choose the profile that matches the runtime:

```js
import next from "eslint-config-yarapa/next";

export default next;
```

Available profiles:

- `eslint-config-yarapa` — shared JavaScript and TypeScript baseline
- `eslint-config-yarapa/next` — baseline plus Next.js and React rules
- `eslint-config-yarapa/react` — baseline plus React and JSX rules
- `eslint-config-yarapa/nest` — baseline plus Node.js rules

Framework profiles are static Flat Config arrays. They do not change based on which packages happen to be installed.

## Run ESLint

```sh
pnpm exec eslint .
```

When using type-aware rules, run ESLint from the project root containing the relevant `tsconfig.json` files.

## License

MIT
