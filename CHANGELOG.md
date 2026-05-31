# Changelog


## v0.1.1

[compare changes](https://undefined/undefined/compare/v0.0.5...v0.1.1)

### 🚀 Enhancements

- **types:** Augment NuxtApp.$atproto and session status (8cf5bf2)
- Split useAtprotoSession, useAtprotoAuth, and useAtprotoAgent (8ffc24c)

### 🔥 Performance

- **useAgent:** Cache agent instances per scope and invalidate on session change (4e9a41e)

### 🩹 Fixes

- **plugin:** Use onDelete callback instead of addEventListener (b527a7e)
- Client-only plugin, session hooks, and module setup (4aefa3b)
- **playground:** Add account panel and responsive polish (013bca7)
- **docs:** Static generate with ssr:false for GitHub Pages (d96981c)

### 💅 Refactors

- **session:** Unify lifecycle and opt-in client metadata (0c84f68)

### 📖 Documentation

- Add Nuxt Content site and production guides for v0.1.0 (e4e78cc)
- **readme:** Fix documentation links (ac9a2e3)
- **readme:** Polish callout and license (f3ca390)

### 🏡 Chore

- Update dependencies (7ef2239)
- Migrate to Nuxt 4 directory structure and fix ESM compatibility (bfd94ac)

### ✅ Tests

- **ci:** Session hook unit tests, lint and types in CI (5231794)

### ❤️ Contributors

- Dxlliv <dxlliv@proton.me>

