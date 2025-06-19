<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// import Header from "@/components/Header.vue";
// import Sidebar from "@/components/Sidebar.vue";
// import LogoutModal from "@/components/LogoutModal.vue";
// import { ref } from "vue";
import axios from 'axios';

axios.defaults.withCredentials = true;

// Tambahkan script reCAPTCHA lewat useHead
useHead({
  script: [
    {
      src: 'https://www.google.com/recaptcha/api.js',
      async: true,
      defer: true
    }
  ]
});
</script>
