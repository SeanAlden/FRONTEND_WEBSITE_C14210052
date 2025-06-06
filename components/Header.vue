<template>
  <div>
    <header
      class="fixed left-0 right-0 top-0 flex items-center justify-between bg-gray-400 px-6 py-4 shadow"
    >
      <h1 class="text-xl font-semibold"></h1>
      <div class="align-items-xl-end relative flex">
        <div>
          <div class="flex items-center gap-6">
            <button
              class="h-10 w-10 overflow-hidden rounded-full"
              @click="toggleNotificationDropdown"
            >
              <img
                src="/assets/icons/Doorbell.png"
                alt="Notification"
                class="h-full w-full object-cover"
              />
            </button>
            <!-- Notification Dropdown -->
            <transition name="fade">
              <div
                v-if="isNotificationDropdownOpen"
                ref="notificationDropdown"
                class="absolute right-16 z-50 mt-2 w-80 rounded-lg bg-white shadow-lg"
              >
                <div class="border-b p-4">
                  <h2 class="text-lg font-semibold text-gray-800">Notifications</h2>
                </div>
                <div class="max-h-80 divide-y overflow-y-auto">
                  <div
                    v-for="notification in notifications.slice(0, 5)"
                    :key="notification.id"
                    class="p-4"
                  >
                    <p class="text-sm text-gray-700">{{ notification.message }}</p>
                    <p class="text-xs text-gray-500">
                      {{ formatDate(notification.notification_time) }}
                    </p>
                    <button
                      class="mt-2 text-sm text-blue-500 hover:underline"
                      @click="markAsRead(notification.id)"
                    >
                      Read
                    </button>
                  </div>
                  <div
                    v-if="notifications.length === 0"
                    class="p-4 text-center text-sm text-gray-500"
                  >
                    No new notifications
                  </div>
                </div>
                <div class="border-t p-3 text-center">
                  <button
                    class="text-sm font-semibold text-blue-600 hover:underline"
                    @click="goToNotifications"
                  >
                    See All
                  </button>
                </div>
              </div>
            </transition>
            <button
              ref="profileButton"
              class="h-10 w-10 overflow-hidden rounded-full bg-gray-300 focus:outline-none"
              @click="toggleDropdown"
            >
              <!-- <img
                src="/assets/images/photo_default.png"
                alt="Profile"
                class="h-full w-full object-cover"
              /> -->
              <img
                :src="
                  user.profile_image
                    ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                    : fallbackImage
                "
                @error="onImageError"
                class="h-full w-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <transition name="fade">
          <div
            v-if="isDropdownOpen"
            ref="dropdownMenu"
            class="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white shadow-lg"
          >
            <div class="border-b bg-gray-50 p-4 text-center">
              <!-- <img
                :src="profileImage"
                alt="Profile"
                class="mx-auto h-16 w-16 rounded-full border border-gray-300"
              /> -->
              <img
                :src="
                  user.profile_image
                    ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                    : fallbackImage
                "
                class="mx-auto h-16 w-16 rounded-full border border-gray-300"
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
                class="flex w-full items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                @click="goToEditProfile"
              >
                <img
                  src="/assets/icons/person.png"
                  alt="Edit Profile"
                  class="mr-3 h-5 w-5"
                />
                Edit Profile
              </button>
              <button
                class="flex w-full items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                @click="goToChangePassword"
              >
                <img
                  src="/assets/icons/password.png"
                  alt="Change Password"
                  class="mr-3 h-5 w-5"
                />
                Change Password
              </button>
              <button
                class="flex w-full items-center rounded-lg px-4 py-3 text-red-600 hover:bg-red-100"
                @click="showLogoutModal"
              >
                <img src="/assets/icons/logout.png" alt="Log Out" class="mr-3 h-5 w-5" />
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
        <div class="w-96 rounded-lg bg-white p-6 text-center shadow-lg">
          <img
            src="/assets/icons/logout.png"
            alt="Logout Icon"
            class="mx-auto mb-3 h-10 w-10"
          />
          <h2 class="text-xl font-semibold text-gray-900">Log Out Account</h2>
          <p class="mt-2 text-gray-700">
            Are you sure you want to logout? <br />
            Once you logout you need to login again. Are you OK?
          </p>
          <div class="mt-4 flex justify-center space-x-4">
            <button
              class="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
              @click.prevent="logout"
            >
              <!-- <button class="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"> -->
              Yes
            </button>
            <button
              class="rounded-lg bg-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-400"
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
import emitter from "~/plugins/event-bus";

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

