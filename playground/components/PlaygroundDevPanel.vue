<script setup lang="ts">
type SessionStatus = 'initializing' | 'ready' | 'authenticated' | 'anonymous'

defineProps<{
  status: SessionStatus
  isLogged: boolean
}>()

const agentCacheOk = ref<boolean | null>(null)

onMounted(() => {
  try {
    const a = useAtprotoAgent('public')
    const b = useAtprotoAgent('public')
    agentCacheOk.value = a === b
  }
  catch {
    agentCacheOk.value = null
  }
})
</script>

<template>
  <details class="dev-panel">
    <summary>Module diagnostics</summary>
    <dl class="dev-panel__list">
      <div class="dev-panel__row">
        <dt>Session status</dt>
        <dd><code>{{ status }}</code></dd>
      </div>
      <div class="dev-panel__row">
        <dt>Logged in</dt>
        <dd><code>{{ isLogged }}</code></dd>
      </div>
      <div class="dev-panel__row">
        <dt>Public agent cache</dt>
        <dd>
          <code v-if="agentCacheOk === true">shared instance</code>
          <code v-else-if="agentCacheOk === false">not shared</code>
          <code v-else>n/a</code>
        </dd>
      </div>
    </dl>
  </details>
</template>

<style scoped>
.dev-panel {
  padding: 0.85rem 1rem;
  border-radius: var(--pg-radius);
  border: 1px dashed var(--pg-border);
  background: rgba(0, 0, 0, 0.2);
  font-size: 0.8rem;
}

.dev-panel summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--pg-muted);
  user-select: none;
}

.dev-panel__list {
  margin: 0.75rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dev-panel__row {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 0.5rem;
}

.dev-panel__row dt {
  color: var(--pg-muted);
}

.dev-panel__row dd {
  margin: 0;
}

.dev-panel code {
  font-family: var(--pg-mono);
  font-size: 0.75rem;
  color: var(--pg-accent);
}
</style>
