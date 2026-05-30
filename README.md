# nuxt-atproto

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

> OAuth login and session management for [Bluesky](https://bsky.app) and [AT Protocol](https://atproto.com) in [Nuxt](https://nuxt.com).

## Documentation

**[Documentation](https://dxlliv.github.io/nuxt-atproto/)** — getting started, guides, and API reference.

Run the docs site locally:

```bash
cd docs && pnpm install && pnpm dev
```

Open **http://127.0.0.1:3456/nuxt-atproto/** (use `127.0.0.1`, not `localhost`, for the OAuth demo).

## Features

- AT Protocol OAuth in the browser (`@atproto/oauth-client-browser`)
- Composables for session, auth, and cached `@atproto/api` agents
- Lifecycle hooks: `atproto:sessionCreated`, `atproto:sessionRestored`, `atproto:sessionDeleted`
- Typed `$atproto` plugin (`client`, `session`, `status`)
- Optional generation of `public/client-metadata.json` from module config

## Quick start

```bash
pnpm add nuxt-atproto
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-atproto'],
  atproto: {
    oauth: {
      clientMetadata: {
        local: {
          client_id: 'https://your-app.example/client-metadata.json',
          client_name: 'My App',
          client_uri: 'https://your-app.example',
          redirect_uris: ['https://your-app.example'],
          // ... see docs for full metadata
        },
      },
    },
  },
})
```

```vue
<script setup lang="ts">
const { isLogged, session } = useAtprotoSession()
const { signIn, signInWithHandle, signOut } = useAtprotoAuth()
</script>

<template>
  <ClientOnly>
    <button v-if="!isLogged" type="button" @click="signIn()">Sign in</button>
    <template v-else>
      <p>{{ session?.sub }}</p>
      <button type="button" @click="signOut()">Sign out</button>
    </template>
  </ClientOnly>
</template>
```

```ts
const agent = useAtprotoAgent('authenticated')
await agent.getTimeline()
```

> **Client-only OAuth.** Wrap login UI in `<ClientOnly>` or disable SSR on auth routes.
> See the [introduction](https://dxlliv.github.io/nuxt-atproto/getting-started/introduction) in the docs.

## Composables

| Composable | Purpose |
|------------|---------|
| `useAtprotoSession()` | `session`, `isLogged`, `status` |
| `useAtprotoAuth()` | `signIn`, `signInWithHandle`, `signOut`, `restore` |
| `useAtprotoAgent(scope)` | Cached `Agent` / `AtpAgent` (`authenticated`, `public`, or custom URL) |

`useAtproto()` and `useAgent()` are deprecated — see [Migration](https://dxlliv.github.io/nuxt-atproto/advanced/migration).

## License

Released under the [MIT License](./LICENSE).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-atproto/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-atproto

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-atproto.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-atproto

[license-src]: https://img.shields.io/npm/l/nuxt-atproto.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-atproto

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
