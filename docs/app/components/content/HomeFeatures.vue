<script setup lang="ts">
const features = [
  {
    icon: 'i-lucide-key-round',
    title: 'Browser OAuth',
    description: 'PDS redirect or handle-based sign-in. Tokens stay in the client — no Nitro session layer.',
    to: '/guide/authentication',
  },
  {
    icon: 'i-lucide-radio',
    title: 'Session lifecycle',
    description: 'Reactive session, status, and hooks when users log in, restore, or revoke.',
    to: '/guide/sessions-and-hooks',
  },
  {
    icon: 'i-lucide-bot',
    title: 'Cached agents',
    description: 'One shared Agent per scope — authenticated, public, or a custom PDS endpoint.',
    to: '/guide/agents',
  },
  {
    icon: 'i-lucide-box',
    title: 'Typed composables',
    description: 'Auto-imported useAtprotoSession, useAtprotoAuth, and useAtprotoAgent with full TypeScript support.',
    to: '/api/composables',
  },
  {
    icon: 'i-lucide-webhook',
    title: 'Lifecycle hooks',
    description: 'atproto:sessionCreated, sessionRestored, and sessionDeleted for side effects and analytics.',
    to: '/api/hooks',
  },
  {
    icon: 'i-simple-icons-nuxtdotjs',
    title: 'Nuxt 4 ready',
    description: 'Client-only plugin, runtime config, and optional client-metadata.json generation at build time.',
    to: '/getting-started/installation',
  },
] as const
</script>

<template>
  <section
    class="home-features"
    aria-labelledby="home-features-title"
  >
    <UContainer>
      <header class="home-features__header">
        <p class="home-features__eyebrow">
          Features
        </p>
        <h2
          id="home-features-title"
          class="home-features__title"
        >
          Everything for ATProto auth
        </h2>
        <p class="home-features__lead">
          OAuth, sessions, and agents — wired the Nuxt way, without a server-side auth layer.
        </p>
      </header>

      <ul class="home-features__grid">
        <li
          v-for="feature in features"
          :key="feature.to"
        >
          <UPageCard
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
            :to="feature.to"
            spotlight
            :ui="{
              root: 'h-full ring ring-default bg-elevated/40 hover:bg-elevated/60 transition-colors',
              title: 'text-base font-semibold',
              description: 'text-sm text-muted leading-relaxed',
            }"
          />
        </li>
      </ul>
    </UContainer>
  </section>
</template>

<style scoped>
.home-features {
  padding: 2.5rem 0 3.5rem;
}

.home-features__header {
  max-width: 38rem;
  margin-bottom: 2rem;
}

.home-features__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.home-features__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.35;
  color: var(--ui-text-highlighted);
}

.home-features__lead {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--ui-text-muted);
}

.home-features__grid {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 640px) {
  .home-features__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.15rem;
  }
}

@media (min-width: 1024px) {
  .home-features__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }
}
</style>
