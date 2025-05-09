<template>
  <div class="flex justify-center items-center bg-gray-100 min-h-screen">
    <div class="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
      <h2 class="mb-6 font-semibold text-gray-800 text-2xl text-center">
        Register Your Account
      </h2>

      <form @submit.prevent="registerUser">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-4 text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 text-green-500 text-sm">
          {{ successMessage }}
        </div>

        <!-- Name -->
        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="name">Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Enter your name"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="email">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
        </div>

        <!-- Phone -->
        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="phone">Phone</label>
          <input
            v-model="form.phone"
            type="text"
            id="phone"
            placeholder="Enter your phone"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block mb-1 text-gray-700" for="password">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="mb-6">
          <label class="block mb-1 text-gray-700" for="password_confirmation"
            >Confirm Password</label
          >
          <input
            v-model="form.password_confirmation"
            type="password"
            id="password_confirmation"
            placeholder="Confirm your password"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
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

<script>
import axios from "axios";

definePageMeta({
  layout: false,
});

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },

  //   methods: {
  //     async registerUser() {
  //       this.errorMessage = ''
  //       this.successMessage = ''

  //       try {
  //         const response = await axios.post('http://localhost:8000/api/register', this.form)
  //         this.successMessage = response.data.message
  //         this.form = {
  //           name: '',
  //           email: '',
  //           phone: '',
  //           password: '',
  //           password_confirmation: ''
  //         }
  //       } catch (error) {
  //         if (error.response && error.response.status === 422) {
  //           // Tampilkan semua error dari validasi
  //           const errors = error.response.data.errors
  //           this.errorMessage = Object.values(errors).flat().join(', ')
  //         } else {
  //           this.errorMessage = 'Something went wrong. Please try again.'
  //         }
  //       }
  //     }
  //   }

  methods: {
    async registerUser() {
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/register",
          this.form
        );
        this.successMessage = response.data.message;

        // Reset form
        this.form = {
          name: "",
          email: "",
          phone: "",
          password: "",
          password_confirmation: "",
        };

        // Redirect ke halaman login setelah 2 detik
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          this.errorMessage = Object.values(errors).flat().join(", ");
        } else {
          this.errorMessage = "Something went wrong. Please try again.";
        }
      }
    },
  },
};
</script>
