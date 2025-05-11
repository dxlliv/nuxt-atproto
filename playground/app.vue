<script setup lang="ts">
const atproto = useAtproto()
const { hook } = useNuxtApp()

async function fetchProfile(did: string) {
  return atproto.agent.public.getProfile({ actor: did })
}

function saveProfile(did: string, profile: any) {
  const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}')

  storedProfiles[did] = {
    updatedAt: new Date().toISOString(),
    profile,
  }

  localStorage.setItem('profiles', JSON.stringify(storedProfiles))

  // update profiles ref manually since localStorage isn't reactive
  updateProfiles()
}

function removeProfile(did: string) {
  const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}')

  delete storedProfiles[did]

  localStorage.setItem('profiles', JSON.stringify(storedProfiles))

  // update profiles ref manually since localStorage isn't reactive
  updateProfiles()
}

const profiles = ref<{ updatedAt: string, profile: any }[]>([])

function updateProfiles() {
  profiles.value = JSON.parse(localStorage.getItem('profiles') || '{}')
}

const account = computed(() => {
  const { $atproto } = useNuxtApp()

  if (!$atproto.session.value) {
    return null
  }

  return profiles.value[$atproto.session.value.sub]
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
        <Button @click="atproto.signIn()">
          Sign-in with ATProto
        </Button>
        <br>
        <Button @click="atproto.signInWithHandle()">
          Sign-in with ATProto using your handle (prompt)
        </Button>
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
                <Button @click="atproto.signOut()">
                  Sign-out {{ account.profile.did }}
                </Button>
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
            <tr v-for="item of profiles">
              <td>
                <a :href="`https://bsky.app/profile/${item.profile.handle}`">
                  <img :src="item.profile.avatar">
                  {{ item.profile.handle }}
                </a>
              </td>
              <td>
                <Button @click="atproto.restore(item.profile.did)">
                  Restore {{ item.profile.did }}
                </Button>
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
</style>>
