import { useRuntimeConfig } from 'nuxt/app'
import type { AtprotoNuxtOptions } from '../../../types'

export function useAtprotoRuntimeConfig(): AtprotoNuxtOptions {
  return useRuntimeConfig().public.atproto as AtprotoNuxtOptions
}
