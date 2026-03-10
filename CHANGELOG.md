# Changelog

## 2026-01-19 — Actions & Deploy prep

- chore: prepared repository for Vercel and CI
  - Added `README.md` with run/build/deploy instructions.
  - Added a minimal `vercel.json` to provide a place for build-time environment settings.
  - Added `engines.node: ">=18"` to `package.json` to recommend Node 18+ on deployment.
- ci: improved GitHub Actions for feature branches
  - Updated `.github/workflows/ci.yml` to trigger on `main` and `feat/**` branches and to run install/build from the repository root.
  - Updated `.github/workflows/capture-screenshots.yml` to trigger on `feat/**` and run installs at the root.
  - Added an npm script `capture-screenshots` which runs `scripts/capture_screenshots.js` so the screenshot workflow can call it.
- ci: triggered a workflow run
  - Pushed an empty commit with message `ci: trigger GitHub Actions for feature branch` to force GitHub Actions to run after the workflow fixes.

These changes were made to ensure feature-branch pushes get CI status and to make Vercel deployment smoother. If you'd like these notes moved into `README.md` or formatted differently, tell me and I'll change it.
