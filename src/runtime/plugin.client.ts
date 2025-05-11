import {BrowserOAuthClient, OAuthSession} from '@atproto/oauth-client-browser'
import {useRuntimeConfig, defineNuxtPlugin} from "nuxt/app"
import {ref} from "vue";

export default defineNuxtPlugin({
    name: 'atproto',
    async setup(_nuxtApp) {
        const runtimeConfig = useRuntimeConfig()

        // define ATProto OAuth client

        let atprotoOAuthClient: any

        const atprotoOAuthSession = ref<any>()

        if (runtimeConfig.public.atproto.oauth.clientMetadata.remote) {
            atprotoOAuthClient = await BrowserOAuthClient.load({
                handleResolver: runtimeConfig.public.atproto.serviceEndpoint.private,
                clientId: runtimeConfig.public.atproto.oauth.clientMetadata.remote,
                // todo implement custom fetch
            })
        } else {
            atprotoOAuthClient = new BrowserOAuthClient({
                handleResolver: runtimeConfig.public.atproto.serviceEndpoint.private,
                // @ts-ignore
                clientMetadata: import.meta.env.MODE === 'development' ? undefined : runtimeConfig.public.atproto.oauth.clientMetadata.local
                // todo implement custom fetch
            })
        }

        // event vent listener for OAuth session deleted

        atprotoOAuthClient.addEventListener('deleted', (event: CustomEvent<{ sub: string, cause: unknown }>) => {
            const {sub, cause} = event.detail

            if (runtimeConfig.public.atproto.debug) {
                console.warn(`Session deleted for ${sub}. Cause:`, cause)
            }

            _nuxtApp.hooks.callHook("atproto:sessionDeleted", sub)
        })

        // initialize the client and handle ATProto OAuth callbacks

        await atprotoOAuthClient.init()
            .then(async (result: undefined | { session: OAuthSession; state?: string | null }) => {
                if (result) {
                    const {session, state} = result

                    if (runtimeConfig.public.atproto.debug) {
                        if (state != null) {
                            console.log(`${session.sub} was successfully authenticated (state: ${state})`)

                            _nuxtApp.hook('app:mounted', async () => {
                                _nuxtApp.hooks.callHook("atproto:sessionCreated", session.sub)
                            })
                        } else {
                            console.log(`${session.sub} was restored (last active session)`)

                            _nuxtApp.hook('app:mounted', async () => {
                                _nuxtApp.hooks.callHook("atproto:sessionRestored", session.sub)
                            })
                        }
                    }

                    // assign OAuth session

                    atprotoOAuthSession.value = session
                }
            })
            .catch((error: any) => {
                console.error('Error initializing ATProto client or restoring session:', error)
            })

        return {
            provide: {
                atproto: {
                    client: atprotoOAuthClient,
                    session: atprotoOAuthSession,
                },
            }
        }
    }
})
