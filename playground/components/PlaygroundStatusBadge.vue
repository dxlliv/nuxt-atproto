<script setup lang="ts">
type SessionStatus = 'initializing' | 'ready' | 'authenticated' | 'anonymous'

const props = defineProps<{
  status: SessionStatus
}>()

const label = computed(() => {
  switch (props.status) {
    case 'initializing':
      return 'Initializing'
    case 'authenticated':
      return 'Authenticated'
    case 'ready':
      return 'Ready'
    case 'anonymous':
      return 'Signed out'
    default:
      return props.status
  }
})
</script>

<template>
  <span
    class="badge"
    :data-status="status"
  >
    <span
      class="badge__dot"
      aria-hidden="true"
    />
    {{ label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.55rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999px;
  border: 1px solid var(--pg-border);
  background: rgba(0, 0, 0, 0.2);
  color: var(--pg-muted);
  white-space: nowrap;
}

.badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pg-muted);
}

.badge[data-status='initializing'] .badge__dot {
  background: #fbbf24;
  animation: pulse 1.2s ease-in-out infinite;
}

.badge[data-status='authenticated'] {
  color: var(--pg-accent);
  border-color: rgba(0, 220, 130, 0.25);
}

.badge[data-status='authenticated'] .badge__dot {
  background: var(--pg-accent);
}

@keyframes pulse {
  50% {
    opacity: 0.4;
  }
}
</style>
