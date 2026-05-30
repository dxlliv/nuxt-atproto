import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'

/**
 * Workaround for Nuxt Content sql_dump prerender failing with h3 v1/v2 mismatch
 * during static generate. Copies per-collection dumps from the build artifact.
 */
export default defineNuxtModule({
  meta: { name: 'static-content-dump' },
  setup(_options, nuxt) {
    nuxt.hooks.hook('nitro:build:public-assets', async (nitro) => {
      const buildDir = join(nuxt.options.buildDir, 'content')
      const dbPath = join(buildDir, 'database.compressed.mjs')

      let db: Record<string, string>
      try {
        db = await import(dbPath)
      }
      catch {
        return
      }

      const publicDir = nitro.options.output.publicDir

      for (const collection of ['docs', 'landing'] as const) {
        const dump = db[collection]
        if (!dump) {
          continue
        }

        const outDir = join(publicDir, '__nuxt_content', collection)
        await mkdir(outDir, { recursive: true })
        await writeFile(join(outDir, 'sql_dump.txt'), dump)
      }
    })
  },
})
