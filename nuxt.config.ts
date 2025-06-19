import axios from 'axios';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    // host: "127.0.0.1",
    host: "https://asiaraya.my.id",
  },

  // vite: {
  //   server: {
  //     allowedHosts: ['c1d2-139-195-162-44.ngrok-free.app'],
  //   }
  // },

  css: ["~/assets/css/tailwind.css"],

  auth: {
    // baseURL: `http://localhost:${process.env.PORT || 3000}`
    baseURL: `https://asiaraya.my.id`
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@qirolab/nuxt-sanctum-authentication",
    'nuxt3-recaptcha',
    // "@nuxtjs/recaptcha",
    // "@sidebase/nuxt-recaptcha",
    '@sidebase/nuxt-auth',
  ],

  recaptcha: {
    siteKey: '6Lcda2UrAAAAAPnrnhuAlKNzwIp3A66ooOqNT77P', // ganti dengan milikmu
    version: "v3", // pakai v2 checkbox
    // size: 'normal', // atau 'compact'
    // hideBadge: true, // opsional
    // language: 'id' // Optional
  },

  laravelSanctum: {
    // apiUrl: "http://127.0.0.1:8000",
    apiUrl: "https://asiaraya.my.id",
    authMode: "cookie",
    // withCredentials: true,

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
      apiBase: 'https://asiaraya.my.id',
      // apiBase: 'http://127.0.0.1:8000'
      reCaptcha: {
        // Site Key Anda dari Google
        siteKey: '6Lcda2UrAAAAAPnrnhuAlKNzwIp3A66ooOqNT77P', 
      },
    }
  }
})