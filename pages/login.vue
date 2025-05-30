<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="mb-6 text-2xl font-semibold text-center text-gray-800">
        Login
      </h2>

      <form @submit.prevent="login">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-4 text-sm text-red-500">
          {{ errorMessage }}
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 text-sm text-green-500">
          {{ successMessage }}
        </div>

        <!-- Email -->
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

        <!-- Password -->
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

        <!-- Login Button -->
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
const router = useRouter();
const email = ref('');
const password = ref('');
const cookie = useCookie('my_auth_token');

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

async function login() {
  try {
    const result = await $fetch('http://127.0.0.1:8000/api/auth/signin', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    });
    console.log('Login success:', result);
    // cookie.value = result.token || result; // Simpan token ke cookie jika tersedia
    cookie.value = result.token; // Simpan token ke cookie jika tersedia
    // Redirect ke home page
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login gagal. Periksa email dan password Anda.');
  }
}
</script>
