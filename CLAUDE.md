# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Install: `pnpm install` (this repo uses pnpm, not npm/yarn — see `pnpm-lock.yaml`)
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint` — runs `oxlint . --fix` then `eslint . --fix --cache`; both auto-fix and mutate files
- Format: `pnpm format` — `prettier --write` on `src/` only (not the whole repo)
- No test suite exists in this repo yet.

## Conventions

- Vue 3 `<script setup>`, plain JavaScript (no TypeScript). Composition API with Pinia stores defined as `defineStore('name', () => { ... })`.
- Styling is 100% Tailwind utility classes in templates — no `<style>` blocks, no SCSS. Design tokens live in `src/style.css` as Tailwind v4 CSS-first theme: `@theme` defines color tokens (`primary-50~800` green scale, `grey-white`/`grey-30~500`), and `@utility` defines typography tokens (`text-head1/head2/head3/body1~4/caption`, all Pretendard-based). Prefer these tokens; colors that don't match the scale still fall back to Tailwind arbitrary-value hex classes (e.g. `text-[#737373]`).
- Global font is Pretendard (CDN import at the top of `src/style.css`).
- `Button.vue` (`src/shared/components/Button.vue`) defaults to `rounded-[14px]` (`variant`: `primary`/`outline`/`accent`/`danger`); pass the `pill` prop for a fully-rounded button — currently only the login screen's Kakao/Google buttons use it.
- Native `<select>` can't be restyled once open, so any picker-style field (category, bank, etc.) is a hand-built inline dropdown — a toggle button plus an absolutely-positioned option list closed on outside click — not a real `<select>`. See `src/features/onboarding/components/JobFormModal.vue` for the pattern.
- Path alias `@` → `src/` (defined in both `vite.config.js` and `jsconfig.json`).
- Feature code lives in `src/features/<name>/` with a `<Name>View.vue` and an optional co-located `store.js`. Shared code lives in `src/shared/` (`components/`, `components/icons/`, `api/`, `store/`).
- Icons are hand-authored, template-only SVG SFCs under `src/shared/components/icons/`, using `stroke`/`fill="currentColor"` so color is controlled via Tailwind `text-*` classes on the consumer.
- Auth-gated routes set `meta: { requiresAuth: true }` on the parent layout route; a global `router.beforeEach` in `src/app/router/index.js` checks `useAuthStore().isAuthenticated`. `meta: { requiresOnboarding: true }` gates on `authStore.user?.onboardingCompleted` (populated by `GET /auth/me`), not a local flag — there's no explicit "mark onboarding complete" API, so the client just re-fetches `/auth/me` at the end of the onboarding flow and trusts whatever the server says.

## Gotchas

- `useAuthStore().tryRefresh()` (`src/features/auth/store.js`) and both login handlers in `LoginView.vue` fake a successful login only when `VITE_API_BASE_URL` is empty (currently only `.env.production`, until a prod backend URL is set — `pnpm dev` now hits the real backend). `refreshToken` is persisted to `localStorage`; `accessToken` is memory-only and gets re-derived via `POST /auth/refresh` on boot (`main.js`) and on 401 (`axiosInstance.js`).
- OAuth login is frontend-driven: `LoginView.vue` redirects straight to Kakao/Google's own authorize URL (needs `VITE_KAKAO_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID`), the provider redirects back to `/auth/callback?code=...&state=kakao|google`, and `AuthCallbackView.vue` exchanges the code via `GET /api/auth/oauth/{provider}`. This is not the Spring Security `/oauth2/authorization/{provider}` convention.
- `pnpm lint` runs two linters with `--fix` — it will silently rewrite files.
- On horizontally-scrolling flex containers (`overflow-x-auto` + `flex`), `padding` on the container is ignored in some WebView contexts (confirmed in this app's own WebView, not reproducible in desktop Chrome). Use a `shrink-0` spacer element plus per-item `margin` instead — see the job-recommendation row in `src/features/home/HomeView.vue`.

## Git conventions

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- Never add a `Co-Authored-By` trailer to commits in this repo.
- Branch creation, issues, and PRs are managed by the user — don't create them unless explicitly asked.
