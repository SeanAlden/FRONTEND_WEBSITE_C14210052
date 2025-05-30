import axios from 'axios';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    host: "127.0.0.1",
    // host: "https://b67b-139-195-158-245.ngrok-free.app",
  },

  // vite: {
  //   server: {
  //     allowedHosts: ['c1d2-139-195-162-44.ngrok-free.app'],
  //   }
  // },

  css: ["~/assets/css/tailwind.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@qirolab/nuxt-sanctum-authentication",
    // '@sidebase/nuxt-auth',
  ],

  laravelSanctum: {
    apiUrl: "http://127.0.0.1:8000",
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
      apiBase: 'https://a651-139-195-169-182.ngrok-free.app'
    }
  }
})