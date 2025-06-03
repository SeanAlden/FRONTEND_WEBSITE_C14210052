<template>
  <div class="max-w-8xl max-h-8xl flex h-full w-full rounded-lg bg-white p-6 shadow-lg">
    <!-- Bagian Kiri (Profile Info) -->
    <div class="w-1/2 border-r p-6">
      <h2 class="mb-4 text-2xl font-bold">Set Your Profile</h2>
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

    <!-- Bagian Kanan (Update Profile) -->
    <div class="w-1/2 p-6">
      <h2 class="mb-4 text-xl font-bold">UPDATE ADMIN PROFILE</h2>
      <form @submit.prevent="updateProfile">
        <!-- Username -->
        <label class="mb-2 block text-sm font-bold text-gray-700">Username</label>
        <input
          type="text"
          class="w-full rounded border p-2"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="user.name"
          :disabled="!isEditing"
        />

        <!-- Email -->
        <label class="mb-2 mt-4 block text-sm font-bold text-gray-700"
          >Email address</label
        >
        <input
          type="email"
          class="w-full rounded border p-2"
          :class="{ 'bg-gray-100 cursor-not-allowed': !isEditing }"
          v-model="user.email"
          :disabled="!isEditing"
        />

        <!-- File Upload -->
        <label class="mb-2 mt-4 block text-sm font-bold text-gray-700">File upload</label>
        <div class="flex items-center space-x-3">
          <!-- <img :src="profileImage" class="h-10 w-10 rounded-full" /> -->
					<img
            :src="
              user.profile_image
                ? useApi(`/storage/profile_images/${user.profile_image}`)
                : fallbackImage
            "
            @error="onImageError"
            class="h-10 w-10 rounded-full"
          />
          <input
            type="file"
            class="w-full rounded border p-2"
            @change="handleFileUpload"
          />
        </div>

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
// import { ref, onMounted } from "vue";
// import axios from "axios";

// const user = ref({
//   name: "",
//   email: "",
// });
// const profileImage = ref("/assets/images/photo_default.png"); // default
// const isEditing = ref(false);
// const token = useCookie("my_auth_token");

// // Ambil data user dari Laravel API saat komponen di-mount
// const fetchUser = async () => {
//   try {
//     const res = await axios.get("http://127.0.0.1:8000/api/user", {
//       headers: {
//         Authorization: `Bearer ${token.value}`,
//       },
//     });
//     user.value = res.data;
//     console.log("User:", user.value);
//   } catch (error) {
//     console.error("Gagal mengambil data user:", error);
//     if (error.response?.status === 401) {
//       alert("Sesi Anda telah habis. Silakan login ulang.");
//       window.location.href = "/login";
//     }
//   }
// };

// // Handle file upload lokal
// const handleFileUpload = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     profileImage.value = URL.createObjectURL(file);
//     // NOTE: Di sini hanya preview lokal, untuk upload ke server perlu implementasi tambahan.
//   }
// };

// const toggleEdit = () => {
//   isEditing.value = !isEditing.value;
// };

// // Dummy update function
// // const updateProfile = () => {
// //   alert("Profile updated successfully!");
// //   isEditing.value = false;
// // };

// const updateProfile = async () => {
//   try {
//     const res = await axios.put(
//       "http://127.0.0.1:8000/api/auth/user/update",
//       {
//         name: user.value.name,
//         email: user.value.email,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token.value}`,
//         },
//       }
//     );

//     // Update data lokal dengan respons dari server
//     user.value = res.data.user;

//     alert("Profile updated successfully!");
//     isEditing.value = false;
//   } catch (error) {
//     console.error("Gagal mengupdate profile:", error);
//     if (error.response?.status === 422) {
//       // Menampilkan error validasi Laravel
//       const errors = error.response.data.errors;
//       const messages = Object.values(errors).flat().join("\n");
//       alert(`Validasi gagal:\n${messages}`);
//     } else if (error.response?.status === 401) {
//       alert("Sesi Anda habis. Silakan login ulang.");
//       window.location.href = "/login";
//     } else {
//       alert("Terjadi kesalahan saat mengupdate profil.");
//     }
//   }
// };

// // Panggil fetchUser saat komponen dipasang
// onMounted(() => {
//   fetchUser();
// });

import { ref, onMounted } from "vue";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const user = ref({
  name: "",
  email: "",
  profile_image: "",
});
const profileImage = ref("/assets/images/photo_default.png");
const selectedFile = ref(null); // Untuk menyimpan file gambar
const isEditing = ref(false);
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

// Simpan file lokal dan tampilkan preview
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    profileImage.value = URL.createObjectURL(file);
  }
};

// Fungsi untuk upload gambar ke server
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
    // Update gambar jika berhasil
    user.value.profile_image = res.data.profile_image;
    profileImage.value = useApi(`/storage/profile_images/${res.data.profile_image}`);
  } catch (error) {
    console.error("Gagal mengupload gambar:", error);
    alert("Gagal mengupload gambar profil.");
  }
};

// Fungsi update profil (name + email + optional image)
const updateProfile = async () => {
  try {
    // 1. Kirim name & email
    await axios.put(
      useApi("/api/auth/user/update"),
      {
        name: user.value.name,
        email: user.value.email,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    // 2. Jika ada gambar baru, upload
    if (selectedFile.value) {
      await uploadProfileImage();
    }

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

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

onMounted(() => {
  fetchUser();
});
</script>
