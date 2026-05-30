<script setup lang="ts">
useHead({
  title: 'nuxt-atproto playground',
  meta: [
    { name: 'description', content: 'Interactive demo for the nuxt-atproto Nuxt module' },
  ],
})

const { public: { docsUrl } } = useRuntimeConfig()
const { status } = usePlaygroundSession()
</script>

<template>
  <div class="pg">
    <header class="pg-header">
      <div class="pg-header__bar">
        <div class="pg-header__brand">
          <h1 class="pg-header__title">
            <span>nuxt</span>-atproto
          </h1>
          <p class="pg-header__tagline">
            AT Protocol authentication module for Nuxt
          </p>
        </div>

        <nav
          class="pg-nav"
          aria-label="Resources"
        >
          <a
            class="pg-nav__link"
            :href="docsUrl"
          >Docs</a>
          <a
            class="pg-nav__link pg-nav__link--icon"
            href="https://github.com/dxlliv/nuxt-atproto"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            <PlaygroundIcon name="github" :size="17" />
          </a>
        </nav>

        <PlaygroundStatusBadge
          class="pg-header__badge"
          :status="status"
        />
      </div>
    </header>

    <main>
      <PlaygroundDemo show-dev-panel />
    </main>

    <footer class="pg-footer">
      <p class="pg-footer__line">
        <span class="pg-footer__brand"><span>nuxt</span>-atproto</span>
        · <a :href="docsUrl">docs</a>
        · <a
          href="https://github.com/dxlliv/nuxt-atproto"
          target="_blank"
          rel="noopener noreferrer"
        >github</a>
        · <a
          href="https://www.npmjs.com/package/nuxt-atproto"
          target="_blank"
          rel="noopener noreferrer"
        >npm</a>
      </p>
    </footer>
  </div>
</template>
