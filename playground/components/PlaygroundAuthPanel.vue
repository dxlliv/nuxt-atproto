<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** When logged in, show a compact “add account” panel instead of the full sign-in hero. */
    addAccount?: boolean
    /** Flat layout for docs hero embed — no icon hero, hint, or footnote. */
    embedded?: boolean
  }>(),
  { addAccount: false, embedded: false },
)

const emit = defineEmits<{
  signIn: []
  signInWithHandle: [handle: string]
}>()

const handle = ref('')
const canSubmitHandle = computed(() => handle.value.trim().length > 0)

function submitHandle(): void {
  const value = handle.value.trim()
  if (!value) {
    return
  }
  emit('signInWithHandle', value)
}
</script>

<template>
  <section
    class="auth-card"
    :class="{
      panel: !props.embedded,
      'panel--featured': !props.addAccount && !props.embedded,
      'auth-card--compact': props.addAccount && !props.embedded,
      'auth-card--embedded': props.embedded,
      'auth-card--embedded-add': props.embedded && props.addAccount,
    }"
  >
    <div
      v-if="!props.addAccount && !props.embedded"
      class="auth-card__hero"
    >
      <div
        class="auth-card__mark"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3 4 8v8l8 5 8-5V8l-8-5Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path
            d="M12 12 4 8m8 4 8-4M12 12v8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h2 class="auth-card__title">
        Sign in with AT Protocol
      </h2>
      <p class="auth-card__lead">
        OAuth runs entirely in your browser. Pick your account provider or enter a handle.
      </p>
    </div>

    <header
      v-else-if="props.embedded && !props.addAccount"
      class="auth-card__embed-header"
    >
      <div
        class="auth-card__embed-mark"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3 4 8v8l8 5 8-5V8l-8-5Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path
            d="M12 12 4 8m8 4 8-4M12 12v8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="auth-card__embed-copy">
        <h2 class="auth-card__embed-title">
          Sign in with ATProto
        </h2>
        <p class="auth-card__embed-lead">
          OAuth runs in your browser — pick your PDS or enter a handle.
        </p>
      </div>
    </header>

    <header
      v-else-if="props.addAccount && props.embedded"
      class="auth-card__embed-add-label"
    >
      Add account
    </header>

    <header
      v-else-if="props.addAccount"
      class="auth-card__compact-header"
    >
      <h2 class="auth-card__compact-title">
        Add another account
      </h2>
      <p class="auth-card__compact-lead">
        Sign in with a different handle. Your current session stays cached locally.
      </p>
    </header>

    <div class="auth-card__methods">
      <button
        type="button"
        class="btn btn--primary btn--block auth-card__oauth"
        :class="{ 'btn--lg': !props.embedded, 'auth-card__oauth--embedded': props.embedded }"
        @click="emit('signIn')"
      >
        <span class="auth-card__oauth-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        {{ props.addAccount ? (props.embedded ? 'Add with PDS' : 'Continue with another PDS') : 'Continue with your PDS' }}
      </button>
      <p
        v-if="!props.addAccount && !props.embedded"
        class="auth-card__hint"
      >
        Redirects to your personal data server for authorization.
      </p>

      <div
        class="auth-card__divider"
        :class="{ 'auth-card__divider--plain': props.embedded }"
        role="separator"
      >
        <span>{{ props.embedded && props.addAccount ? 'or handle' : 'or sign in with handle' }}</span>
      </div>

      <form
        class="auth-card__handle"
        :class="{ 'auth-card__handle--embedded': props.embedded, 'auth-card__handle--embedded-add': props.embedded && props.addAccount }"
        @submit.prevent="submitHandle"
      >
        <label
          v-if="!(props.embedded && props.addAccount)"
          class="auth-card__label"
          for="handle-input"
        >
          Bluesky / ATProto handle
        </label>
        <div class="input-group">
          <span
            class="input-group__prefix"
            aria-hidden="true"
          >@</span>
          <input
            id="handle-input"
            v-model="handle"
            type="text"
            class="input input-group__field"
            placeholder="alice.bsky.social"
            autocomplete="username"
            spellcheck="false"
          >
          <button
            type="submit"
            class="btn btn--secondary input-group__action"
            :disabled="!canSubmitHandle"
          >
            {{ props.addAccount ? 'Add' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>

    <p
      v-if="!props.addAccount && !props.embedded"
      class="auth-card__footnote"
    >
      Sessions stay in the browser on this device.
    </p>
  </section>
</template>

<style scoped>
.auth-card--embedded {
  padding: 0;
}

.auth-card__embed-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 1.1rem;
}

.auth-card__embed-mark {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  color: var(--pg-accent);
  background: color-mix(in srgb, var(--pg-accent) 12%, transparent);
  border: none;
  border-radius: 12px;
}

.auth-card__embed-mark svg {
  width: 1.2rem;
  height: 1.2rem;
}

.auth-card__embed-copy {
  min-width: 0;
  padding-top: 0.15rem;
}

.auth-card__embed-title {
  margin: 0;
  font-size: 0.975rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--pg-text);
}

