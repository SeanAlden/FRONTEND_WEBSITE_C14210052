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
import { useReCaptcha } from 'vue-recaptcha-v3'; // Import useReCaptcha for v3

const router = useRouter();
const email = ref("");
const password = ref("");
const cookie = useCookie("my_auth_token");
const errorMessage = ref("");
const successMessage = ref("");

// For reCAPTCHA v3
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
const captchaToken = ref(null);

// No longer needed for v3 since there's no visible widget to "load" in this way
// const recaptchaAvailable = ref(false);
// onMounted(() => {
//   recaptchaAvailable.value = true;
// });


definePageMeta({
  layout: false,
  middleware: ["guest"],
});

async function login() {
  errorMessage.value = "";
  successMessage.value = "";

  // Execute reCAPTCHA v3 right before the login attempt
  try {
    await recaptchaLoaded(); // Ensure reCAPTCHA script is loaded
    captchaToken.value = await executeRecaptcha('login'); // 'login' is an action name
    console.log("reCAPTCHA v3 token:", captchaToken.value);
  } catch (error) {
    console.error("reCAPTCHA execution error:", error);
    errorMessage.value = "Terjadi kesalahan saat memverifikasi reCAPTCHA. Silakan coba lagi.";
    captchaToken.value = null;
    return; // Stop login if reCAPTCHA fails client-side
  }

  // --- Validasi Captcha sebelum mengirim ke backend ---
  if (!captchaToken.value) {
    errorMessage.value = "Silakan verifikasi bahwa Anda bukan robot.";
    return; // Hentikan fungsi jika captcha belum diisi
  }

  try {
    const result = await $fetch(useApi("/api/auth/signin"), {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        // Kirim token captcha ke backend dengan nama 'g-recaptcha-response'
        "g-recaptcha-response": captchaToken.value,
      },
    });
    console.log("Login success:", result);
    cookie.value = result.token;
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
    // Tangani pesan error dari backend
    if (error.response && error.response.status === 422) {
      errorMessage.value =
        "Verifikasi reCAPTCHA gagal atau tidak valid. Silakan coba lagi.";
    } else {
      errorMessage.value = "Login gagal. Periksa email dan password Anda.";
    }

    // For v3, no explicit reset needed, as you execute for each action.
    captchaToken.value = null; // Clear token on failure

    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  }
}
</script>