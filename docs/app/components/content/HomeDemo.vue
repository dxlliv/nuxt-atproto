<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  { compact: false },
)

const PlaygroundDemo = defineAsyncComponent(
  () => import('@playground/components/PlaygroundDemo.vue'),
)

const { status } = useAtprotoSession()
</script>

<template>
  <div
    class="home-demo"
    :class="{ 'home-demo--compact': props.compact }"
  >
    <ClientOnly>
      <div class="home-demo__inner">
        <div
          v-if="!props.compact"
          class="home-demo__status"
        >
          <PlaygroundStatusBadge :status="status" />
        </div>

        <PlaygroundDemo
          :compact="props.compact"
          saved-accounts-lead="Switch between profiles cached on this device."
        />
      </div>

      <template #fallback>
        <div class="home-demo__fallback">
          Loading interactive demo…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.home-demo {
  min-width: 0;
  width: 100%;
}

.home-demo__inner {
  padding: 0.5rem 0.75rem 0.75rem;
}

.home-demo--compact .home-demo__inner {
  padding: 0.85rem 1.15rem 1rem;
}

.home-demo__status {
  display: flex;
  justify-content: flex-end;
}

.home-demo__fallback {
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}

.home-demo :deep(.pg-demo) {
  padding: 0;
}
</style>
