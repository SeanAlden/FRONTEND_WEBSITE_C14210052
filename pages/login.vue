<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="mb-6 text-2xl font-semibold text-center text-gray-800">Login</h2>

      <form @submit.prevent="login">
        <div
          v-if="errorMessage"
          class="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg"
        >
          {{ successMessage }}
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div class="mb-4">
          <!-- <NuxtRecaptcha 
            v-if="recaptchaAvailable"
            @success="onCaptchaVerified"
            @error="onCaptchaError"
            @expired="onCaptchaExpired"
          /> -->
          <!-- <Recaptcha
            v-if="recaptchaAvailable"
            @verify="onCaptchaVerified"
            @expire="onCaptchaExpired"
            @error="onCaptchaError"
          /> -->
        </div>

        <button
          type="submit"
          class="bg-[#0004FF] hover:bg-blue-800 px-4 py-2 rounded-lg w-full font-semibold text-white transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
// import { ref, onMounted } from "vue"; // <-- Import 'onMounted'

// const router = useRouter();
// const email = ref("");
// const password = ref("");
// const cookie = useCookie("my_auth_token");
// const errorMessage = ref("");
// const successMessage = ref("");

// // --- Tambahan untuk reCAPTCHA ---
// const { vueApp } = useNuxtApp(); // Akses instance Nuxt
// const captchaToken = ref(null); // Ref untuk menyimpan token captcha
// const recaptchaAvailable = ref(false); // Ref untuk menunda render captcha

// // Fungsi untuk menangani hasil captcha
// const onCaptchaVerified = (response) => {
//   console.log("reCAPTCHA verified:", response);
//   captchaToken.value = response;
//   errorMessage.value = ""; // Hapus pesan error jika ada
// };

// const onCaptchaError = (error) => {
//   console.error("reCAPTCHA error:", error);
//   errorMessage.value = "Terjadi kesalahan pada verifikasi reCAPTCHA.";
//   captchaToken.value = null;
// };

// const onCaptchaExpired = () => {
//   console.log("reCAPTCHA token expired");
//   captchaToken.value = null;
// };
// // --- Akhir Tambahan reCAPTCHA ---

// // Tunda render reCAPTCHA sampai komponen di-mount untuk menghindari hydration mismatch
// onMounted(() => {
//   recaptchaAvailable.value = true;
// });

// definePageMeta({
//   layout: false,
//   middleware: ["guest"],
// });

// async function login() {
//   errorMessage.value = "";
//   successMessage.value = "";

//   // --- Validasi Captcha sebelum mengirim ke backend ---
//   if (!captchaToken.value) {
//     errorMessage.value = "Silakan verifikasi bahwa Anda bukan robot.";
//     return; // Hentikan fungsi jika captcha belum diisi
//   }

//   try {
//     const result = await $fetch(useApi("/api/auth/signin"), {
//       method: "POST",
//       body: {
//         email: email.value,
//         password: password.value,
//         // Kirim token captcha ke backend dengan nama 'g-recaptcha-response'
//         "g-recaptcha-response": captchaToken.value,
//       },
//     });
//     console.log("Login success:", result);
//     cookie.value = result.token;
//     router.push("/");
//   } catch (error) {
//     console.error("Login failed:", error);
//     // Tangani pesan error dari backend
//     if (error.response && error.response.status === 422) {
//       // Jika error validasi, mungkin karena captcha salah
//       errorMessage.value =
//         "Verifikasi reCAPTCHA gagal atau tidak valid. Silakan coba lagi.";
//     } else {
//       errorMessage.value = "Login gagal. Periksa email dan password Anda.";
//     }

//     // Reset captcha di Nuxt setelah gagal login
//     // Ini akan memaksa user untuk mengisi ulang captcha
//     if (vueApp.recaptcha) {
//       vueApp.recaptcha.reset();
//     }
//     captchaToken.value = null;

//     setTimeout(() => {
//       errorMessage.value = "";
//     }, 5000);
//   }
// }

import { ref, onMounted } from "vue";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const cookie = useCookie("my_auth_token");
const router = useRouter();

const runtimeConfig = useRuntimeConfig();
const captchaToken = ref("");

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

async function getRecaptchaToken() {
  try {
    if (!window.grecaptcha) {
      throw new Error("reCAPTCHA belum dimuat.");
    }

    const token = await window.grecaptcha.execute(runtimeConfig.public.recaptchaSiteKey, {
      action: "login",
    });

    captchaToken.value = token;
    return token;
  } catch (error) {
    console.error("Gagal mendapatkan token reCAPTCHA:", error);
    errorMessage.value = "Gagal memuat reCAPTCHA. Silakan muat ulang halaman.";
    return null;
  }
}

async function login() {
  errorMessage.value = "";
  successMessage.value = "";

  // Ambil token sebelum login
  const token = await getRecaptchaToken();
  if (!token) {
    errorMessage.value = "Verifikasi reCAPTCHA gagal. Coba lagi.";
    return;
  }

  try {
    const result = await $fetch(useApi("/api/auth/signin"), {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        // "g-recaptcha-response": token, // kirim ke backend
      },
    });
    // console.log("Login success:", result);
    // cookie.value = result.token;
    // router.push("/");
    successMessage.value = "Login berhasil! Mengarahkan...";
    setTimeout(() => {
      cookie.value = result.token;
      window.location.href = "/";
    }, 1000);
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value =
      "Login gagal. Periksa email, password, atau verifikasi reCAPTCHA.";

    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  }
}

onMounted(() => {
  // Load script reCAPTCHA v3
  const script = document.createElement("script");
  script.src = `https://www.google.com/recaptcha/api.js?render=${runtimeConfig.public.recaptchaSiteKey}`;
  script.async = true;
  document.head.appendChild(script);
});
</script>
<style>
.grecaptcha-badge {
  visibility: visible !important;
}
</style>
