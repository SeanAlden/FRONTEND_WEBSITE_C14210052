<template>
  <div>
    <header class="fixed left-0 right-0 top-0 flex items-center justify-between bg-gray-400 px-6 py-4 shadow">
      <h1 class="text-xl font-semibold"></h1>
      <div class="align-items-xl-end relative flex">
        <div>
          <div class="flex items-center gap-6">
            <button class="h-10 w-10 overflow-hidden rounded-full">
              <img src="/assets/icons/Doorbell.png" alt="Notification" class="h-full w-full object-cover" />
            </button>
            <button
              ref="profileButton"
              class="h-10 w-10 overflow-hidden rounded-full bg-gray-300 focus:outline-none"
              @click="toggleDropdown"
            >
              <img src="/assets/images/photo_default.png" alt="Profile" class="h-full w-full object-cover" />
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
              <img src="/assets/images/photo_default.png" alt="Profile" class="mx-auto h-16 w-16 rounded-full border border-gray-300" />
              <h3 class="mt-2 text-lg font-semibold text-gray-900">John Doe</h3>
              <p class="text-sm text-gray-600">johndoe7@gmail.com</p>
              <p class="text-xs text-gray-500">Admin</p>
            </div>

            <div class="p-2">
              <button
                class="flex w-full items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                @click="goToEditProfile"
              >
                <img src="/assets/icons/person.png" alt="Edit Profile" class="mr-3 h-5 w-5" />
                Edit Profile
              </button>
              <button
                class="flex w-full items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                @click="goToChangePassword"
              >
                <img src="/assets/icons/password.png" alt="Change Password" class="mr-3 h-5 w-5" />
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
          <img src="/assets/icons/logout.png" alt="Logout Icon" class="mx-auto mb-3 h-10 w-10" />
          <h2 class="text-xl font-semibold text-gray-900">Log Out Account</h2>
          <p class="mt-2 text-gray-700">
            Are you sure you want to logout? <br />
            Once you logout you need to login again. Are you OK?
          </p>
          <div class="mt-4 flex justify-center space-x-4">
            <!-- <button
              class="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
              @click.prevent="logoutUser"
            > -->
						<button
              class="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
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
// import { ref, onMounted, onUnmounted } from "vue";
// import { useRouter } from "vue-router";
// import { useSanctum } from "laravel-sanctum-vue3"; // pastikan plugin ini sudah dipakai

// State
const isDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);
const dropdownMenu = ref<HTMLElement | null>(null);
const profileButton = ref<HTMLElement | null>(null);
const router = useRouter();

// Fungsi toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
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
});
onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});

// Navigasi
const goToEditProfile = () => router.push("/profile_pages/edit_profile_page");
const goToChangePassword = () => router.push("/profile_pages/edit_password_page");

// Logout
// const { logout } = useSanctum();
// function logoutUser() {
//   logout()
//     .then(() => {
//       router.push("/login");
//     })
//     .catch((error) => {
//       console.error("Logout failed:", error);
//     });
// }

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
