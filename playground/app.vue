<script setup lang="ts">
const { session, isLogged } = useAtprotoSession()
const { signIn, signInWithHandle, signOut, restore } = useAtprotoAuth()
const { hook } = useNuxtApp()

async function fetchProfile(did: string): Promise<any> {
  const agent = useAtprotoAgent('public')
  return agent.getProfile({ actor: did })
}

function saveProfile(did: string, profile: any): void {
  const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}')

  storedProfiles[did] = {
    updatedAt: new Date().toISOString(),
    profile,
  }

  localStorage.setItem('profiles', JSON.stringify(storedProfiles))
  updateProfiles()
}

function removeProfile(did: string): void {
  const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}')

  delete storedProfiles[did]

  localStorage.setItem('profiles', JSON.stringify(storedProfiles))
  updateProfiles()
}

const profiles = ref<Record<string, { updatedAt: string, profile: any }>>({})

function updateProfiles(): void {
  profiles.value = JSON.parse(localStorage.getItem('profiles') || '{}')
}

const account = computed(() => {
  if (!isLogged.value) {
    return null
  }

  const currentSession = session.value
  if (!currentSession) {
    return null
  }

  return profiles.value[currentSession.sub] ?? null
})

hook('atproto:sessionCreated', async (did: string) => {
  const user: { data: any } = await fetchProfile(did)
  saveProfile(did, user.data)
})

hook('atproto:sessionRestored', async (did: string) => {
  const user: { data: any } = await fetchProfile(did)
  saveProfile(did, user.data)
})

hook('atproto:sessionDeleted', (did: string) => {
  removeProfile(did)
})

onBeforeMount(() => {
  updateProfiles()
})

const handleForSignIn = ref('')

async function signInWithHandlePrompt(): Promise<void> {
  const handle = handleForSignIn.value.trim() || window.prompt('Type your handle')?.trim()
  if (!handle) {
    return
  }
  await signInWithHandle(handle)
}
</script>

<template>
  <client-only>
    <section>
      <h1>nuxt-atproto</h1>
      <a
        href="https://npmjs.com/package/nuxt-atproto"
        target="_blank"
      >
        npmjs.com/package/nuxt-atproto
      </a>

      <div style="margin-top: 32px;">
        <button @click="signIn()">
          Sign-in with ATProto
        </button>
        <br>
        <input
          v-model="handleForSignIn"
          placeholder="handle (e.g. user.bsky.social)"
          style="margin: 8px 0; padding: 8px;"
        >
        <button @click="signInWithHandlePrompt()">
          Sign-in with handle
        </button>
      </div>
    </section>

    <template v-if="account">
      <hr>

      <section>
        <h4>Current session</h4>

        <table>
          <tbody>
            <tr>
              <td>
                <a :href="`https://bsky.app/profile/${account.profile.handle}`">
                  <img :src="account.profile.avatar">
                  {{ account.profile.handle }}
                </a>
              </td>
              <td>
                <button @click="signOut()">
                  Sign-out {{ account.profile.did }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>

    <template v-if="Object.values(profiles).length > 0">
      <hr>

      <section>
        <h4>List of available sessions</h4>

        <table>
          <tbody>
            <tr v-for="item of Object.values(profiles)" :key="item.profile.did">
              <td>
                <a :href="`https://bsky.app/profile/${item.profile.handle}`">
                  <img :src="item.profile.avatar">
                  {{ item.profile.handle }}
                </a>
              </td>
              <td>
                <button @click="restore(item.profile.did)">
                  Restore {{ item.profile.did }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>

    <hr>

    <section>
      <footer>
        <a
          href="https://github.com/dxlliv/nuxt-atproto"
          target="_blank"
        >github.com/dxlliv/nuxt-atproto</a>
      </footer>
    </section>
  </client-only>
</template>

<style>
body {
  font-family: sans-serif;
  background: oklch(12.9% 0.042 264.695);
  color: white;
  padding: 12px;
}

hr {
  background: rgba(255, 255, 255, 0.1);
  height: 1px;
  border: 0;
}

button {
  cursor: pointer;
  margin: 8px 0;
  padding: 12px;
  background: oklch(79.2% 0.209 151.711);
  color: oklch(12.9% 0.042 264.695);
  border: 0;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
}

section {
  padding: 12px;

  h1 {
    margin: 0 0 2px 0;

    + a {
      opacity: 0.5;
    }
  }

  h4 {
    margin: 0 0 12px 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  table {
    tr {
      td {
        padding: 8px 0;

        img {
          max-width: 48px;
          margin-right: 12px;
          border-radius: 6px;
          border: 3px solid white;
          vertical-align: middle;
        }

        &:first-child {
          width: 420px;
        }
      }
    }
  }

  footer {
    margin-top: 8px;
    opacity: 0.25;
  }
}
</style>
