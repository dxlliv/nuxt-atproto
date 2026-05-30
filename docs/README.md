# nuxt-atproto documentation

Docus site for the module. From the repo root:

```bash
cd docs && pnpm install && pnpm dev
```

Open **http://127.0.0.1:3456/nuxt-atproto/** — use `127.0.0.1`, not `localhost`. ATProto OAuth treats them as different origins; the interactive demo on the home page only works on the loopback address that matches `redirect_uris` in `client-metadata.json`.
