import {useNuxtApp, useRuntimeConfig} from "#app";
import {Agent, AtpAgent} from "@atproto/api";

/**
 * Provide AT Protocol agent
 *
 * @param service
 * @param fetch
 */
export function useAgent(
    service: string,
    fetch?: any
) {
    const runtimeConfig = useRuntimeConfig()

    const {$atproto} = useNuxtApp()

    switch(service) {
        case 'private':
            if (!$atproto.session.value) {
                throw new Error('Not authenticated')
            }

            return new Agent($atproto.session.value)
        case 'public':
            return new AtpAgent({
              service: runtimeConfig.public.atproto.serviceEndpoint.public,
              fetch
            })
        default:
            return new AtpAgent({
              service,
              fetch
            })
    }
}
