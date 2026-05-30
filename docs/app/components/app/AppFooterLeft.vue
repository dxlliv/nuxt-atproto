<script setup lang="ts">
const year = new Date().getFullYear()
const { public: { playgroundUrl } } = useRuntimeConfig()
</script>

<template>
  <p class="docs-footer-line">
    Copyright © {{ year }}
    ·
    <a
      href="https://github.com/dxlliv/nuxt-atproto"
      target="_blank"
      rel="noopener noreferrer"
      class="docs-footer-brand"
    ><span>nuxt</span>-atproto</a>
    ·
    <a
      :href="playgroundUrl"
      target="_blank"
      rel="noopener noreferrer"
    >playground</a>
    ·
    <a
      href="https://github.com/dxlliv/nuxt-atproto"
      target="_blank"
      rel="noopener noreferrer"
    >github</a>
    ·
    <a
      href="https://www.npmjs.com/package/nuxt-atproto"
      target="_blank"
      rel="noopener noreferrer"
    >npm</a>
  </p>
</template>
