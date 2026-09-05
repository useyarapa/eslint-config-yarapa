# Global Landscape & Architectural Comparison

A comprehensive technical comparison evaluating `eslint-config-yarapa` against leading industry standards: **`@antfu/eslint-config`**, **Airbnb (`eslint-config-airbnb`)**, **Vercel (`@vercel/style-guide`)**, **Shopify (`@shopify/eslint-plugin`)**, and **Google (`gts`)**.

---

## 1. Global Benchmark Matrix

| Feature / Standard                    | `eslint-config-yarapa`         | `@antfu/eslint-config` | Airbnb (`airbnb-typescript`)    | Vercel (`@vercel/style-guide`) | Shopify (`@shopify/eslint-plugin`) | Google (`gts`)          |
| :------------------------------------ | :----------------------------- | :--------------------- | :------------------------------ | :----------------------------- | :--------------------------------- | :---------------------- |
| **Native ESLint 9/10 Flat Config**    | **YES (100% Pure Arrays)**     | YES (Factory Function) | NO (Legacy .eslintrc)           | PARTIAL (In progress)          | NO (Legacy .eslintrc)              | NO (Legacy .eslintrc)   |
| **Type-Aware via `projectService`**   | **YES (Built-in First-Class)** | PARTIAL (Opt-in only)  | NO (Slow parserOptions.project) | PARTIAL (Opt-in only)          | NO (Slow legacy parser)            | PARTIAL (Opt-in only)   |
| **Cognitive Complexity (`sonarjs`)**  | **YES (Integrated)**           | NO                     | NO                              | NO                             | NO                                 | NO                      |
| **Anti-ReDoS Protection (`regexp`)**  | **YES (Integrated)**           | NO                     | NO                              | NO                             | NO                                 | NO                      |
| **Natural Sorting (`perfectionist`)** | **YES (Integrated)**           | YES (Integrated)       | NO                              | NO                             | NO                                 | NO                      |
| **Zero Inline Suppression Policy**    | **YES (Enforced)**             | NO (Permissive)        | NO (Permissive)                 | NO (Permissive)                | NO (Permissive)                    | NO (Permissive)         |
| **Deterministic (Anti-Magic)**        | **YES (100% Explicit)**        | NO (Ambient Sniffing)  | YES (Explicit)                  | YES (Explicit)                 | YES (Explicit)                     | YES (Explicit)          |
| **Modern Stylistic (`@stylistic`)**   | **YES (Integrated)**           | YES (Integrated)       | NO (Deprecated Core)            | NO (External Prettier)         | NO (External Prettier)             | NO (External Prettier)  |
| **Regulated / Banking Target**        | **YES (Core Purpose)**         | NO (General Community) | NO (General Web)                | NO (Web Apps / Next.js)        | NO (E-Commerce Apps)               | NO (General TypeScript) |

---

## 2. In-Depth Comparative Analysis

### A. vs. `@antfu/eslint-config` (The Modern Community Giant)

- **The Philosophy Gap**: Anthony Fu's config is designed for rapid open-source experimentation across a vast ecosystem (Vue, Svelte, Astro, UnoCSS, TOML, YAML). It relies on **ambient auto-detection**, silently reading `package.json` at runtime to decide which rule layers to inject.
- **The YARAPA Distinction**: In regulated enterprise systems (banking, payments, fintech), ambient dependency sniffing represents an unacceptable **determinism risk**. A transitive or local dependency change could mutate the active ruleset silently, causing CI divergence. YARAPA enforces explicit, immutable Flat Config arrays (`eslint-config-yarapa`) ensuring 100% auditability and air-gapped reproducibility.

### B. vs. Airbnb (`eslint-config-airbnb` & `airbnb-typescript`)

- **The Legacy Architecture**: Airbnb defined the JavaScript linting standard of the 2010s. However, its architecture remains tethered to legacy `.eslintrc` cascading configs and deprecated ESLint core formatting rules.
- **Type-Checking Performance**: Airbnb's TypeScript guide relies on legacy `parserOptions.project`, which parses every file on every lint run, creating severe memory consumption and build-time bottlenecks.
- **The YARAPA Advantage**: YARAPA is built from the ground up on ESLint Flat Config and utilizes TypeScript's native `projectService`, giving instant, incremental type-aware analysis with zero legacy baggage.

### C. vs. Vercel (`@vercel/style-guide`)

- **Framework Breadth vs Depth**: Vercel provides excellent baseline rules tailored for Next.js and React. However, its coverage stops at basic syntax and standard best practices.
- **Quality & Security Deficits**: Vercel does not audit for algorithmic Regular Expression Denial of Service (ReDoS) or monitor Cognitive Complexity. Furthermore, Vercel configs permit widespread inline rule suppression (`// eslint-disable`), allowing technical debt to accumulate unchecked in team environments.
- **The YARAPA Advantage**: YARAPA wraps framework-agnostic linting in enterprise security layers (`eslint-plugin-sonarjs`, `eslint-plugin-regexp`) and zero-suppression discipline.

### D. vs. Shopify (`@shopify/eslint-plugin`) & Google (`gts`)

- **Monolithic Plugins vs Lean Composable Standards**: Shopify bundles dozens of bespoke plugins into custom legacy abstractions that are cumbersome to migrate to modern tooling. Google's `gts` is conservative and primarily acts as a wrapper around `typescript-eslint` defaults.
- **Deterministic Symmetry**: Neither Shopify nor Google enforces natural, deterministic sorting of imports, exports, and object keys. YARAPA integrates `eslint-plugin-perfectionist` to ensure that code order remains clean, predictable, and merge-conflict free.

---

## 3. Why YARAPA Wins for Regulated & High-Integrity Codebases

1. **Deterministic by Design (Zero Magic)**
   - No filesystem inspecting, no ambient sniffing, no unpredictable side effects.
2. **Defensive Security Embedded in the Linter**
   - Catches catastrophic ReDoS backtracking before regular expressions reach production.
   - Restricts cognitive complexity, preventing unmaintainable, vulnerability-prone functions.
3. **Engineering Rigor (Zero Suppression)**
   - When checks fail, engineers are required to fix the root cause rather than adding `// eslint-disable` or `// @ts-ignore`.
4. **All-in-One Code Hygiene**
   - Unifies syntax errors, type-checked promises, JSDoc validation, JSON formatting, package.json ordering, and stylistic consistency into a single cohesive package.
