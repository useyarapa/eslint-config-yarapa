# No Emoji Rules

Use plain, professional text that remains readable in terminals, logs, source files, documentation, and review tools.

## Text Output

- Write status, severity, and guidance as words or ASCII markers such as `PASS`, `FAIL`, `[OK]`, and `[ERROR]`.
- Keep source, scripts, tests, configuration, documentation, commit messages, and generated reports free of emoji and pictographic symbols.
- Prefer portable ASCII punctuation when the text will be consumed by terminals, parsers, or CI systems.

## Verification

- Inspect changed files for emoji, emoticons, and pictographic symbols before review.
- Keep user-facing output legible without relying on color or graphical symbols.
