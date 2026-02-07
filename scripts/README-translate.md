Translate script README

This repo contains `scripts/translate_locales.js` to automate machine translation of the site's locale files.

What it does
- Uses `src/locales/tr.json` as the source-of-truth.
- For each target locale (en, fr, ru, ar), it finds string keys that are missing or identical to the Turkish placeholder and translates them.
- Preserves any existing translations that differ from Turkish.

Providers supported
- DeepL (recommended): set DEEPL_API_KEY in your environment.
  Example: `DEEPL_API_KEY=xxxx node scripts/translate_locales.js --dry`

- LibreTranslate (self-hosted or public instance): set LIBRE_TRANSLATE_URL and optional LIBRE_TRANSLATE_KEY.
  Example: `LIBRE_TRANSLATE_URL=https://libretranslate.com node scripts/translate_locales.js --apply`

Usage
- Dry run (writes outputs to /tmp/*.translated.json):
  DEEPL_API_KEY=xxxx node scripts/translate_locales.js --dry

- Apply changes (overwrite `src/locales/<lang>.json`):
  DEEPL_API_KEY=xxxx node scripts/translate_locales.js --apply

Security & privacy
- The script sends Turkish source strings to the translation provider. If strings contain sensitive content, do not use a public translation API.

Review
- After running in --apply mode, review changed files, run `npx tsc --noEmit` and start dev server to spot rendering issues.

Rollback
- Backups were previously stored in `/tmp/locales-backup-20260203_030000/`. Commit produced a history entry for the earlier placeholder sync. Create a new commit or stash before running the apply step.
