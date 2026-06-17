# Changelog

## v0.1.1

[compare changes](https://github.com/dxlliv/nuxt-atproto/compare/v0.1.0...v0.1.1)

### 🩹 Fixes

- **vite:** Remove core-js from optimizeDeps.include to avoid browser require errors ([9af142c](https://github.com/dxlliv/nuxt-atproto/commit/9af142c))

### ❤️ Contributors

- Dxlliv <dxlliv@proton.me>

## v0.1.0

[compare changes](https://github.com/dxlliv/nuxt-atproto/compare/v0.0.5...v0.1.0)

First stable API release for Nuxt 4 — focused composables, client-only OAuth, and full documentation at [nuxt-atproto.pages.dev](https://nuxt-atproto.pages.dev).

### 🚀 Enhancements

- **types:** Augment `NuxtApp.$atproto` and session status (8cf5bf2)
- Split `useAtprotoSession`, `useAtprotoAuth`, and `useAtprotoAgent` (8ffc24c)

### 🔥 Performance

- **useAgent:** Cache agent instances per scope and invalidate on session change (4e9a41e)

### 🩹 Fixes

- **plugin:** Use `onDelete` callback instead of `addEventListener` (b527a7e)
- Client-only plugin, session hooks, and module setup (4aefa3b)
- **playground:** Add account panel and responsive polish (013bca7)
- **docs:** Static generate with `ssr: false` (d96981c)
- Lint and unit tests for client-only module (cc64b71)

### 💅 Refactors

- **session:** Unify lifecycle and opt-in client metadata (0c84f68)

### 📖 Documentation

- Add Nuxt Content site and production guides (e4e78cc)
- **readme:** Fix documentation links (ac9a2e3)
- **readme:** Polish callout and license (f3ca390)
- Point docs URLs to Cloudflare Pages (fd19184)

### 🏡 Chore

- Update dependencies (7ef2239)
- Migrate to Nuxt 4 directory structure and fix ESM compatibility (bfd94ac)

### ✅ Tests

- **ci:** Session hook unit tests, lint and types in CI (5231794)

### ❤️ Contributors

- Dxlliv <dxlliv@proton.me>

## v0.0.5

Previous release — legacy `useAtproto()` / `useAgent()` API. See [Migration](https://nuxt-atproto.pages.dev/advanced/migration) when upgrading.
