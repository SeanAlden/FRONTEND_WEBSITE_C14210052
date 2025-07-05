<template>
  <div class="flex min-h-screen text-gray-900 bg-gray-100">
    <!-- Header -->
    <Header />

    <!-- Sidebar -->
    <Sidebar
      :isSidebarOpen="isSidebarOpen"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    />

    <!-- Main Content -->
    <div
      :class="['flex-1 transition-all duration-300', isSidebarOpen ? 'ml-64' : 'ml-16']"
    >
      <div class="p-6 mt-16">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface User {
	name: String;
	email: String;
}

const isSidebarOpen = ref(true);
const isLogoutModalOpen = ref(false);

const confirmLogout = () => {
  isLogoutModalOpen.value = false;
  alert("Logout berhasil!");
};
</script>
