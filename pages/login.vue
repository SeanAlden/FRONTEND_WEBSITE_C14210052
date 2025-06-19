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

        <!-- Checkbox reCAPTCHA muncul otomatis karena pakai v2 -->
        <div class="mb-4 text-xs text-center text-gray-500">
          * This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy" class="underline" target="_blank">Privacy Policy</a> and
          <a href="https://policies.google.com/terms" class="underline" target="_blank">Terms of Service</a> apply.
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
import { ref, onMounted } from "vue";
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const cookie = useCookie("my_auth_token");

// reCAPTCHA v2 setup
const { recaptchaLoaded, executeRecaptcha } = useRecaptcha();
const recaptchaReady = ref(false);

onMounted(async () => {
  try {
    await recaptchaLoaded(); // Tunggu hingga reCAPTCHA script siap
    recaptchaReady.value = true;
  } catch (e) {
    console.error("Failed to load reCAPTCHA:", e);
    errorMessage.value = "Gagal memuat reCAPTCHA.";
  }
});

async function login() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!recaptchaReady.value) {
    errorMessage.value = "Captcha belum siap. Coba lagi beberapa saat.";
    return;
  }

  let captchaToken = null;

  try {
    captchaToken = await executeRecaptcha(); // Token dari Google
    if (!captchaToken) throw new Error("reCAPTCHA tidak valid");
  } catch (err) {
    errorMessage.value = "Verifikasi reCAPTCHA gagal. Coba lagi.";
    return;
  }

  try {
    const result = await $fetch(useApi("/api/auth/signin"), {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        "g-recaptcha-response": captchaToken,
      },
    });

    cookie.value = result.token;
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value =
      error?.response?.status === 422
        ? "Verifikasi gagal. Coba lagi."
        : "Login gagal. Email/password salah.";
    setTimeout(() => (errorMessage.value = ""), 4000);
  }
}
</script>
