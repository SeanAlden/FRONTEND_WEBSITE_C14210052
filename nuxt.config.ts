import axios from 'axios';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    host: "127.0.0.1",
  },

  css: ["~/assets/css/tailwind.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@qirolab/nuxt-sanctum-authentication",
  ],

  laravelSanctum: {
    // apiUrl: "http://api.localhost",
    // apiUrl: "http://localhost:8000",
    // apiUrl: "http://c45_best_seller_prediction.test",
    apiUrl: "http://127.0.0.1:8000",
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
  }
})