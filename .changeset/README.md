# Changesets

A changeset records the package to release, the semver bump, and the changelog message.

For a package change:

1. Run `pnpm changeset`.
2. Select `eslint-config-yarapa`.
3. Select `patch`, `minor`, or `major`.
4. Describe what changed, why it changed, and how consumers should update.
5. Commit the generated `.changeset/*.md` file.

For a change with no package release impact, run:

```sh
pnpm changeset --empty
```

See the [official Changesets guide](https://changesets.dev/faq#how-do-i-add-a-changeset).
