<template>
  <div>
    <header
      class="fixed left-0 right-0 top-0 flex items-center justify-between bg-gray-400 px-6 py-4 shadow"
    >
      <h1 class="text-xl font-semibold"></h1>
      <div class="align-items-xl-end relative flex">
        <div class="relative">
          <div class="flex items-center gap-6">
            <!-- Notification Button -->
            <!-- <button
              ref="notificationButton"
              class="h-10 w-10 overflow-hidden rounded-full"
              @click="toggleNotificationDropdown"
            >
              <img
                src="/assets/icons/Doorbell.png"
                alt="Notification"
                class="h-full w-full object-cover"
              />
            </button> -->
            <div class="relative">
              <button
                ref="notificationButton"
                class="h-10 w-10 overflow-hidden rounded-full"
                @click="toggleNotificationDropdown"
              >
                <img
                  src="/assets/icons/Doorbell.png"
                  alt="Notification"
                  class="h-full w-full object-cover"
                />
              </button>

              <!-- Badge -->
              <span
                v-if="newNotificationCount > 0"
                class="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white"
              >
                {{ newNotificationCount > 9 ? "9+" : newNotificationCount }}
              </span>
            </div>

            <!-- Notification Dropdown -->
            <!-- <transition name="fade">
              <div
                v-if="isNotificationDropdownOpen"
                ref="notificationDropdown"
                class="absolute right-14 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg"
              >
                <div
                  class="border-b bg-gray-50 p-4 text-center font-semibold text-gray-700"
                >
                  Recent Notifications
                </div>
                <div class="max-h-80 overflow-y-auto">
                  <div
                    v-for="(notif, index) in notifications"
                    :key="notif.id"
                    class="border-b px-4 py-3 hover:bg-gray-50"
                  >
                    <p class="text-sm text-gray-800">{{ notif.message }}</p>
                    <p class="text-xs text-gray-500">
                      {{ formatDate(notif.notification_time) }}
                    </p>
                    <button
                      class="mt-2 text-sm text-blue-600 hover:underline"
                      @click="markAsRead(notif.id)"
                    >
                      Mark as Read
                    </button>
                  </div>
                  <div
                    v-if="notifications.length === 0"
                    class="p-4 text-center text-sm text-gray-500"
                  >
                    No new notifications.
                  </div>
                </div>
                <div class="border-t p-3 text-center">
                  <button
                    class="text-sm text-blue-600 hover:underline"
                    @click="goToNotifications"
                  >
                    See all
                  </button>
                </div>
              </div>
            </transition> -->

            <!-- Notification Dropdown -->
            <transition name="fade">
              <div
                v-if="isNotificationDropdownOpen"
                ref="notificationDropdown"
                class="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div
                  class="flex items-center justify-between bg-gray-50 p-4 text-lg font-semibold text-gray-900"
                >
                  <span>Notifications</span>
                </div>
                <div class="max-h-80 overflow-y-auto">
                  <div
                    v-for="(notif, index) in notifications"
                    :key="notif.id"
                    class="flex items-center border-b px-4 py-3 hover:bg-gray-100"
                  >
                    <img
                      src="/assets/icons/notification_icon.png"
                      alt="Notification"
                      class="mr-3 h-5 w-5"
                    />
                    <div class="flex-1">
                      <p class="text-sm text-gray-800">{{ notif.message }}</p>
                      <p class="text-xs text-gray-500">
                        {{ formatDate(notif.notification_time) }}
                      </p>
                    </div>
                    <button
                      class="mt-2 text-sm text-blue-600 hover:underline"
                      @click="markAsRead(notif.id)"
                    >
                      Mark as Read
                    </button>
                  </div>
                  <div
                    v-if="notifications.length === 0"
                    class="p-4 text-center text-sm text-gray-500"
                  >
                    No new notifications.
                  </div>
                </div>
                <div class="border-t p-3 text-center">
                  <button
                    class="text-sm text-blue-600 hover:underline"
                    @click="goToNotifications"
                  >
                    See all
                  </button>
                </div>
              </div>
            </transition>

            <!-- Profile Button -->
            <button
              ref="profileButton"
              class="h-10 w-10 overflow-hidden rounded-full bg-gray-300 focus:outline-none"
              @click="toggleDropdown"
            >
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

        <!-- Profile Dropdown -->
        <transition name="fade">
          <div
            v-if="isDropdownOpen"
            ref="dropdownMenu"
            class="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white shadow-lg"
          >
            <div class="border-b bg-gray-50 p-4 text-center">
              <img
                :src="
                  user.profile_image
                    ? useApi(`/public/storage/profile_images/${user.profile_image}`)
                    : fallbackImage
                "
                class="mx-auto h-16 w-16 rounded-full border border-gray-300"
              />

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
import { onMounted, ref, onUnmounted } from "vue";
import axios from "axios";
import { useCookie } from "#app";
import emitter from "~/plugins/event-bus";

