---
paths:
  - "**/*"
---

# No Emojis Rules

Prohibit all emojis, emoticons, and Unicode pictographic symbols across all repository files.

## Zero Emojis Policy

- Never use emojis in source code, scripts, tests, configuration, documentation, commit messages, or terminal outputs.
- Prohibited symbols include all Unicode emoji blocks (emoticons, pictographs, transport symbols, checkmark emojis, warning symbols, status badges, etc.).
- Use clean, professional ASCII text indicators instead:
  - Use `PASS` or `[OK]` instead of checkmark emojis.
  - Use `FAIL` or `[ERROR]` instead of cross/warning emojis.
  - Use plain markdown formatting, bullet points, or badges without emoji graphics.

## Professional Output

- CLI scripts and test reporters must output plain, professional text suitable for enterprise logs and CI pipelines.