const fallbackImage = "/assets/images/photo_default.png";

// const checkImageExists = async (url: string) => {
//   try {
//     const res = await fetch(url, { method: "HEAD" });
//     return res.ok;
//   } catch (error) {
//     return false;
//   }
// };

// Tambahan State
const isNotificationDropdownOpen = ref(false);
const notificationDropdown = ref<HTMLElement | null>(null);
const notifications = ref<Array<any>>([]);

// Toggle Notifikasi
const toggleNotificationDropdown = async () => {
  isNotificationDropdownOpen.value = !isNotificationDropdownOpen.value;
  if (isNotificationDropdownOpen.value) {
    await fetchNotifications();
  }
};

// Ambil Notifikasi
const fetchNotifications = async () => {
  try {
    const res = await axios.get(useApi("/api/notifications"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    notifications.value = res.data;
  } catch (error) {
    console.error("Gagal mengambil notifikasi:", error);
  }
};

// Tandai sebagai dibaca
const markAsRead = async (id: number) => {
  try {
    await axios.put(useApi(`/api/notifications/${id}`), {}, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    // Refresh list
    await fetchNotifications();
  } catch (error) {
    console.error("Gagal menandai notifikasi:", error);
  }
};

// Format tanggal
const formatDate = (datetimeStr: string): string => {
  const date = new Date(datetimeStr);
  return date.toLocaleString();
};

// Tambahkan event listener untuk klik di luar dropdown
const closeAllDropdowns = (event: MouseEvent) => {
  const isClickOutsideNotif =
    notificationDropdown.value &&
    !notificationDropdown.value.contains(event.target as Node);
  const isClickOutsideProfile =
    dropdownMenu.value &&
    !dropdownMenu.value.contains(event.target as Node);
  const isClickOutsideBell = !(event.target as HTMLElement).closest("button");

  if (
    isNotificationDropdownOpen.value &&
    isClickOutsideNotif &&
    !(event.target as HTMLElement).closest("button")
  ) {
    isNotificationDropdownOpen.value = false;
  }

  if (
    isDropdownOpen.value &&
    isClickOutsideProfile &&
    !(event.target as HTMLElement).closest("button")
  ) {
    isDropdownOpen.value = false;
  }
};

// ✅ Tambahan: Ambil data user
const fetchUser = async () => {
  try {
    const res = await axios.get(useApi("/api/user"), {
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
  document.addEventListener("click", closeAllDropdowns);
  if (isLogoutModalOpen.value === true) {
    isLogoutModalOpen.value = false;
  }

  fetchUser();

  // ✅ Dengarkan event profile-updated
  emitter.on("profile-updated", () => {
    fetchUser(); // Ambil ulang data user dari server
  });
});
onUnmounted(() => {
  document.removeEventListener("click", closeAllDropdowns);
  emitter.off("profile-updated"); // Bersihkan event listener
});

// Navigasi
const goToEditProfile = () => router.push("/profile_pages/edit_profile_page");
const goToChangePassword = () => router.push("/profile_pages/edit_password_page");

// Logout
async function logout() {
  try {
    const res = await axios.delete(useApi("/api/auth/signout"), {
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

// const onImageError = (event: { target: { src: string } }) => {
//   event.target.src = fallbackImage;
// };

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = fallbackImage;
};

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
