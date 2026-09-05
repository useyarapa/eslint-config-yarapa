---
"eslint-config-yarapa": major
---

Unify all capability layers (JavaScript, TypeScript, type-aware, Node.js runtime, browser globals, and React Hooks) into a single default Flat Config entrypoint. Specific framework rules are now file-scoped to `**/*.{jsx,tsx}` within the default configuration. Remove subpath exports `./react` and `./nest`.
