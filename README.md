# eslint-config-yarapa

One deterministic ESLint Flat Config handwriting for modern JavaScript and TypeScript projects.

YARAPA keeps generic code style and correctness shared across projects. Framework entrypoints are small adapters around that same handwriting rather than independent style presets.

## Install

```sh
pnpm add --save-dev eslint-config-yarapa eslint typescript
```

The package is ESM-only and uses ESLint Flat Config.

## Supported toolchain

The declared ranges are intentionally bounded by CI evidence. The versions listed below are representative boundary/current cases exercised by CI, not exhaustive tests of every version inside each declared range.

| Dimension | Supported contract | CI evidence |
| --- | --- | --- |
| Node.js | `>=24.15.0 <25` | 24.15.0 and 24.20.0 |
| ESLint | `^10.0.0` | 10.0.0 and 10.9.1 |
| TypeScript | `>=5.0.0 <6.1.0` | 5.0.4, 5.9.3, and 6.0.3 |
| Next.js with `/next` | `>=16.0.0 <17` | 16.0.0 and 16.3.4 packed-consumer cases |
| React with `/react` | `>=19.0.0 <20` | 19.0.0 and 19.2.7 packed-consumer cases |
| NestJS with `/nest` | `>=12.0.0 <13` | 12.0.0 and 12.0.1 packed-consumer cases |

A new framework major is not considered supported until a real packed-consumer case proves it.

## Choose one semantic entrypoint

### Generic JavaScript or TypeScript

```js
// eslint.config.mjs
import yarapa from "eslint-config-yarapa";

export default yarapa;
```

### Next.js

```js
// eslint.config.mjs
import yarapaNext from "eslint-config-yarapa/next";

export default yarapaNext;
```

`/next` adds the browser/Node/JSX environment, React Hooks correctness, and maintained Next.js framework diagnostics to the shared YARAPA handwriting.

### NestJS

```js
// eslint.config.mjs
import yarapaNest from "eslint-config-yarapa/nest";

export default yarapaNest;
```

`/nest` adds the Node.js runtime semantics expected by backend services. It does not create a separate Nest-specific code style.

### React libraries and applications

```js
// eslint.config.mjs
import yarapaReact from "eslint-config-yarapa/react";

export default yarapaReact;
```

`/react` adds browser/JSX and React Hooks correctness while retaining the same shared generic rules.

## Compose ordinary project overrides

Each entrypoint exports a Flat Config array, so normal ESLint composition works without a YARAPA-specific API.

```js
import yarapa from "eslint-config-yarapa";

export default [
  ...yarapa,
  {
    files: ["scripts/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];
```

Keep overrides narrow and evidence-based. A project override should describe a real project boundary, not recreate a second style system.

## Type-aware TypeScript

TypeScript source is linted with TypeScript Project Service. Run ESLint from the repository root and ensure every TypeScript file belongs to the intended `tsconfig.json`.

A source file that is outside its project commonly produces Project Service/parser errors. Fix the TypeScript project boundary rather than disabling type-aware rules globally.

Typical checks include Promise handling, unsafe or unnecessary type operations, import/type-import ownership, and TypeScript-aware replacements for overlapping core rules.

## Formatting and fixes

YARAPA uses ESLint with `@stylistic` as the canonical formatter owner for supported formatting concerns.

```sh
pnpm exec eslint . --fix
```

Do not place Prettier, Biome, editor formatting, or staged-file automation in charge of the same syntax if it rewrites code differently from YARAPA. The repository's autofix tests require deterministic, idempotent ESLint output.

## Test code

Test files keep the same generic YARAPA handwriting as production source. YARAPA does not infer installed test runners and does not expose `/vitest`, `/jest`, `/ava`, or Testing Library public presets.

When a project needs runner-specific correctness rules, compose the maintained runner/library Flat Config explicitly and scope it to the project's test files. Keep generic formatting, imports, TypeScript safety, async/error handling, naming, and suppression discipline on the shared YARAPA owners.

