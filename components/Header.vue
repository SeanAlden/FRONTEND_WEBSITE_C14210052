<template>
  <div>
    <header
      class="fixed left-0 right-0 top-0 flex items-center justify-between bg-gray-400 px-6 py-4 shadow"
    >
      <h1 class="text-xl font-semibold"></h1>
      <div class="align-items-xl-end relative flex">
        <div>
          <div class="flex items-center gap-6">
            <!-- BELL ICON -->
            <button
              class="relative h-10 w-10 overflow-hidden rounded-full"
              ref="notificationButton"
              @click="toggleNotificationDropdown"
            >
              <img
                src="/assets/icons/Doorbell.png"
                alt="Notification"
                class="h-full w-full object-cover"
              />
            </button>

            <!-- NOTIFICATION DROPDOWN -->
            <transition name="fade">
              <div
                v-if="isNotificationDropdownOpen"
                ref="notificationDropdown"
                class="absolute right-16 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg"
              >
                <div class="border-b bg-gray-50 p-4">
                  <h3 class="text-lg font-semibold">Notifications</h3>
                </div>
                <div class="max-h-80 overflow-y-auto">
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    class="border-b px-4 py-3 hover:bg-gray-100"
                  >
                    <p class="text-sm text-gray-800">{{ notif.message }}</p>
                    <p class="text-xs text-gray-500">
                      {{ new Date(notif.notification_time).toLocaleString() }}
                    </p>
                    <button
                      class="mt-2 text-sm text-blue-600 hover:underline"
                      @click="markAsRead(notif.id)"
                    >
                      Mark as Read
                    </button>
                  </div>
                  <p v-if="notifications.length === 0" class="px-4 py-4 text-sm text-gray-500">No new notifications.</p>
                </div>
                <div class="p-3 text-center">
                  <button
                    class="text-blue-600 hover:underline"
                    @click="goToNotifications"
                  >
                    See All
                  </button>
                </div>
              </div>
            </transition>

            <!-- PROFILE ICON -->
            <button
              ref="profileButton"
              class="h-10 w-10 overflow-hidden rounded-full bg-gray-300 focus:outline-none"
              @click="toggleDropdown"
            >
              <img
                :src="user.profile_image ? useApi(`/public/storage/profile_images/${user.profile_image}`) : fallbackImage"
                @error="onImageError"
                class="h-full w-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- ... existing dropdown for profile (unchanged) ... -->

      </div>
    </header>

    <!-- Logout Modal (unchanged) -->
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import axios from "axios";
import { useCookie } from "#app";
import emitter from "~/plugins/event-bus";

// ========== STATE ==========
const isDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);
const isNotificationDropdownOpen = ref(false);

const dropdownMenu = ref<HTMLElement | null>(null);
const profileButton = ref<HTMLElement | null>(null);
const notificationDropdown = ref<HTMLElement | null>(null);
const notificationButton = ref<HTMLElement | null>(null);

const user = ref({
  name: "",
  email: "",
  profile_image: "",
  usertype: "",
});
const notifications = ref<any[]>([]);
const token = useCookie("my_auth_token");
const fallbackImage = "/assets/images/photo_default.png";
const router = useRouter();

// ========== FETCH USER ==========
const fetchUser = async () => {
  try {
    const res = await axios.get(useApi("/api/user"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    user.value = res.data;
  } catch (error) {
    const err = error as any;
    if (err.response?.status === 401) {
      alert("Sesi Anda telah habis. Silakan login ulang.");
      router.push("/login");
    }
  }
};

// ========== FETCH NOTIFICATIONS ==========
const fetchNotifications = async () => {
  try {
    const res = await axios.get(useApi("/api/notifications"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    notifications.value = res.data.slice(0, 5);
  } catch (error) {
    console.error("Gagal memuat notifikasi", error);
  }
};

// ========== LOGIC ==========
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleNotificationDropdown = () => {
  isNotificationDropdownOpen.value = !isNotificationDropdownOpen.value;
  if (isNotificationDropdownOpen.value) {
    fetchNotifications();
  }
};

const closeDropdown = (event: MouseEvent) => {
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

const markAsRead = async (id: number) => {
  try {
    await axios.put(useApi(`/api/notifications/${id}`), null, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    notifications.value = notifications.value.filter((n) => n.id !== id);
  } catch (error) {
    console.error("Gagal menandai notifikasi", error);
  }
};

// ========== NAVIGATION ==========
const goToNotifications = () => {
  isNotificationDropdownOpen.value = false;
  router.push("/notifications");
};
const goToEditProfile = () => router.push("/profile_pages/edit_profile_page");
const goToChangePassword = () => router.push("/profile_pages/edit_password_page");

// ========== LOGOUT ==========
async function logout() {
  try {
    await axios.delete(useApi("/api/auth/signout"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    token.value = null;
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Gagal logout. Silakan coba lagi.");
  }
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = fallbackImage;
};

const showLogoutModal = () => {
  isLogoutModalOpen.value = true;
};

// ========== LIFECYCLE ==========
onMounted(() => {
  document.addEventListener("click", closeDropdown);
  fetchUser();

  emitter.on("profile-updated", () => {
    fetchUser();
  });
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
  emitter.off("profile-updated");
});
</script>
