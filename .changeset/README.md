# Changesets

Release-impacting pull requests should include a Changeset.

Run:

```sh
pnpm changeset
```

Select the affected publishable package, choose `patch`, `minor`, or `major`, and write a concise user-facing release note.

For changes with intentionally no package release impact, use the standard empty Changeset flow:

```sh
pnpm changeset --empty
```

`eslint-config-yarapa` is the only package in this monorepo and is publishable.
