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
            :class="{ 'border-red-500': emailError }"
            required
            @input="validateEmail"
          />
          <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="{ 'border-red-500': passwordError }"
            required
            @input="validatePassword"
          />
          <p v-if="passwordError" class="mt-1 text-xs text-red-500">{{ passwordError }}</p>
        </div>

        <div class="mb-4">
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
import { useCookie, useRouter, useRuntimeConfig } from '#app'; // Adjust imports if useApi is a custom composable

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const emailError = ref("");
const passwordError = ref("");

const cookie = useCookie("my_auth_token");
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const captchaToken = ref("");

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

// --- Validation Functions ---
const validateEmail = () => {
  if (!email.value) {
    emailError.value = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Please enter a valid email address.";
  } else {
    emailError.value = "";
  }
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "Password is required.";
  } else if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters long.";
  } else {
    passwordError.value = "";
  }
};

// --- reCAPTCHA Function (unchanged) ---
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

// --- Login Function ---
async function login() {
  errorMessage.value = "";
  successMessage.value = "";

  // Run all validations before attempting login
  validateEmail();
  validatePassword();

  if (emailError.value || passwordError.value) {
    errorMessage.value = "Please correct the input errors.";
    return; // Stop the login process if there are validation errors
  }

  // Get reCAPTCHA token
  const token = await getRecaptchaToken();
  if (!token) {
    errorMessage.value = "Verifikasi reCAPTCHA gagal. Coba lagi.";
    return;
  }

  try {
    const result = await $fetch(useApi("/api/auth/login"), {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        // "g-recaptcha-response": token,
      },
    });
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