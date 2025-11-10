import axios from 'axios';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    host: "127.0.0.1",
    // host: "https://asiaraya.my.id",
  },

  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/recaptcha-hide.css",
  ],

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@qirolab/nuxt-sanctum-authentication",
    // '@sidebase/nuxt-auth',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  laravelSanctum: {
    // apiUrl: "http://127.0.0.1:8000",
    // apiUrl: "https://asiaraya.my.id",
    apiUrl: "https://backend-tugas-akhir-c14210052.vercel.app",
    authMode: "cookie",

    sanctumEndpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      user: '/api/user',
    },

    redirect: {
      enableIntendedRedirect: false,
      loginPath: '/login',
      guestOnlyRedirect: '/',
      redirectToAfterLogin: '/',
      redirectToAfterLogout: '/'
    },
  },

  nitro: {
    preset: 'netlify'
  },

  runtimeConfig: {
    public: {
      // apiBase: 'https://asiaraya.my.id',
      apiBase: 'https://backend-tugas-akhir-c14210052.vercel.app',
      // apiBase: 'http://127.0.0.1:8000',
      recaptchaSiteKey: '6Ld49WUrAAAAACh3Gor5p1UIfdJicTljcR8aO3gJ',
    }
  },
  app: {
    head: {
      title: "Asia Raya Cashier",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        {
          rel: 'shortcut icon',
          href: '/assets/icons/icon.png'
        }
      ]
    }
  }
})