## Canonical examples

The repository contains executable examples under:

- `examples/next`
- `examples/nest`
- `examples/react`

Their repository-local `eslint.config.mjs` files load the built workspace artifact so CI can lint the examples before publication. Consumer projects should use the package imports shown in the quick starts above.

Together the examples demonstrate value imports and type-only imports, typed module boundaries, async work and explicit error handling, an App Router-shaped Next.js page boundary, React component/custom-hook composition, and a NestJS service/repository boundary.

The examples are intentionally dependency-light. Real framework package installation and config loading are verified separately through packed-consumer compatibility jobs.

## Troubleshooting

### TypeScript file is not part of a project

Check the nearest `tsconfig.json`, its `include`/`exclude` boundaries, and the directory from which ESLint is executed. YARAPA uses Project Service rather than requiring consumers to maintain a `parserOptions.project` glob.

### Import resolution differs from TypeScript

Keep the consumer's TypeScript configuration authoritative and ensure aliases/packages resolve from that project. YARAPA includes its TypeScript import resolver; avoid adding a competing resolver unless the project has a concrete unsupported requirement.

### Next.js or React plugin/config errors

Use the matching semantic entrypoint once. Do not compose multiple copies of the same framework profile or manually register the plugins that the profile already owns.

### Tool or framework major upgrade

Do not assume a new major is supported because installation succeeds. Check this README and CI compatibility contract; new majors are added only after real consumer verification.

## Versioning

Changes that alter consumer-visible diagnostics, rule severity/options, exported entrypoints, or supported compatibility can require a SemVer change. After `1.0.0`, a change that makes previously accepted consumer code fail solely because YARAPA became stricter is treated as breaking unless the affected behavior is a defect correction with a documented compatibility rationale.

Before `1.0.0`, minor versions may carry consumer-visible changes; review release notes when upgrading.

## Contributing releases

This workspace uses [Changesets](https://github.com/changesets/changesets) for package versioning and release notes.

For a release-impacting change:

```sh
pnpm changeset
```

Choose `eslint-config-yarapa`, select the semver impact, and write a user-facing summary. For changes with intentionally no package release impact, use `pnpm changeset --empty`.

Merging normal PRs does not publish directly. Changesets creates or updates a `chore: version packages` PR on `main`; publishing occurs only after that version PR is merged and the npm Trusted Publisher path succeeds.

## Design heritage

YARAPA modernizes durable conventions found in established JavaScript style guides, including Airbnb's JavaScript Style Guide, but `eslint-config-airbnb` is not a dependency, runtime preset, compatibility layer, or public API. Maintained ESLint core, `typescript-eslint`, `@stylistic`, framework plugins, and other explicit rule owners remain authoritative for implementation.

## Security

Do not disclose vulnerabilities in public issues. Follow [SECURITY.md](./SECURITY.md) for the private reporting path.

## Releases

Changesets maintains version/changelog PRs, package tags, and GitHub Releases. npm publication uses npm Trusted Publishing through GitHub Actions OIDC and does not use a long-lived `NPM_TOKEN`.

The npm package must have a registry-side Trusted Publisher configured for this repository with workflow filename `release.yml`; the repository workflow itself lives at `.github/workflows/release.yml`. Repository workflow files cannot configure that npm account setting by themselves.

Changesets creates its Version Packages PR with the repository `GITHUB_TOKEN`. GitHub places the resulting pull-request Actions runs in an approval-required state, so a maintainer must approve those CI runs before the version PR can satisfy required checks. This repository intentionally does not add a long-lived PAT or a custom approval bot to bypass that gate.

Every publish run rebuilds and executes the package verification path, including lint, type checking, tests, `publint`, AreTheTypesWrong, packing, installation, import, and real ESLint consumer smoke tests before registry publication.

## License

MIT