const isDropdownOpen = ref(false);
const isNotificationDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);
const dropdownMenu = ref<HTMLElement | null>(null);
const profileButton = ref<HTMLElement | null>(null);
const notificationDropdown = ref<HTMLElement | null>(null);
const notificationButton = ref<HTMLElement | null>(null);
const router = useRouter();
const newNotificationCount = ref(0);

const user = ref({
  name: "",
  email: "",
  profile_image: "",
  usertype: "",
});
const token = useCookie("my_auth_token");
const fallbackImage = "/assets/images/photo_default.png";

// Notifications
const notifications = ref([]);

// const fetchNotifications = async () => {
//   try {
//     const res = await axios.get(useApi("/api/notifications"), {
//       headers: {
//         Authorization: `Bearer ${token.value}`,
//       },
//     });
//     notifications.value = res.data.slice(0, 5); // ambil maksimal 5 notifikasi terbaru
//   } catch (error) {
//     console.error("Failed to fetch notifications:", error);
//   }
// };

const fetchNotifications = async () => {
  try {
    const res = await axios.get(useApi("/api/notifications"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const allNotifications = res.data;
    notifications.value = allNotifications.slice(0, 5);
    newNotificationCount.value = allNotifications.filter((n: any) => !n.is_read).length;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
};

// Fungsi menandai notifikasi telah dibaca
const markAsRead = async (id: number) => {
  try {
    await axios.put(
      useApi(`/api/notifications/${id}`),
      {},
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    notifications.value = notifications.value.filter((n: any) => n.id !== id);
    newNotificationCount.value = Math.max(0, newNotificationCount.value - 1);
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleNotificationDropdown = () => {
  isNotificationDropdownOpen.value = !isNotificationDropdownOpen.value;
  if (isNotificationDropdownOpen.value) {
    fetchNotifications();
  }
};

const closeAllDropdowns = (event: MouseEvent) => {
  if (
    dropdownMenu.value &&
    !dropdownMenu.value.contains(event.target as Node) &&
    !profileButton.value?.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false;
  }

  if (
    notificationDropdown.value &&
    !notificationDropdown.value.contains(event.target as Node) &&
    !notificationButton.value?.contains(event.target as Node)
  ) {
    isNotificationDropdownOpen.value = false;
  }
};

const fetchUser = async () => {
  try {
    const res = await axios.get(useApi("/api/user"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    user.value = res.data;
  } catch (error) {
    if ((error as any).response?.status === 401) {
      alert("Sesi Anda telah habis. Silakan login ulang.");
      router.push("/login");
    }
  }
};

const logout = async () => {
  try {
    await axios.delete(useApi("/api/auth/signout"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    token.value = null;
    window.location.href = "/login";
  } catch (error) {
    alert("Gagal logout. Silakan coba lagi.");
  }
};

const goToEditProfile = () => {
  isDropdownOpen.value = false;
  router.push("/profile_pages/edit_profile_page");
};
const goToChangePassword = () => {
  isDropdownOpen.value = false;
  router.push("/profile_pages/edit_password_page");
};
const goToNotifications = () => {
  isNotificationDropdownOpen.value = false; // Tutup dropdown
  router.push("/notifications");
};
const onImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = fallbackImage;
};

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

onMounted(() => {
  document.addEventListener("click", closeAllDropdowns);
  fetchUser();
  emitter.on("profile-updated", fetchUser);
});

onUnmounted(() => {
  document.removeEventListener("click", closeAllDropdowns);
  emitter.off("profile-updated", fetchUser);
});

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

.notification-dropdown {
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.notification-header {
  background-color: #f8f9fa;
  font-weight: bold;
  border-bottom: 1px solid #dee2e6;
}
.notification-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e9ecef;
}
.notification-item:hover {
  background-color: #f1f3f5;
}
.notification-icon {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}
</style>
