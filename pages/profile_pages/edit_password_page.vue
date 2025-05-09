<template>
  <div class="flex bg-white shadow-lg p-6 rounded-lg w-full max-w-8xl h-full max-h-8xl">
    <!-- Bagian Kiri (Password Info) -->
    <!-- <div class="p-6 border-r w-1/2">
      <h2 class="mb-4 font-bold text-2xl">Set Your Password</h2>
      <div class="bg-gray-100 p-6 rounded-lg">
        <div class="text-left">
          <p class="font-bold text-gray-600 text-sm">EMAIL</p>
          <p class="mb-2 text-gray-800">{{ user.email }}</p>

          <p class="font-bold text-gray-600 text-sm">CREATED AT</p>
          <p class="mb-2 text-gray-800">{{ user.createdAt }}</p>

          <p class="font-bold text-gray-600 text-sm">UPDATED AT</p>
          <p class="text-gray-800">{{ user.updatedAt }}</p>
        </div>
      </div>
    </div> -->

    <div class="p-6 border-r w-1/2">
      <h2 class="mb-4 font-bold text-2xl">Set Your Password</h2>
      <div class="bg-gray-100 p-6 rounded-lg">
        <div class="flex items-center mb-4">
          <img :src="profileImage" class="rounded-full w-20 h-20" />
          <h3 class="ml-4 font-bold text-xl">{{ user.name }}</h3>
        </div>
        <div class="text-left">
          <p class="font-bold text-gray-600 text-sm">NAME</p>
          <p class="mb-2 text-gray-800">{{ user.name }}</p>

          <p class="font-bold text-gray-600 text-sm">EMAIL</p>
          <p class="mb-2 text-gray-800">{{ user.email }}</p>

          <p class="font-bold text-gray-600 text-sm">CREATED AT</p>
          <p class="mb-2 text-gray-800">{{ user.createdAt }}</p>

          <p class="font-bold text-gray-600 text-sm">UPDATED AT</p>
          <p class="text-gray-800">{{ user.updatedAt }}</p>
        </div>
      </div>
    </div>

    <!-- Bagian Kanan (Update Password) -->
    <div class="p-6 w-1/2">
      <h2 class="mb-4 font-bold text-xl">CHANGE PASSWORD</h2>
      <form @submit.prevent="updatePassword">
        <!-- Old Password -->
        <label class="block mb-2 font-bold text-gray-700 text-sm">Old Password</label>
        <input
          type="password"
          class="p-2 border rounded w-full"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="password.oldPassword"
          :disabled="!isEditing"
        />

        <!-- New Password -->
        <label class="block mt-4 mb-2 font-bold text-gray-700 text-sm"
          >New Password</label
        >
        <input
          type="password"
          class="p-2 border rounded w-full"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="password.newPassword"
          :disabled="!isEditing"
        />

        <!-- Confirm New Password -->
        <label class="block mt-4 mb-2 font-bold text-gray-700 text-sm"
          >Confirm New Password</label
        >
        <input
          type="password"
          class="p-2 border rounded w-full"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="password.confirmNewPassword"
          :disabled="!isEditing"
        />

        <!-- Tombol Edit & Save -->
        <div class="flex space-x-3 mt-4">
          <!-- Tombol Edit -->
          <button
            type="button"
            @click="toggleEdit"
            class="py-2 rounded w-1/2 text-white"
            :class="
              isEditing
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-yellow-500 hover:bg-yellow-600'
            "
          >
            {{ isEditing ? "Cancel" : "Edit" }}
          </button>

          <!-- Tombol Save Changes -->
          <button
            type="submit"
            class="py-2 rounded w-1/2 text-white"
            :class="
              isEditing
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            "
            :disabled="!isEditing"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Data pengguna
const user = ref({
  name: "John Doe",
  email: "johndoe7@gmail.com",
  createdAt: "2024-07-23 14:15:32",
  updatedAt: "2024-07-23 14:15:32",
});

// Data password
const password = ref({
  oldPassword: "S34nAld3n.",
  newPassword: "",
  confirmNewPassword: "",
});

const profileImage = ref("/assets/images/photo_default.png"); // Default image
const isEditing = ref(false); // Mode edit

// Toggle edit mode
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

// Simpan perubahan password (dummy function)
const updatePassword = () => {
  if (password.value.newPassword !== password.value.confirmNewPassword) {
    alert("New Password and Confirm New Password do not match!");
    return;
  }
  alert("Password updated successfully!");
  isEditing.value = false;
};
</script>
