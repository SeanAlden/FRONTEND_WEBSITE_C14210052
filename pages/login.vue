<template>
  <div class="flex justify-center items-center bg-gray-100 min-h-screen">
    <div class="bg-white shadow-md p-8 rounded w-full max-w-md">
      <h2 class="mb-6 font-bold text-2xl text-center">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 py-2 rounded w-full text-white"
        >
          Login
        </button>

        <p v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

definePageMeta({
  layout: false,
  middleware: ["$guest"],
});

// async function login() {
//   await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
//     withCredentials: true,
//   });
// }

const handleLogin = async () => {
  errorMessage.value = "";

  const { data, error } = await useFetch("http://localhost:8000/api/auth/login", {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
    },
	withCredentials: true,
    headers: {
      accept: "application/json",
    },
  });

  if (error.value) {
    errorMessage.value =
      error.value.data?.message || "Login failed. Check your credentials.";
    return;
  }

  const token = data.value;

  // Simpan token di localStorage atau cookie
  localStorage.setItem("auth_token", token);

  // Arahkan ke halaman dashboard (atau home)
  router.push("/");
};
</script>