.auth-card__embed-lead {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--pg-muted);
}

.auth-card--embedded .auth-card__methods {
  gap: 1rem;
}

.auth-card__oauth--embedded {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  margin-top: 0;
  padding: 0.7rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 10px;
}

.auth-card__divider--plain {
  justify-content: center;
  margin: 0.1rem 0;
  gap: 0;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
}

.auth-card__divider--plain::before,
.auth-card__divider--plain::after {
  display: none;
}

.auth-card__handle--embedded {
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

.auth-card__handle--embedded .auth-card__label {
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--pg-muted);
}

.auth-card--embedded .input-group {
  border-radius: 10px;
  border-color: color-mix(in srgb, var(--pg-border) 80%, transparent);
  background: var(--pg-surface-raised);
}

.auth-card--embedded .input-group__prefix {
  padding: 0 0.65rem;
}

.auth-card--embedded .input-group__field {
  padding: 0.6rem 0.5rem;
}

.auth-card--embedded .input-group__action {
  margin: 0.3rem;
}

.auth-card--embedded-add {
  padding: 0;
}

.auth-card__embed-add-label {
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--pg-muted);
}

.auth-card--embedded-add .auth-card__methods {
  gap: 0.65rem;
}

.auth-card--embedded-add .auth-card__oauth--embedded {
  padding: 0.55rem 0.85rem;
  font-size: 0.8125rem;
}

.auth-card__handle--embedded-add .input-group__action {
  padding-inline: 0.65rem;
  font-size: 0.75rem;
}

.auth-card--compact {
  padding-top: 1.15rem;
}

.auth-card__compact-header {
  margin-bottom: 1rem;
}

.auth-card__compact-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.auth-card__compact-lead {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--pg-muted);
}

.auth-card__hero {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-card__mark {
  display: inline-grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 1.1rem;
  color: var(--pg-accent);
  background:
    radial-gradient(circle at 30% 20%, rgba(0, 220, 130, 0.22), transparent 55%),
    rgba(0, 220, 130, 0.08);
  border: 1px solid rgba(0, 220, 130, 0.28);
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0, 220, 130, 0.14);
}

.auth-card__mark svg {
  width: 1.5rem;
  height: 1.5rem;
}

.auth-card__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.auth-card__lead {
  margin: 0.5rem auto 0;
  max-width: 32ch;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--pg-muted);
}

.auth-card__methods {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.auth-card__oauth {
  margin-top: 0.15rem;
}

.auth-card__oauth-icon {
  display: inline-flex;
}

.auth-card__oauth-icon svg {
  width: 1.1rem;
  height: 1.1rem;
}

.auth-card__hint {
  margin: 0;
  font-size: 0.78rem;
  color: var(--pg-muted);
  text-align: center;
  opacity: 0.9;
}

.auth-card__divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.65rem 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--pg-muted);
}

.auth-card__divider::before,
.auth-card__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--pg-border);
}

.auth-card__handle {
  padding: 1rem;
  border-radius: 12px;
  background: var(--pg-inset);
  border: 1px solid var(--pg-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.auth-card__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pg-text);
}

.auth-card__footnote {
  margin: 1.25rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--pg-border);
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--pg-muted);
  text-align: center;
}
</style>
