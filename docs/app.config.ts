export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc',
    },
    button: {
      defaultVariants: {
        color: 'primary',
      },
    },
    header: {
      slots: {
        root: 'border-b border-default bg-elevated/90 backdrop-blur-md',
      },
    },
    footer: {
      slots: {
        root: 'border-t border-default',
      },
    },
    page: {
      slots: {
        root: 'gap-y-8',
      },
    },
    pageHero: {
      slots: {
        title: 'text-4xl sm:text-5xl font-bold tracking-tight text-balance',
        description: 'text-lg text-muted text-balance',
      },
    },
    pageSection: {
      slots: {
        title: 'text-2xl sm:text-3xl font-bold tracking-tight text-balance',
        description: 'text-base text-muted text-balance',
      },
    },
    pageCard: {
      slots: {
        root: 'ring ring-default bg-elevated/60',
      },
    },
  },

  docus: {},

  navigation: {
    sub: 'aside',
  },

  header: {
    title: 'nuxt-atproto',
  },

  seo: {
    title: 'nuxt-atproto',
    titleTemplate: '%s · nuxt-atproto',
    description: 'AT Protocol OAuth authentication module for Nuxt — client-first sessions and cached agents.',
  },

  github: {
    url: 'https://github.com/dxlliv/nuxt-atproto',
    branch: 'main',
    rootDir: '',
  },

  socials: {
    github: 'https://github.com/dxlliv/nuxt-atproto',
    npm: 'https://www.npmjs.com/package/nuxt-atproto',
  },
})
