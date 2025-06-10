<template>
  <div>
    <header
      class="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gray-400 shadow"
    >
      <h1 class="text-xl font-semibold"></h1>
      <div class="relative flex align-items-xl-end">
        <div>
          <div class="flex items-center gap-6">
            <!-- Notifikasi Bell Button -->
            <div class="relative">
              <!-- <button
                class="w-10 h-10 overflow-hidden rounded-full"
                @click="toggleNotificationDropdown"
              >
                <img
                  src="/assets/icons/Doorbell.png"
                  alt="Notification"
                  class="object-cover w-full h-full"
                />
              </button> -->

              <button
                ref="notificationButton"
                class="w-10 h-10 overflow-hidden rounded-full"
                @click="toggleNotificationDropdown"
              >
                <img
                  src="/assets/icons/Doorbell.png"
                  alt="Notification"
                  class="object-cover w-full h-full"
                />
                <!-- 🔴 Badge Jumlah Notifikasi -->
                <span
                  v-if="unreadCount > 0"
                  class="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                >
                  {{ unreadCount }}
                </span>
              </button>

              <!-- Dropdown Notifikasi -->
              <transition name="fade">
                <div
                  v-if="isNotificationDropdownOpen"
                  ref="notificationDropdown"
                  class="absolute right-0 z-50 mt-2 bg-white border rounded-lg shadow-lg w-80"
                >
                  <div class="p-4 font-semibold text-gray-700 border-b bg-gray-50">
                    Notifications
                  </div>
                  <div class="overflow-y-auto max-h-64">
                    <div
                      v-for="(notif, index) in notifications"
                      :key="notif.id"
                      class="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <p class="text-sm text-gray-800">{{ notif.message }}</p>
                      <p class="text-xs text-gray-500">
                        {{ formatTime(notif.notification_time) }}
                      </p>
                      <button
                        class="mt-2 text-sm text-blue-500 hover:underline"
                        @click="markAsRead(notif.id)"
                      >
                        Read
                      </button>
                    </div>
                    <div
                      v-if="notifications.length === 0"
                      class="p-4 text-center text-gray-500"
                    >
                      No new notifications.
                    </div>
                  </div>
                  <div class="p-2 text-center border-t bg-gray-50">
                    <button
                      class="text-sm text-blue-600 hover:underline"
                      @click="goToNotifications"
                    >
                      See All
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Profile Button -->
            <button
              ref="profileButton"
              class="w-10 h-10 overflow-hidden bg-gray-300 rounded-full focus:outline-none"
              @click="toggleDropdown"
            >
              <img
                :src="
                  user.profile_image
                    ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                    : fallbackImage
                "
                @error="onImageError"
                class="object-cover w-full h-full"
              />
            </button>
          </div>
        </div>

        <!-- Profile Dropdown Menu -->
        <transition name="fade">
          <div
            v-if="isDropdownOpen"
            ref="dropdownMenu"
            class="absolute right-0 z-50 w-56 mt-2 bg-white border rounded-lg shadow-lg"
          >
            <div class="p-4 text-center border-b bg-gray-50">
              <img
                :src="
                  user.profile_image
                    ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                    : fallbackImage
                "
                class="w-16 h-16 mx-auto border border-gray-300 rounded-full"
              />
              <h3 class="mt-2 text-lg font-semibold text-gray-900">
                {{ user?.name || "Guest" }}
              </h3>
              <p class="text-sm text-gray-600">{{ user?.email || "-" }}</p>
              <p class="text-xs text-gray-500">{{ user?.usertype || "-" }}</p>
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
import { onMounted, onUnmounted, ref } from "vue";
import axios from "axios";
import { useCookie } from "#app";
import emitter from "~/plugins/event-bus";

const unreadCount = ref(0);
const router = useRouter();
const token = useCookie("my_auth_token");

const user = ref({
  name: "",
  email: "",
  profile_image: "",
  usertype: "",
});
const fallbackImage = "/assets/images/photo_default.png";
const profileButton = ref<HTMLElement | null>(null);
const dropdownMenu = ref<HTMLElement | null>(null);
const notificationDropdown = ref<HTMLElement | null>(null);
const notificationButton = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);

// 🔔 Notifikasi
const isNotificationDropdownOpen = ref(false);
const notifications = ref<any[]>([]);

const fetchUser = async () => {
  try {
    const res = await axios.get(useApi("/api/user"), {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    user.value = res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      alert("Sesi Anda telah habis. Silakan login ulang.");
      // router.push("/login");
    }
  }
};

// const fetchNotifications = async () => {
//   try {
//     const res = await axios.get(useApi("/api/notifications"), {
//       headers: { Authorization: `Bearer ${token.value}` },
//     });
//     notifications.value = res.data.slice(0, 5);
//   } catch (err) {
//     console.error("Gagal mengambil notifikasi:", err);
//   }
// };

const fetchNotifications = async () => {
  try {
    const res = await axios.get(useApi("/api/notifications"), {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    notifications.value = res.data.slice(0, 5);
    unreadCount.value = res.data.filter((notif: any) => !notif.read_at).length;
  } catch (err) {
    console.error("Gagal mengambil notifikasi:", err);
  }
};

const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleString();
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleNotificationDropdown = async () => {
  isNotificationDropdownOpen.value = !isNotificationDropdownOpen.value;
  if (isNotificationDropdownOpen.value) {
    await fetchNotifications();
  }
};

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as Node;

  // Tutup dropdown profil jika klik di luar
  if (
    dropdownMenu.value &&
    !dropdownMenu.value.contains(target) &&
    !profileButton.value?.contains(target)
  ) {
    isDropdownOpen.value = false;
  }

  // Tutup dropdown notifikasi jika klik di luar
  if (
    notificationDropdown.value &&
    !notificationDropdown.value.contains(target) &&
    !notificationButton.value?.contains(target)
  ) {
    isNotificationDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
  fetchUser();
  fetchNotifications(); // ⬅️ Panggil saat mount
  emitter.on("profile-updated", fetchUser);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
  emitter.off("profile-updated", fetchUser);
});

const goToEditProfile = () => router.push("/profile_pages/edit_profile_page");
const goToChangePassword = () => router.push("/profile_pages/edit_password_page");
const goToNotifications = () => {
  isNotificationDropdownOpen.value = false;
  router.push("/notifications");
};

const logout = async () => {
  try {
    await axios.delete(useApi("/api/auth/signout"), {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    token.value = null;
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Gagal logout. Silakan coba lagi.");
  }
};

const showLogoutModal = () => {
  isLogoutModalOpen.value = true;
};

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = fallbackImage;
};

// const markAsRead = async (id: number) => {
//   try {
//     await axios.put(
//       useApi(`/api/notifications/${id}`),
//       {},
//       {
//         headers: { Authorization: `Bearer ${token.value}` },
//       }
//     );
//     notifications.value = notifications.value.filter((notif) => notif.id !== id);
//   } catch (err) {
//     console.error("Gagal menandai sebagai dibaca:", err);
//   }
// };

const markAsRead = async (id: number) => {
  try {
    await axios.put(
      useApi(`/api/notifications/${id}`),
      {},
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    notifications.value = notifications.value.filter((notif) => notif.id !== id);
    unreadCount.value = unreadCount.value > 0 ? unreadCount.value - 1 : 0;
  } catch (err) {
    console.error("Gagal menandai sebagai dibaca:", err);
  }
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
