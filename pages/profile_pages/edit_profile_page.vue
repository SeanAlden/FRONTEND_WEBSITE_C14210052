<template>
  <div class="flex w-full h-full p-6 bg-white rounded-lg shadow-lg max-w-8xl max-h-8xl">
    <!-- Bagian Kiri (Profile Info) -->
    <div class="w-1/2 p-6 border-r">
      <h2 class="mb-4 text-2xl font-bold">Set Your Profile</h2>
      <div class="p-6 bg-gray-100 rounded-lg">
        <div class="flex items-center mb-4">
          <img
            :src="
              user.profile_image
                ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                : fallbackImage
            "
            @error="onImageError"
            class="w-20 h-20 rounded-full"
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
          v-model="editUser.name"
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
          v-model="editUser.email"
          :disabled="!isEditing"
        />

        <!-- File Upload -->
        <label class="block mt-4 mb-2 text-sm font-bold text-gray-700">File upload</label>
        <div class="flex items-center space-x-3">
          <!-- <img
            :src="
              user.profile_image
                ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                : fallbackImage
            "
            @error="onImageError"
            class="w-10 h-10 rounded-full"
          /> -->
          <img
            :src="
              selectedFile
                ? profileImage
                : user.profile_image
                ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                : fallbackImage
            "
            @error="onImageError"
            class="w-10 h-10 rounded-full"
          />
          <!-- <input
            type="file"
            class="w-full p-2 border rounded"
            @change="handleFileUpload"
          /> -->
          <input
            type="file"
            class="w-full p-2 border rounded"
            @change="handleFileUpload"
            :disabled="!isEditing"
          />
        </div>

        <!-- Tombol Edit & Save -->
        <div class="flex mt-4 space-x-3">
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
import { ref, onMounted } from "vue";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const user = ref({
  name: "",
  email: "",
  phone: "",
  usertype: "",
  profile_image: "",
});

const editUser = ref({
  name: "",
  email: "",
});

const profileImage = ref("/assets/images/photo_default.png");
const selectedFile = ref(null);
const isEditing = ref(false);
const token = useCookie("my_auth_token");

const fallbackImage = "/assets/images/photo_default.png";

// Ambil data user
const fetchUser = async () => {
  try {
    const res = await axios.get(useApi("/api/user"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    user.value = res.data;

    // Salin ke editUser untuk keperluan form
    editUser.value = {
      name: res.data.name,
      email: res.data.email,
    };

    profileImage.value = user.value.profile_image
      ? useApi(`/public/storage/profile_images/${user.value.profile_image}`)
      : "/assets/images/photo_default.png";
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    if (error.response?.status === 401) {
      alert("Sesi Anda telah habis. Silakan login ulang.");
      window.location.href = "/login";
    }
  }
};

// Handle upload gambar lokal
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    profileImage.value = URL.createObjectURL(file);
  }
};

// Upload ke server
const uploadProfileImage = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append("profile_image", selectedFile.value);

  try {
    const res = await axios.post(
      useApi("/api/auth/user/update-profile-image"),
      formData,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    user.value.profile_image = res.data.profile_image;
    profileImage.value = useApi(
      `/public/storage/profile_images/${res.data.profile_image}`
    );
  } catch (error) {
    console.error("Gagal mengupload gambar:", error);
    alert("Gagal mengupload gambar profil.");
  }
};

// Update profil
const updateProfile = async () => {
  try {
    await axios.put(
      useApi("/api/auth/user/update"),
      {
        name: editUser.value.name,
        email: editUser.value.email,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    // Upload gambar jika ada
    if (selectedFile.value) {
      await uploadProfileImage();
    }

    // Update tampilan kiri
    user.value.name = editUser.value.name;
    user.value.email = editUser.value.email;

    alert("Profile updated successfully!");
    isEditing.value = false;
  } catch (error) {
    console.error("Gagal mengupdate profile:", error);
    if (error.response?.status === 422) {
      const messages = Object.values(error.response.data.errors).flat().join("\n");
      alert(`Validasi gagal:\n${messages}`);
    } else if (error.response?.status === 401) {
      alert("Sesi Anda habis. Silakan login ulang.");
      window.location.href = "/login";
    } else {
      alert("Terjadi kesalahan saat mengupdate profil.");
    }
  }
};

// Toggle mode edit
const toggleEdit = () => {
  if (isEditing.value) {
    // Cancel: kembalikan nilai form ke nilai user asli
    editUser.value = {
      name: user.value.name,
      email: user.value.email,
    };
  }
  isEditing.value = !isEditing.value;
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

onMounted(() => {
  fetchUser();
});
</script>
