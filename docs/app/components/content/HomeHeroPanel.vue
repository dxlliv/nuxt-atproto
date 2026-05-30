<script setup lang="ts">
type PanelMode = 'code' | 'playground'
type CodeFile = 'config' | 'app'

const COLLAPSED_LINES = 15

const route = useRoute()
const colorMode = useColorMode()
const panel = ref<PanelMode>('code')
const codeFile = ref<CodeFile>('config')
const expanded = ref(false)
const highlightedHtml = ref('')
const highlighting = ref(false)

const nuxtConfig = `export default defineNuxtConfig({
  modules: ['nuxt-atproto'],
  ssr: false,
  atproto: {
    serviceEndpoint: {
      private: 'https://bsky.social',
      public: 'https://public.api.bsky.app',
    },
    oauth: {
      writeClientMetadata: true,
      clientMetadata: {
        remote: '',
        local: {
          client_id: 'https://your-app.example/client-metadata.json',
          client_name: 'My App',
          client_uri: 'https://your-app.example',
          logo_uri: 'https://your-app.example/logo.png',
          tos_uri: 'https://your-app.example/tos',
          policy_uri: 'https://your-app.example/privacy',
          redirect_uris: ['https://your-app.example'],
          scope: 'atproto transition:generic',
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          dpop_bound_access_tokens: true,
        },
      },
      signInOptions: {
        state: '',
        prompt: 'login',
        scope: 'atproto',
        ui_locales: 'en',
      },
    },
  },
})`

const appVue = `<script setup lang="ts">
const { isLogged, session } = useAtprotoSession()
const { signIn, signInWithHandle, signOut } = useAtprotoAuth()

const handle = ref('')
<\/script>

<template>
  <ClientOnly>
    <div v-if="!isLogged">
      <button type="button" @click="signIn()">
        Sign in with ATProto
      </button>

      <input v-model="handle" placeholder="handle.example.com">
      <button
        type="button"
        :disabled="!handle"
        @click="signInWithHandle(handle)"
      >
        Sign in with handle
      </button>
    </div>

    <div v-else>
      <p>Signed in as {{ session?.sub }}</p>
      <button type="button" @click="signOut()">
        Sign out
      </button>
    </div>
  </ClientOnly>
</template>`

const activeSource = computed(() =>
  codeFile.value === 'config'
    ? { label: 'nuxt.config.ts', code: nuxtConfig }
    : { label: 'app.vue', code: appVue },
)

const lineCount = computed(() => activeSource.value.code.split('\n').length)

const canExpand = computed(() => lineCount.value > COLLAPSED_LINES)

function setPanel(mode: PanelMode): void {
  panel.value = mode
}

function setCodeFile(file: CodeFile): void {
  codeFile.value = file
  expanded.value = false
}

watch(() => route.hash, (hash) => {
  if (hash === '#try-it') {
    panel.value = 'playground'
  }
}, { immediate: true })

watch(codeFile, () => {
  expanded.value = false
})

async function refreshHighlight(): Promise<void> {
  highlighting.value = true
  try {
    highlightedHtml.value = await highlightHeroCode(
      activeSource.value.code,
      codeFile.value,
      colorMode.value,
    )
  }
  finally {
    highlighting.value = false
  }
}

watch([codeFile, () => colorMode.value], () => {
  void refreshHighlight()
}, { immediate: true })
</script>

