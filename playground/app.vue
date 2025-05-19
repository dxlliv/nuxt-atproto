<script setup lang="ts">
const atproto = useAtproto()
const { hook } = useNuxtApp()

/**
 * Fetches the profile associated with a given decentralized identifier (DID).
 *
 * @param {string} did - The decentralized identifier (DID) of the profile to fetch.
 * @return {Promise<Object>} A promise that resolves to the profile object associated with the given DID.
 */
async function fetchProfile(did: string): Promise<any> {
  const agent = useAgent('public')

  // fetch profile using the public agent
  return agent.getProfile({ actor: did })
}

/**
 * Saves a user profile to local storage and updates the profiles reference.
 *
 * @param {string} did - The decentralized identifier (DID) of the user.
 * @param {Object} profile - The profile data to be saved.
 * @return {void} Does not return a value.
 */
function saveProfile(did: string, profile: any): void {
  const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}')

  storedProfiles[did] = {
    updatedAt: new Date().toISOString(),
    profile,
  }

  localStorage.setItem('profiles', JSON.stringify(storedProfiles))

  // update profiles ref manually since localStorage isn't reactive
  updateProfiles()
}

/**
 * Removes a profile from the stored profiles using the provided decentralized identifier (DID).
 *
 * @param {string} did - The decentralized identifier of the profile to be removed.
 * @return {void} Does not return a value.
 */
function removeProfile(did: string): void {
  const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}')

  delete storedProfiles[did]

  localStorage.setItem('profiles', JSON.stringify(storedProfiles))

  // update profiles ref manually since localStorage isn't reactive
  updateProfiles()
}

/**
 * A reactive variable storing an array of profile objects.
 * Each object in the array represents a profile with the following properties:
 * - `updatedAt`: A string representing the last update timestamp of the profile.
 * - `profile`: An object containing the details of the profile.
 */
const profiles = ref<{ updatedAt: string, profile: any }[]>([])

/**
 * Updates the profiles value by retrieving and parsing the data stored in the browser's local storage.
 * If no profiles data is found in local storage, initializes with an empty object.
 *
 * @return {void} This method does not return a value.
 */
function updateProfiles(): void {
  profiles.value = JSON.parse(localStorage.getItem('profiles') || '{}')
}

/**
 * Computed property representing the account details of the currently logged-in user.
 * If the user is not logged in, this property will return null. Otherwise, it retrieves
 * the current session and returns the associated profile info for the logged-in user.
 */
const account = computed(() => {
  if (!atproto.isLogged()) {
    return null
  }

  const session = atproto.getSession()

  // get current profile
  return profiles.value[session.sub]
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
