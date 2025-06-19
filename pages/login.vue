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

        <div class="mb-4 text-sm text-center text-gray-500">
            <p>This site is protected by reCAPTCHA and the Google</p>
            <p><a href="https://policies.google.com/privacy" target="_blank" class="text-blue-600 hover:underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" class="text-blue-600 hover:underline">Terms of Service</a> apply.</p>
            <p v-if="!recaptchaLoadedRef && process.client" class="mt-2 text-xs text-blue-500">
              Memuat verifikasi keamanan...
            </p>
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
import { ref, onMounted, computed } from "vue";
import { useNuxtApp } from '#app'; // Import useNuxtApp
// 

const router = useRouter();
const email = ref("");
const password = ref("");
const cookie = useCookie("my_auth_token");
const errorMessage = ref("");
const successMessage = ref("");

const captchaToken = ref(null);

// Definisikan refs untuk fungsi reCAPTCHA.
// Inisialisasi mereka sebagai null atau fungsi dummy jika belum tersedia
let executeRecaptcha = null;
let recaptchaLoaded = null;

// Gunakan ref terpisah untuk melacak apakah reCAPTCHA sudah loaded sepenuhnya
const recaptchaLoadedRef = ref(false);

onMounted(async () => {
  if (process.client) {
    const nuxtApp = useNuxtApp();
    try {
      // Pastikan VueReCaptcha sudah terinstal di app Vue
      // vue-recaptcha-v3 akan mendaftarkan composable global
      // Kita bisa mengaksesnya melalui $recaptcha (jika plugin mengaturnya)
      // atau langsung mencoba import jika plugin belum selesai fully expose composable
      // Cara yang lebih aman adalah menunggu sampai semua plugin terinisialisasi jika ini masalah timing

      // Coba akses useReCaptcha secara langsung lagi, namun pastikan tidak ada error
      // Ini adalah perbaikan utama: pastikan `actualUseReCaptcha` benar-benar fungsi.
      const { useReCaptcha: actualUseReCaptcha } = await import('vue-recaptcha-v3');

      if (typeof actualUseReCaptcha === 'function') {
        const recaptchaComposable = actualUseReCaptcha();
        executeRecaptcha = recaptchaComposable.executeRecaptcha;
        recaptchaLoaded = recaptchaComposable.recaptchaLoaded;

        // Tunggu hingga reCAPTCHA API script dimuat
        await recaptchaLoaded(); // Ini akan menunggu API Google reCAPTCHA dimuat

        recaptchaLoadedRef.value = true; // Set true setelah API reCAPTCHA dimuat
        console.log("reCAPTCHA composable initialized and API loaded on client.");
        errorMessage.value = ""; // Bersihkan pesan error jika berhasil dimuat
      } else {
        console.error("useReCaptcha is not a function after dynamic import.");
        errorMessage.value = "Failed to load reCAPTCHA. Please try refreshing.";
      }

    } catch (e) {
      console.error("Failed to load or initialize useReCaptcha on client:", e);
      errorMessage.value = "Failed to load reCAPTCHA. Please try refreshing.";
    }
  } else {
    console.log("Running on server, reCAPTCHA related logic skipped.");
  }
});


definePageMeta({
  layout: false,
  middleware: ["guest"],
});

async function login() {
  errorMessage.value = "";
  successMessage.value = "";

  // Pastikan reCAPTCHA sudah dimuat sepenuhnya sebelum mencoba mendapatkan token
  if (!recaptchaLoadedRef.value || !executeRecaptcha || !recaptchaLoaded) {
    errorMessage.value = "Verifikasi reCAPTCHA sedang dimuat, harap tunggu sebentar.";
    return;
  }

  // Execute reCAPTCHA v3 right before the login attempt
  try {
    // recaptchaLoaded() sudah dipanggil di onMounted dan ditunggu,
    // tapi memanggilnya lagi di sini tidak masalah dan memastikan API siap.
    await recaptchaLoaded();
    const token = await executeRecaptcha('login'); // 'login' is an action name
    captchaToken.value = token;
    console.log("reCAPTCHA v3 token:", token);
  } catch (error) {
    console.error("reCAPTCHA execution error:", error);
    errorMessage.value = "Terjadi kesalahan saat memverifikasi reCAPTCHA. Silakan coba lagi.";
    captchaToken.value = null;
    return; // Stop login if reCAPTCHA fails client-side
  }

  if (!captchaToken.value) {
    errorMessage.value = "Silakan verifikasi bahwa Anda bukan robot.";
    return;
  }

  try {
    const result = await $fetch(useApi("/api/auth/signin"), {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        "g-recaptcha-response": captchaToken.value,
      },
    });
    console.log("Login success:", result);
    cookie.value = result.token;
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
    if (error.response && error.response.status === 422) {
      errorMessage.value =
        "Verifikasi reCAPTCHA gagal atau tidak valid. Silakan coba lagi.";
    } else {
      errorMessage.value = "Login gagal. Periksa email dan password Anda.";
    }

    captchaToken.value = null;

    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  }
}
</script>