<template>
  <div>
    <header
      class="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gray-400 shadow"
    >
      <h1 class="text-xl font-semibold"></h1>
      <div class="relative flex align-items-xl-end">
        <div>
          <div class="flex items-center gap-6">
            <button
              class="w-10 h-10 overflow-hidden rounded-full"
              @click="goToNotifications"
            >
              <img
                src="/assets/icons/Doorbell.png"
                alt="Notification"
                class="object-cover w-full h-full"
              />
            </button>
            <button
              ref="profileButton"
              class="w-10 h-10 overflow-hidden bg-gray-300 rounded-full focus:outline-none"
              @click="toggleDropdown"
            >
              <!-- <img
                src="/assets/images/photo_default.png"
                alt="Profile"
                class="object-cover w-full h-full"
              /> -->
              <img
                :src="
                  user.profile_image
                    ? `http://localhost:8000/storage/profile_images/${user.profile_image}`
                    : '/assets/images/photo_default.png'
                "
                class="object-cover w-full h-full"
              />
            </button>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <transition name="fade">
          <div
            v-if="isDropdownOpen"
            ref="dropdownMenu"
            class="absolute right-0 z-50 w-56 mt-2 bg-white border rounded-lg shadow-lg"
          >
            <div class="p-4 text-center border-b bg-gray-50">
              <!-- <img
                :src="profileImage"
                alt="Profile"
                class="w-16 h-16 mx-auto border border-gray-300 rounded-full"
              /> -->
              <img
                :src="
                  user.profile_image
                    ? `http://localhost:8000/storage/profile_images/${user.profile_image}`
                    : '/assets/images/photo_default.png'
                "
                class="w-16 h-16 mx-auto border border-gray-300 rounded-full"
              />

              <!-- <h3 class="mt-2 text-lg font-semibold text-gray-900">John Doe</h3>
              <p class="text-sm text-gray-600">johndoe7@gmail.com</p>
              <p class="text-xs text-gray-500">Admin</p> -->

              <h3 class="mt-2 text-lg font-semibold text-gray-900">
                {{ user?.name || "Guest" }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ user?.email || "-" }}
              </p>
              <p class="text-xs text-gray-500">
                {{ user?.usertype || "-" }}
              </p>
            </div>

            <div class="p-2">
              <button
                class="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
                @click="goToEditProfile"
              >
                <img
                  src="/assets/icons/person.png"
                  alt="Edit Profile"
                  class="w-5 h-5 mr-3"
                />
                Edit Profile
              </button>
              <button
                class="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
                @click="goToChangePassword"
              >
                <img
                  src="/assets/icons/password.png"
                  alt="Change Password"
                  class="w-5 h-5 mr-3"
                />
                Change Password
              </button>
              <button
                class="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-100"
                @click="showLogoutModal"
              >
                <img src="/assets/icons/logout.png" alt="Log Out" class="w-5 h-5 mr-3" />
                Log Out
              </button>
            </div>
          </div>
        </transition>
      </div>
    </header>

    <!-- Logout Modal -->
    <transition name="fade">
      <div
        v-if="isLogoutModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="p-6 text-center bg-white rounded-lg shadow-lg w-96">
          <img
            src="/assets/icons/logout.png"
            alt="Logout Icon"
            class="w-10 h-10 mx-auto mb-3"
          />
          <h2 class="text-xl font-semibold text-gray-900">Log Out Account</h2>
          <p class="mt-2 text-gray-700">
            Are you sure you want to logout? <br />
            Once you logout you need to login again. Are you OK?
          </p>
          <div class="flex justify-center mt-4 space-x-4">
            <button
              class="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              @click.prevent="logout"
            >
              <!-- <button class="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"> -->
              Yes
            </button>
            <button
              class="px-6 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
              @click="isLogoutModalOpen = false"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useCookie } from "#app";

// State
const isDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);
const dropdownMenu = ref<HTMLElement | null>(null);
const profileButton = ref<HTMLElement | null>(null);
const router = useRouter();

// const user = ref<{ name: string; email: string; usertype: string } | null>(null);
// const user = ref(null);
const user = ref({
  name: "",
  email: "",
  profile_image: "",
  usertype: "",
});
const token = useCookie("my_auth_token");
// const profileImage = ref("/assets/images/photo_default.png"); // Default image
const profileImage = ref(""); // Kosongkan awalnya

// const checkImageExists = async (url: string) => {
//   try {
//     const res = await fetch(url, { method: "HEAD" });
//     return res.ok;
//   } catch (error) {
//     return false;
//   }
// };

// ✅ Tambahan: Ambil data user
const fetchUser = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    user.value = res.data;
    console.log("User:", user.value);
  } catch (error) {
    const err = error as any; // jika ingin cepat dan tidak ketat
    if (err.response?.status === 401) {
      alert("Sesi Anda telah habis. Silakan login ulang.");
      router.push("/login");
    }
  }
  //   if (axios.isAxiosError(error)) {
  //     if (error.response?.status === 401) {
  //       alert("Sesi Anda telah habis. Silakan login ulang.");
  //       router.push("/login");
  //     } else {
  //       console.error("Kesalahan dari server:", error.response);
  //     }
  //   } else {
  //     console.error("Kesalahan tak diketahui:", error);
  //   }
  // }
};

// const fetchUser = async () => {
//   try {
//     const res = await axios.get("http://127.0.0.1:8000/api/user", {
//       headers: {
//         Authorization: `Bearer ${token.value}`,
//       },
//     });
//     user.value = res.data;

//     const imageUrl = `http://127.0.0.1:8000/storage/profile_images/${user.value?.profile_image}`;
//     const exists = await checkImageExists(imageUrl);

//     profileImage.value = exists ? imageUrl : "/assets/images/photo_default.png";
//   } catch (error) {
//     console.error("Gagal mengambil data user:", error);
//     if (error.response?.status === 401) {
//       alert("Sesi Anda telah habis. Silakan login ulang.");
//       router.push("/login");
//     }
//   }
// };

// Fungsi toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const goToNotifications = () => {
  router.push("/notifications");
};

// Tutup dropdown jika klik di luar
const closeDropdown = (event: MouseEvent) => {
  if (
    dropdownMenu.value &&
    !dropdownMenu.value.contains(event.target as Node) &&
    !profileButton.value?.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", closeDropdown);
  if (isLogoutModalOpen.value === true) {
    isLogoutModalOpen.value = false;
  }

  fetchUser();
});
onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});

// Navigasi
const goToEditProfile = () => router.push("/profile_pages/edit_profile_page");
const goToChangePassword = () => router.push("/profile_pages/edit_password_page");

// Logout
async function logout() {
  try {
    const res = await axios.delete("http://127.0.0.1:8000/api/auth/signout", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    console.log("Logout success:", res.data);

    // Hapus token cookie
    token.value = null;

    // Redirect ke halaman login
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Gagal logout. Silakan coba lagi.");
  }
}

// Tampilkan Modal Logout
const showLogoutModal = () => {
  isLogoutModalOpen.value = true;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
