<script setup lang="ts">
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
  <section class="auth-card panel panel--featured">
    <div class="auth-card__hero">
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

    <div class="auth-card__methods">
      <button
        type="button"
        class="btn btn--primary btn--lg btn--block auth-card__oauth"
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
        Continue with your PDS
      </button>
      <p class="auth-card__hint">
        Redirects to your personal data server for authorization.
      </p>

      <div
        class="auth-card__divider"
        role="separator"
      >
        <span>or sign in with handle</span>
      </div>

      <form
        class="auth-card__handle"
        @submit.prevent="submitHandle"
      >
        <label
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
            Sign in
          </button>
        </div>
      </form>
    </div>

    <p class="auth-card__footnote">
      Sessions stay in the browser on this device.
    </p>
  </section>
</template>

<style scoped>
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
  background: rgba(0, 0, 0, 0.28);
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
