<template>
  <div class="max-w-8xl max-h-8xl flex h-full w-full rounded-lg bg-white p-6 shadow-lg">
    <!-- Bagian Kiri (Password Info) -->
    <div class="w-1/2 border-r p-6">
      <h2 class="mb-4 text-2xl font-bold">Set Your Password</h2>
      <div class="rounded-lg bg-gray-100 p-6">
        <div class="mb-4 flex items-center">
          <!-- <img :src="profileImage" class="h-20 w-20 rounded-full" /> -->
          <img
            :src="
              user.profile_image
                ? useApi(`/storage/profile_images/${user.profile_image}`)
                : fallbackImage
            "
            @error="onImageError"
            class="h-20 w-20 rounded-full"
          />
          <h3 class="ml-4 text-xl font-bold">{{ user.name }}</h3>
        </div>
        <div class="text-left">
          <p class="text-sm font-bold text-gray-600">NAME</p>
          <p class="mb-2 text-gray-800">{{ user.name }}</p>

          <p class="text-sm font-bold text-gray-600">EMAIL</p>
          <p class="mb-2 text-gray-800">{{ user.email }}</p>

          <p class="text-sm font-bold text-gray-600">PHONE</p>
          <p class="mb-2 text-gray-800">{{ user.phone }}</p>

          <p class="text-sm font-bold text-gray-600">USERTYPE</p>
          <p class="text-gray-800">{{ user.usertype }}</p>
        </div>
      </div>
    </div>

    <!-- Bagian Kanan (Update Password) -->
    <div class="w-1/2 p-6">
      <h2 class="mb-4 text-xl font-bold">CHANGE PASSWORD</h2>
      <form @submit.prevent="updatePassword">
        <!-- Old Password -->
        <label class="mb-2 block text-sm font-bold text-gray-700">Old Password</label>
        <input
          type="password"
          class="w-full rounded border p-2"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="password.oldPassword"
          :disabled="!isEditing"
        />

        <!-- New Password -->
        <label class="mb-2 mt-4 block text-sm font-bold text-gray-700"
          >New Password</label
        >
        <input
          type="password"
          class="w-full rounded border p-2"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="password.newPassword"
          :disabled="!isEditing"
        />

        <!-- Confirm New Password -->
        <label class="mb-2 mt-4 block text-sm font-bold text-gray-700"
          >Confirm New Password</label
        >
        <input
          type="password"
          class="w-full rounded border p-2"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="password.confirmNewPassword"
          :disabled="!isEditing"
        />

        <!-- Tombol Edit & Save -->
        <div class="mt-4 flex space-x-3">
          <!-- Tombol Edit -->
          <button
            type="button"
            @click="toggleEdit"
            class="w-1/2 rounded py-2 text-white"
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
            class="w-1/2 rounded py-2 text-white"
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
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const user = ref({
  name: "",
  email: "",
  profile_image: "",
});

// Data password
const password = ref({
  oldPassword: "S34nAld3n.",
  newPassword: "",
  confirmNewPassword: "",
});

const profileImage = ref("/assets/images/photo_default.png"); // Default image
const isEditing = ref(false); // Mode edit
const token = useCookie("my_auth_token");

const fallbackImage = "/assets/images/photo_default.png";

// Ambil data user saat mount
const fetchUser = async () => {
  try {
    const res = await axios.get(useApi("/api/user"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    user.value = res.data;
    profileImage.value = user.value.profile_image
      ? useApi(`/storage/profile_images/${user.value.profile_image}`)
      : "/assets/images/photo_default.png";
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    if (error.response?.status === 401) {
      alert("Sesi Anda telah habis. Silakan login ulang.");
      window.location.href = "/login";
    }
  }
};
// Toggle edit mode
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

// Simpan perubahan password (dummy function)

// const updatePassword = () => {
//   if (password.value.newPassword !== password.value.confirmNewPassword) {
//     alert("New Password and Confirm New Password do not match!");
//     return;
//   }
//   alert("Password updated successfully!");
//   isEditing.value = false;
// };

const updatePassword = async () => {
  if (password.value.newPassword !== password.value.confirmNewPassword) {
    alert("New Password and Confirm New Password do not match!");
    return;
  }

  try {
    const response = await axios.put(
      useApi("/api/auth/user/password"),
      {
        current_password: password.value.oldPassword,
        new_password: password.value.newPassword,
        new_password_confirmation: password.value.confirmNewPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    alert(response.data.message); // Tampilkan pesan sukses
    isEditing.value = false;

    // Reset form password setelah update
    password.value.oldPassword = "";
    password.value.newPassword = "";
    password.value.confirmNewPassword = "";
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || "Failed to update password.");
    } else {
      alert("Something went wrong. Please try again.");
    }
  }
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

onMounted(() => {
  fetchUser();
});
</script>