<template>
  <div
    id="try-it"
    class="hero-panel"
  >
    <UCard
      :ui="{
        root: 'ring ring-default/60 bg-elevated/40',
        body: 'p-0 sm:p-0',
        header: 'px-4 pt-4 pb-3 border-b border-default/60',
      }"
    >
      <template #header>
        <div
          class="hero-panel__modes"
          role="tablist"
          aria-label="Hero panel"
        >
          <button
            type="button"
            role="tab"
            class="hero-panel__chip"
            :class="{ 'hero-panel__chip--active': panel === 'code' }"
            :aria-selected="panel === 'code'"
            @click="setPanel('code')"
          >
            Code
          </button>
          <button
            type="button"
            role="tab"
            class="hero-panel__chip"
            :class="{ 'hero-panel__chip--active': panel === 'playground' }"
            :aria-selected="panel === 'playground'"
            @click="setPanel('playground')"
          >
            Try it out
          </button>
        </div>
      </template>

      <div class="hero-panel__body">
        <div
          role="tabpanel"
          class="hero-panel__code"
          :class="{ 'hero-panel__tabpanel--hidden': panel !== 'code' }"
          :aria-hidden="panel !== 'code'"
          :inert="panel !== 'code'"
        >
        <div
          class="hero-panel__files"
          role="tablist"
          aria-label="Source files"
        >
          <button
            type="button"
            role="tab"
            class="hero-panel__file-chip"
            :class="{ 'hero-panel__file-chip--active': codeFile === 'config' }"
            :aria-selected="codeFile === 'config'"
            @click="setCodeFile('config')"
          >
            nuxt.config.ts
          </button>
          <button
            type="button"
            role="tab"
            class="hero-panel__file-chip"
            :class="{ 'hero-panel__file-chip--active': codeFile === 'app' }"
            :aria-selected="codeFile === 'app'"
            @click="setCodeFile('app')"
          >
            app.vue
          </button>
        </div>

        <div
          class="hero-panel__pre-wrap"
          :class="{
            'hero-panel__pre-wrap--collapsed': canExpand && !expanded,
            'hero-panel__pre-wrap--loading': highlighting && !highlightedHtml,
          }"
        >
          <div
            v-if="highlightedHtml"
            class="hero-panel__pre shiki-host"
            v-html="highlightedHtml"
          />
        </div>

        <div
          v-if="canExpand"
          class="hero-panel__expand"
        >
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            :icon="expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            @click="expanded = !expanded"
          >
            {{ expanded ? 'Show less' : `Show all (${lineCount} lines)` }}
          </UButton>
        </div>
        </div>

        <div
          role="tabpanel"
          class="hero-panel__playground"
          :class="{ 'hero-panel__tabpanel--hidden': panel !== 'playground' }"
          :aria-hidden="panel !== 'playground'"
          :inert="panel !== 'playground'"
        >
          <HomeDemo compact />
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.hero-panel {
  width: 100%;
  min-width: 0;
}

.hero-panel__modes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.hero-panel__chip {
  padding: 0.35rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--ui-text-muted);
  background: transparent;
  border: 1px solid var(--ui-border);
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.hero-panel__chip:hover {
  color: var(--ui-text);
  border-color: var(--ui-border-accented);
}

.hero-panel__chip--active {
  color: var(--ui-text-inverted);
  background: var(--ui-primary);
  border-color: var(--ui-primary);
}

.hero-panel__code {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0.85rem 1rem 0.75rem;
}

.hero-panel__files {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.hero-panel__file-chip {
  padding: 0.2rem 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--ui-text-muted);
  background: var(--ui-bg-muted);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.hero-panel__file-chip:hover {
  color: var(--ui-text);
}

.hero-panel__file-chip--active {
  color: var(--ui-primary);
  background: color-mix(in srgb, var(--ui-primary) 12%, transparent);
  border-color: color-mix(in srgb, var(--ui-primary) 35%, transparent);
}

.hero-panel__pre-wrap {
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--ui-border-muted);
  background: var(--ui-bg-muted);
  overflow: auto;
}

.hero-panel__pre-wrap--collapsed {
  max-height: 15.5rem;
  overflow: hidden;
}

.hero-panel__pre-wrap:not(.hero-panel__pre-wrap--collapsed) {
  flex: 1;
  min-height: 0;
}

.hero-panel__pre-wrap--collapsed::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 3rem;
  background: linear-gradient(to bottom, transparent, var(--ui-bg-muted));
  pointer-events: none;
}

.hero-panel__pre-wrap--loading {
  min-height: 8rem;
}

.hero-panel__pre {
  margin: 0;
  min-height: 0;
}

.hero-panel__pre :deep(pre.shiki) {
  margin: 0;
  padding: 0.85rem 1rem;
  overflow: visible;
  background: transparent !important;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 0.65;
  tab-size: 2;
}

.hero-panel__pre :deep(pre.shiki code) {
  display: block;
  white-space: pre;
}

.hero-panel__pre :deep(.line) {
  display: block;
}

.hero-panel__expand {
  display: flex;
  justify-content: center;
  padding-top: 0.35rem;
}

.hero-panel__body {
  display: grid;
}

.hero-panel__body > [role='tabpanel'] {
  grid-area: 1 / 1;
  min-width: 0;
}

.hero-panel__tabpanel--hidden {
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
  height: 0;
  min-height: 0;
}

.hero-panel__playground {
  overflow: visible;
}

.hero-panel__playground :deep(.alert) {
  padding: 0.5rem 0.65rem;
  font-size: 0.8125rem;
}
</style>
