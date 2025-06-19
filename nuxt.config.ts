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

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@qirolab/nuxt-sanctum-authentication",
    // '@sidebase/nuxt-auth',
  ],

  // --- Add reCAPTCHA configuration here ---
  // recaptcha: {
  //   hideBadge: false, // Set to true to hide the reCAPTCHA badge (recommended for v3, but can be used for v2 if you display terms)
  //   language: 'en', // Set your preferred language
  //   siteKey: '6Lcda2UrAAAAAPnrnhuAlKNzwIp3A66ooOqNT77P', // <--- REPLACE WITH YOUR ACTUAL reCAPTCHA SITE KEY
  //   version: 2, // Use v2 for the checkbox type reCAPTCHA
  // },
  // --- End reCAPTCHA configuration ---


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
      // Add your reCAPTCHA site key here for client-side access
      recaptchaSiteKey: '6Ld49WUrAAAAACh3Gor5p1UIfdJicTljcR8aO3gJ',
    }
  }
})