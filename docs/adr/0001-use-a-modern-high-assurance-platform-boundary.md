---
status: accepted
---

# Use a modern high-assurance platform boundary

`eslint-config-yarapa` targets ESLint 10 Flat Config, ESM consumption, Node.js
`>=24.15.0`, and TypeScript `>=5.0.0 <6.1.0`. The package does not support
legacy `.eslintrc`, CommonJS package consumption, old Node.js lines, or
TypeScript 7 before the TypeScript ESLint ecosystem can consume its compiler API
reliably. This deliberately narrow boundary allows the configuration to use
current plugin releases and modern ESLint capabilities without carrying legacy
compatibility paths in a policy package intended for regulated Thai banking
repositories.

## Considered options

- Supporting legacy and Flat Config together was rejected because it would
  create two behavioural APIs and double the verification surface.
- Dual ESM and CommonJS publishing was rejected because Flat Config and the
  selected plugins are modern ESM-oriented dependencies.
- Pinning old plugin majors to preserve Node.js 20 or 22 was rejected because a
  new high-assurance package must not begin with an intentionally stale control
  surface.
- Claiming TypeScript 7 support through peer overrides was rejected because the
  current parser cannot provide reliable typed linting against that compiler.

## Consequences

Consumer repositories must upgrade their lint runtime before adoption. In
exchange, every supported environment receives one platform contract and one
compatibility matrix. Raising a supported runtime floor or narrowing a peer
range is a breaking package change.
