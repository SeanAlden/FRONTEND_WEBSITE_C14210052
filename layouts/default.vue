<template>
  <!-- <div class="flex min-h-screen bg-gray-100 text-gray-900"> -->
	<div :class="['flex-1 transition-all duration-300', isSidebarOpen ? 'ml-64' : 'ml-16']" >
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
      <div class="mt-16 p-6">
        <slot />
        <!-- <LogoutModal
          :show="isLogoutModalOpen"
          @confirm="confirmLogout"
          @cancel="isLogoutModalOpen = false"
        /> -->
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
