<template>
  <div class="flex w-full h-full p-6 bg-white rounded-lg shadow-lg max-w-8xl max-h-8xl">
    <!-- Bagian Kiri (Profile Info) -->
    <div class="w-1/2 p-6 border-r">
      <h2 class="mb-4 text-2xl font-bold">Set Your Profile</h2>
      <div class="p-6 bg-gray-100 rounded-lg">
        <div class="flex items-center mb-4">
          <img :src="profileImage" class="w-20 h-20 rounded-full" />
          <h3 class="ml-4 text-xl font-bold">{{ user.name }}</h3>
        </div>
        <div class="text-left">
          <p class="text-sm font-bold text-gray-600">NAME</p>
          <p class="mb-2 text-gray-800">{{ user.name }}</p>

          <p class="text-sm font-bold text-gray-600">EMAIL</p>
          <p class="mb-2 text-gray-800">{{ user.email }}</p>

          <p class="text-sm font-bold text-gray-600">CREATED AT</p>
          <p class="mb-2 text-gray-800">{{ user.createdAt }}</p>

          <p class="text-sm font-bold text-gray-600">UPDATED AT</p>
          <p class="text-gray-800">{{ user.updatedAt }}</p>
        </div>
      </div>
    </div>

    <!-- Bagian Kanan (Update Profile) -->
    <div class="w-1/2 p-6">
      <h2 class="mb-4 text-xl font-bold">UPDATE ADMIN PROFILE</h2>
      <form @submit.prevent="updateProfile">
        <!-- Username -->
        <label class="block mb-2 text-sm font-bold text-gray-700">Username</label>
        <input
          type="text"
          class="w-full p-2 border rounded"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="user.name"
          :disabled="!isEditing"
        />

        <!-- Email -->
        <label class="block mt-4 mb-2 text-sm font-bold text-gray-700"
          >Email address</label
        >
        <input
          type="email"
          class="w-full p-2 border rounded"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="user.email"
          :disabled="!isEditing"
        />

        <!-- File Upload -->
        <label class="block mt-4 mb-2 text-sm font-bold text-gray-700">File upload</label>
        <div class="flex items-center space-x-3">
          <img :src="profileImage" class="w-10 h-10 rounded-full" />
          <input
            type="file"
            class="w-full p-2 border rounded"
            @change="handleFileUpload"
          />
        </div>

        <!-- Tombol Edit & Save -->
        <div class="flex mt-4 space-x-3">
          <!-- Tombol Edit -->
          <button
            type="button"
            @click="toggleEdit"
            class="w-1/2 py-2 text-white rounded"
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
            class="w-1/2 py-2 text-white rounded"
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

// Data profil pengguna
const user = ref({
  name: "John Doe",
  email: "johndoe7@gmail.com",
  createdAt: "2024-07-23 14:15:32",
  updatedAt: "2024-07-23 14:15:32",
});

const profileImage = ref("/assets/images/photo_default.png"); // Default image
const isEditing = ref(false); // Mode edit

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = URL.createObjectURL(file);
  }
};

// Toggle edit mode
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

// Simpan perubahan (dummy function)
const updateProfile = () => {
  alert("Profile updated successfully!");
  isEditing.value = false;
};
</script>
