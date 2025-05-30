<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="mb-6 text-2xl font-semibold text-center text-gray-800">
        Register Your Account
      </h2>

      <form @submit.prevent="register">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-4 text-sm text-red-500">
          {{ errorMessage }}
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 text-sm text-green-500">
          {{ successMessage }}
        </div>

        <!-- Name -->
        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="name">Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            placeholder="Enter your name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
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

        <!-- Phone -->
        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="phone">Phone</label>
          <input
            v-model="phone"
            type="text"
            id="phone"
            placeholder="Enter your phone"
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

        <!-- Confirm Password -->
        <div class="mb-6">
          <label class="block mb-1 text-gray-700" for="password_confirmation"
            >Confirm Password</label
          >
          <input
            v-model="confirm_password"
            type="password"
            id="confirm_password"
            placeholder="Confirm your password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          class="bg-[#0004FF] hover:bg-blue-800 px-4 py-2 rounded-lg w-full font-semibold text-white transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirm_password = ref('');
const cookie = useCookie('my_auth_token');

definePageMeta({
  layout: false,
});

async function register() {
  try {
    const result = await $fetch(useApi('/api/auth/signup'), {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        password_confirmation: confirm_password.value
      }
    });
    console.log('Register success:', result);
    // Redirect ke login
    router.push('/login');
  } catch (error) {
    console.error('Register failed:', error);
    alert('Registrasi gagal. Periksa data Anda.');
  }
}
</script>
