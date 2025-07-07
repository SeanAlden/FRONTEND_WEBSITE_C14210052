<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h2 class="mb-6 text-center text-2xl font-semibold text-gray-800">Login</h2>

      <form @submit.prevent="login">
        <div
          v-if="errorMessage"
          class="mb-4 rounded-lg border border-red-200 bg-red-100 p-3 text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="mb-4 rounded-lg border border-green-200 bg-green-100 p-3 text-sm text-green-700"
        >
          {{ successMessage }}
        </div>

        <div class="mb-4">
          <label class="mb-1 block text-gray-700" for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="{ 'border-red-500': emailError }"
            required
            @input="validateEmail"
          />
          <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
        </div>

        <div class="mb-4">
          <label class="mb-1 block text-gray-700" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          class="w-full rounded-lg bg-[#0004FF] px-4 py-2 font-semibold text-white transition duration-300 hover:bg-blue-800"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCookie, useRouter, useRuntimeConfig } from '#app'; 

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
    const result = await $fetch(useApi("/api/auth/signin"), {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
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
      "Login gagal. Periksa kembali email, dan password Anda";

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