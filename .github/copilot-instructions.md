<!--
Guidance for AI coding agents working on this repository.
Keep this short and specific to the project's discoverable patterns.
-->
# Copilot / AI agent instructions — yasar-underwear-site

Quick purpose
- This is a small Next.js (Pages Router) TypeScript site using Tailwind CSS and simple component composition. The goal: make safe, minimal changes to pages/components, update styles, and edit tiny API routes.

Quick start (commands)
- Development server: `npm run dev` (starts Next.js on localhost:3000).
- Build for production: `npm run build`.
- Run built app: `npm run start`.
- Lint: `npm run lint` (project has a bare `eslint` script; pass file globs if needed).

Architecture & important files
- Pages Router (classic): all routes live under `src/pages/*` (e.g. `src/pages/index.tsx`, `src/pages/contact.tsx`).
- Serverless/API routes: `src/pages/api/*` (example: `src/pages/api/hello.ts`).
- Shared React components: `src/components/*` (examples: `Header.tsx`, `Hero.tsx`).
- Global styles: `src/styles/globals.css` — Tailwind utilities are used via `@import "tailwindcss"`.
- App wrapper: `src/pages/_app.tsx` mounts `<Header />` and imports `globals.css`.
- Config: `next.config.ts`, `tsconfig.json` (note path alias `@/*` -> `src/*`).

Project conventions you must follow
- TypeScript-first: `tsconfig.json` has `strict: true` and `noEmit: true`. Keep type-safety when changing code.
- Functional components, default exports: components use default-exported React functions (follow same pattern).
- Tailwind utilities for styling: prefer adding/removing utility classes in JSX rather than adding large global CSS blocks.
- Small, focused changes: this repo is demo-sized — prefer minimal diffs (edit the component or page that demonstrates the UI change). Example edits:
  - Change homepage hero text: `src/components/Hero.tsx` or `src/pages/index.tsx`.
  - Change header links or labels: `src/components/Header.tsx` (note `Link` usage from `next/link`).
  - Modify API response: `src/pages/api/hello.ts`.

Integration & external details
- Dependencies: `next@16`, `react@19`, `react-dom@19`, `tailwindcss` — keep changes compatible with these versions.
- Deploy: README suggests Vercel; standard Next.js deployment applies.

Tests & linting
- There is no test runner configured. Do not add tests unless you also add tooling (update package.json) and inform the maintainers.
- Linting: `npm run lint` runs `eslint`. If suggestions change linting rules, update `eslint.config.mjs` if present.

Examples (use these when editing)
- To change the site title: edit `src/pages/index.tsx` (the <Head> title is `Yasar - Home`).
- To adjust site-wide layout (header/footer): edit `src/pages/_app.tsx` and `src/components/Header.tsx`.
- To add an API route: create `src/pages/api/<name>.ts` using NextApiRequest / NextApiResponse types (see `src/pages/api/hello.ts`).

Notes and safe-guards for AI edits
- Keep changes limited to the smallest files needed. If making cross-file edits, update imports and run the dev server locally to verify.
- Do not change package versions without a clear reason — dependencies are pinned in `package.json`.
- If adding new scripts, update `package.json` and mention the command in the repo README.

If something is unclear
- Ask for the intended UX or desired output (the repo is small and many UI strings are placeholder/demo text).

End of file
