# nuxt-atproto

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

> Easily integrate [Bluesky](https://bsky.app) login and [AT Protocol](https://atproto.com/) authentication into your
Nuxt.js app.

## Overview

`nuxt-atproto` is a Nuxt.js module that simplifies the OAuth authentication via AT Protocol.

It handles the login and the session management using the  `@atproto/oauth-client` library,  
providing public and authenticated agents for seamless interaction with AT Protocol services.

## Features

- SSR-friendly login via Bluesky and AT Protocol with automatic service endpoint resolution.
- Allow logins without specifying the handle, enabling account selection from PDS interface.
- Simple access to sign-in, sign-out, public and private agents from `useAtproto` composable.
- Access to the underlying client and session with `$atproto` provided by the plugin.
- Dynamically generates `client-metadata.json` when the Nuxt.js app starts.

## Installation

Install the module via npm:

```sh
npm install nuxt-atproto
```

## Configuration

Register the module in your `nuxt.config.js`:

```ts
export default defineNuxtConfig({
    modules: ['nuxt-atproto']
})
```

You can configure `nuxt-atproto` in your `nuxt.config.ts` file under the `atproto` key.  
The following options are available with their default values:

```ts
defineNuxtConfig({
    modules: ['nuxt-atproto'],
    atproto: {
        serviceEndpoint: {
            private: 'https://bsky.social',
            public: 'https://public.api.bsky.app'
        },
        oauth: {
            clientMetadata: {
                // url of your remote client_metadata.json, leave the field empty
                // to let `nuxt-atproto` generate a local /public/client_metadata.json
                remote: '',
                // configuration for the local client_metadata.json
                local: {
                    client_id: 'https://nuxt-atproto.pages.dev/client-metadata.json',
                    client_name: 'nuxt-atproto',
                    client_uri: 'https://nuxt-atproto.pages.dev',
                    logo_uri: 'https://nuxt-atproto.pages.dev/logo.png',
                    tos_uri: 'https://nuxt-atproto.pages.dev',
                    policy_uri: 'https://nuxt-atproto.pages.dev',
                    redirect_uris: ['https://nuxt-atproto.pages.dev'],
                    scope: "atproto transition:generic",
                    grant_types: ["authorization_code", "refresh_token"],
                    response_types: ["code"],
                    token_endpoint_auth_method: 'none',
                    application_type: 'web',
                    dpop_bound_access_tokens: true
                }
            },
            signInOptions: {
                state: '',
                prompt: 'login',
                scope: 'atproto',
                ui_locales: 'en',
            },
        },
        debug: true,
    }
})
```

You must configure the `atproto.oauth.clientMetadata` with in your `nuxt.config.ts`,  
especially `client_id` and `redirect_uris`, for the authentication flow to work correctly.

If you don't provide a remote URL in the module options, when Nuxt.js starts it will create a  `client-metadata.json` in your `public` folder.
Using a local `client-metadata.json` generally offers a faster user experience compared to fetching it from a remote URL.

## Usage

#### Basic example

```html
<script setup lang="ts">
const atproto = useAtproto()
</script>

<template>
    <div>
        <Button @click="atproto.signIn()">
            Sign-in with ATProto
        </Button><br />
        <Button @click="atproto.signInWithHandle('dxlliv.bsky.social')">
            Sign-in with ATProto using dxlliv.bsky.social
        </Button><br />
        <Button @click="atproto.signInWithHandle()">
            Sign-in with ATProto using your handle (prompt)
        </Button>
        <Button @click="atproto.restore('did:plc:2pkidgvfnbxx7sq3shporxij')">
            Restore dxlliv.bsky.social session
        </Button>
    </div>
    <template v-if="atproto.agent.account">
        <div>logged with: {{atproto.agent.account.assertDid}}</div>
        <Button @click="atproto.signOut()">
            Sign-out
        </Button>
    </template>
</template>
```

<br />

## 🧩 useAtproto(service?: string, fetch?: any)

A composable provided by `nuxt-atproto` that offers methods for user authentication and session management, including authenticating, signing out and session restore.

```html

<script setup lang="ts">
const atproto = useAtproto()
</script>
```

**Parameters:**

- `service` (optional): Override the service endpoint of the public agent.
- `fetch` (optional): A custom fetch implementation.

<br />

### ➡️ signIn(serviceEndpoint?: string, options?: AtprotoSignInOptions)

Initiates the standard ATProto sign-in flow redirecting the user for authentication.

```html

<Button @click="atproto.signIn()">
    Sign-in with ATProto
</Button>
```

**Parameters:**

- `serviceEndpoint`: *(optional)* The specific ATProto service endpoint to use for sign-in.
- `options`: *(optional)* Additional options to configure the sign-in process.

```ts
// options
{
    state: "",
    prompt: "login",
    scope: "atproto",
    ui_locales: "en"
}
```

**Returns:** A Promise that might not directly resolve due to the redirection to the ATProto service.

<br />

### ➡️ signInWithHandle(handle?: string, options?: AtprotoSignInOptions)

Initiates the ATProto sign-in flow using the user's AT Protocol handle.  
The user will be prompted to enter their handle on the ATProto service if you omit the handle.

```html

<Button @click="atproto.signInWithHandle()">
    Sign-in with ATProto
</Button>
```

**Parameters:**

- `handle`: *(optional)* The AT Protocol handle of the user.
- `options`: *(optional)* Additional options to configure the sign-in process.

**Returns:** A Promise that might not directly resolve due to the redirection to the ATProto service.

<br />

### ➡️ restore(did: string)

Restore the user account associated with the provided Decentralized Identifier (DID).

```html

<Button @click="atproto.restore('did:plc:2pkidgvfnbxx7sq3shporxij')">
    Restore dxlliv.bsky.social
</Button>
```

**Parameters:**

- `handle`: *(optional)* The Decentralized Identifier (DID) of the account to be restored.

**Returns:** A Promise that resolves when the restoration process is complete.

<br />

### ➡️ signOut()

Logs out the currently authenticated user and clears the stored session data.

```html

<Button @click="atproto.signOut()">
    Sign-out
</Button>
```

**Returns:** A Promise that resolves when the restoration process is complete.

<br />

### 🔢 agent

Provides an object containing both a public `AtpAgent` for general access and an authenticated `Agent` to perform actions that require a logged-in user, such as posting, following, and liking.

```ts
const atproto = useAtproto()

const profile = await atproto.agent.public.getProfile({actor: 'owdproject.org'})
console.log(profile.data)

const likedPost = await atproto.agent.account.likePost({cid, uri})
console.log(likedPost.data)
```

<br />

## 🧩 useAgent(service?: string, fetch?: any)

A composable provided by `nuxt-atproto` that offers methods for user authentication and session management, including authenticating, signing out and session restore.

```html

<script setup lang="ts">
const agent = useAgent('public')
</script>
```

**Parameters:**

- `service` (optional): Choose between `public`, `private` or a custom service endpoint.
- `fetch` (optional): A custom fetch implementation.

<br />

## License

This package is released under the MIT license.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-atproto/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-atproto

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-atproto.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-atproto

[license-src]: https://img.shields.io/npm/l/nuxt-atproto.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-atproto

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
