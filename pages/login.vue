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
const cookie = useCookie("my_auth_token");
const errorMessage = ref("");
const successMessage = ref("");

const { vueApp } = useNuxtApp(); // akses plugin recaptcha

onMounted(async () => {
  try {
    await vueApp.$recaptcha.init(); // inisialisasi recaptcha v3
    console.log("reCAPTCHA v3 initialized.");
  } catch (error) {
    console.error("Failed to initialize reCAPTCHA:", error);
  }
});

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

async function login() {
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Ambil token reCAPTCHA v3 dengan aksi 'login'
    const token = await vueApp.$recaptcha.execute("login");

    if (!token) {
      errorMessage.value = "Verifikasi reCAPTCHA gagal. Silakan coba lagi.";
      return;
    }

    const result = await $fetch(useApi("/api/auth/signin"), {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        "g-recaptcha-response": token,
      },
    });

    console.log("Login success:", result);
    cookie.value = result.token;
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error);

    if (error.response?.status === 422) {
      errorMessage.value =
        "Verifikasi reCAPTCHA gagal atau tidak valid. Silakan coba lagi.";
    } else {
      errorMessage.value = "Login gagal. Periksa email dan password Anda.";
    }

    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  }
}
</script>
