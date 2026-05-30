<script setup lang="ts">
import type { StoredProfileEntry } from '../composables/useStoredProfiles'

defineProps<{
  entry: StoredProfileEntry
  active?: boolean
  compact?: boolean
}>()

defineEmits<{
  restore: []
  signOut: []
}>()

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) {
    return 'just now'
  }
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }
  return new Date(iso).toLocaleDateString()
}
</script>

<template>
  <article
    class="profile-card"
    :class="{
      'profile-card--active': active,
      'profile-card--compact': compact,
    }"
  >
    <div class="profile-card__media">
      <img
        v-if="entry.profile.avatar"
        :src="entry.profile.avatar"
        :alt="entry.profile.displayName || entry.profile.handle"
        class="profile-card__avatar"
        :width="compact ? 40 : 64"
        :height="compact ? 40 : 64"
      >
      <div
        v-else
        class="profile-card__avatar profile-card__avatar--placeholder"
        aria-hidden="true"
      >
        {{ entry.profile.handle.slice(0, 1).toUpperCase() }}
      </div>
      <span
        v-if="active"
        class="profile-card__status"
      >Active</span>
    </div>

    <div class="profile-card__body">
      <div class="profile-card__names">
        <p class="profile-card__display">
          {{ entry.profile.displayName || entry.profile.handle }}
        </p>
        <a
          :href="`https://bsky.app/profile/${entry.profile.handle}`"
          target="_blank"
          rel="noopener noreferrer"
          class="profile-card__handle"
        >
          @{{ entry.profile.handle }}
          <span
            class="profile-card__external"
            aria-hidden="true"
          >↗</span>
        </a>
      </div>
      <p
        v-if="entry.profile.description && !compact"
        class="profile-card__bio"
      >
        {{ entry.profile.description }}
      </p>
      <div
        v-if="!compact"
        class="profile-card__footer"
      >
        <code
          class="profile-card__did"
          :title="entry.profile.did"
        >{{ entry.profile.did }}</code>
        <span class="profile-card__meta">
          Cached {{ formatRelativeTime(entry.updatedAt) }}
        </span>
      </div>
    </div>

    <div class="profile-card__actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<style scoped>
.profile-card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    'media body'
    'actions actions';
  gap: 1rem 1.15rem;
  align-items: start;
  min-width: 0;
  padding: 1.1rem 1.15rem;
  border-radius: var(--pg-radius);
  border: 1px solid var(--pg-border);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.035), transparent 50%),
    var(--pg-surface-raised);
  box-shadow: var(--pg-shadow-soft);
  transition:
    border-color 0.18s,
    box-shadow 0.18s,
    transform 0.18s;
}

.profile-card:not(.profile-card--active):hover {
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.profile-card--active {
  border-color: rgba(0, 220, 130, 0.32);
  box-shadow:
    var(--pg-shadow-soft),
    0 0 0 1px rgba(0, 220, 130, 0.1);
}

.profile-card__media {
  grid-area: media;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
}

.profile-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid var(--pg-border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

.profile-card--active .profile-card__avatar {
  border-color: rgba(0, 220, 130, 0.45);
  box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.12);
}

.profile-card__avatar--placeholder {
  display: grid;
  place-items: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--pg-accent);
  background: linear-gradient(160deg, var(--pg-surface), var(--pg-bg));
}

.profile-card__status {
  padding: 0.12rem 0.45rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--pg-on-accent);
  background: var(--pg-accent);
  border-radius: 999px;
}

.profile-card__body {
  grid-area: body;
  min-width: 0;
}

.profile-card__names {
  min-width: 0;
}

.profile-card__display {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--pg-text);
}

.profile-card__handle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--pg-muted);
  text-decoration: none;
}

.profile-card__handle:hover {
  color: var(--pg-accent);
}

.profile-card__handle:hover .profile-card__external {
  opacity: 1;
  transform: translate(1px, -1px);
}

.profile-card__external {
  font-size: 0.75rem;
  opacity: 0.55;
  transition: opacity 0.15s, transform 0.15s;
}

.profile-card__bio {
  margin: 0.55rem 0 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--pg-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.profile-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-top: 0.65rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--pg-border);
}

.profile-card__did {
  max-width: 100%;
  padding: 0.2rem 0.45rem;
  font-family: var(--pg-mono);
  font-size: 0.68rem;
  color: var(--pg-muted);
  background: var(--pg-bg);
  border: 1px solid var(--pg-border);
  border-radius: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-card__meta {
  font-size: 0.72rem;
  color: var(--pg-muted);
  opacity: 0.85;
}

.profile-card__actions {
  grid-area: actions;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.15rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--pg-border);
}

.profile-card__actions :deep(.btn) {
  flex-shrink: 0;
}

.profile-card--compact {
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas: 'media body actions';
  gap: 0.65rem 0.85rem;
  align-items: center;
  padding: 0.65rem 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.profile-card--compact:not(.profile-card--active):hover {
  transform: none;
}

.profile-card--compact.profile-card--active {
  border: none;
  box-shadow: none;
}

.profile-card--compact .profile-card__media {
  flex-direction: row;
  gap: 0;
}

.profile-card--compact .profile-card__avatar,
.profile-card--compact .profile-card__avatar--placeholder {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  box-shadow: none;
}

.profile-card--compact .profile-card__avatar--placeholder {
  font-size: 0.95rem;
}

.profile-card--compact .profile-card__status {
  display: none;
}

.profile-card--compact .profile-card__display {
  font-size: 0.8125rem;
  line-height: 1.2;
}

.profile-card--compact .profile-card__handle {
  margin-top: 0.05rem;
  font-size: 0.72rem;
}

.profile-card--compact .profile-card__actions {
  margin: 0;
  padding: 0;
  border-top: none;
  justify-content: flex-end;
}

@media (max-width: 400px) {
  .profile-card__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .profile-card__actions :deep(.btn) {
    width: 100%;
  }
}
</style>
