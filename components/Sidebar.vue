<template>
  <div
    :class="isSidebarOpen ? 'w-64' : 'w-16'"
    class="fixed top-0 bottom-0 left-0 z-50 flex flex-col overflow-y-auto text-white transition-all duration-300 bg-gray-800"
  >
    <div class="flex items-center justify-between p-4">
      <span v-if="isSidebarOpen" class="text-lg font-bold text-red-400">
        Asia Raya Cashier
      </span>
      <button @click="toggleSidebar" class="p-2 rounded hover:bg-gray-700">
        <img src="/assets/icons/menu-white.svg" alt="Toggle" class="w-6 h-6" />
      </button>
    </div>

    <!-- Scrollable Nav -->
    <div class="flex-1 overflow-y-auto">
      <nav class="flex flex-col mt-4 space-y-2">
        <NuxtLink to="/" class="flex items-center p-3 hover:bg-gray-700">
          <img src="/assets/icons/dashboard.png" class="w-6 h-6 mr-3" />
          <span v-if="isSidebarOpen">Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/sales_report_pages/sales_reports"
          class="flex items-center p-3 hover:bg-gray-700"
        >
          <img src="/assets/icons/report.png" class="w-6 h-6 mr-3" />
          <span v-if="isSidebarOpen">Sales Reports</span>
        </NuxtLink>

        <NuxtLink
          to="/category_pages/categories"
          class="flex items-center p-3 hover:bg-gray-700"
        >
          <img src="/assets/icons/category.png" class="w-6 h-6 mr-3" />
          <span v-if="isSidebarOpen">Categories</span>
        </NuxtLink>

        <div>
          <div
            @click="toggleProductsDropdown"
            class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700"
          >
            <div class="flex items-center">
              <img src="/assets/icons/product.png" class="w-6 h-6 mr-3" />
              <span v-if="isSidebarOpen">Products</span>
            </div>
            <img
              v-if="isSidebarOpen"
              :src="
                isProductsOpen
                  ? '/assets/icons/chevron_up.png'
                  : '/assets/icons/chevron_down.png'
              "
              class="w-4 h-4 transition-transform duration-300"
            />
          </div>

          <transition name="slide-fade">
            <div v-if="isProductsOpen" class="space-y-2 text-sm ml-9">
              <NuxtLink to="/product_pages/products" class="block p-2 hover:bg-gray-600"
                >Product List</NuxtLink
              >
              <NuxtLink
                to="/product_pages/deleted_products"
                class="block p-2 hover:bg-gray-600"
                >Deleted Products</NuxtLink
              >
              <NuxtLink
                to="/product_pages/deleted_products_history"
                class="block p-2 hover:bg-gray-600"
                >Deleted Products History</NuxtLink
              >
              <NuxtLink
                to="/product_pages/entry_products"
                class="block p-2 hover:bg-gray-600"
                >Entry Products</NuxtLink
              >
              <NuxtLink
                to="/product_pages/exit_products"
                class="block p-2 hover:bg-gray-600"
                >Exit Products</NuxtLink
              >
              <NuxtLink
                to="/product_pages/product_stocks_report"
                class="block p-2 hover:bg-gray-600"
                >Product Stocks Report</NuxtLink
              >
            </div>
          </transition>
        </div>

        <NuxtLink
          to="/transaction_pages/transactions"
          class="flex items-center p-3 hover:bg-gray-700"
        >
          <img src="/assets/icons/transactions.png" class="w-6 h-6 mr-3" />
          <span v-if="isSidebarOpen">Transactions</span>
        </NuxtLink>

        <NuxtLink
          to="/employee_pages/employees"
          class="flex items-center p-3 hover:bg-gray-700"
        >
          <img src="/assets/icons/employee.png" class="w-6 h-6 mr-3" />
          <span v-if="isSidebarOpen">Employees</span>
        </NuxtLink>

        <NuxtLink
          to="/analysis_pages/sales_count_page"
          class="flex items-center p-3 hover:bg-gray-700"
        >
          <img src="/assets/icons/analysis.png" class="w-6 h-6 mr-3" />
          <span v-if="isSidebarOpen">Analisis C4.5</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
// import { ref, onMounted, onUnmounted } from "vue";

// const isSidebarOpen = ref(true);
// const isProductsOpen = ref(false);

// const toggleSidebar = () => {
//   isSidebarOpen.value = !isSidebarOpen.value;
//   if (!isSidebarOpen.value) isProductsOpen.value = false;
// };

// const toggleProductsDropdown = () => {
//   if (!isSidebarOpen.value) {
//     isSidebarOpen.value = true;
//     isProductsOpen.value = true;
//   } else {
//     isProductsOpen.value = !isProductsOpen.value;
//   }
// };

// // Auto-collapse on small screen
// const handleResize = () => {
//   if (window.innerWidth < 768) {
//     isSidebarOpen.value = false;
//     isProductsOpen.value = false;
//   } else {
//     isSidebarOpen.value = true;
//   }
// };

// onMounted(() => {
//   handleResize();
//   window.addEventListener("resize", handleResize);
// });

// onUnmounted(() => {
//   window.removeEventListener("resize", handleResize);
// });

import { defineProps, defineEmits, ref, watch } from "vue";
const props = defineProps({ isSidebarOpen: Boolean });
const emit = defineEmits(["toggle-sidebar"]);
const isProductsOpen = ref(false);
const toggleSidebar = () => {
  emit("toggle-sidebar");
  // if (!props.isSidebarOpen) isProductsOpen.value = false;
};

// Tutup submenu produk saat sidebar ditutup
watch(
  () => props.isSidebarOpen,
  (newVal) => {
    if (!newVal) {
      isProductsOpen.value = false;
    }
  }
);

const toggleProductsDropdown = () => {
  if (!props.isSidebarOpen) {
    emit("toggle-sidebar");
    isProductsOpen.value = true;
  } else {
    isProductsOpen.value = !isProductsOpen.value;
  }
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #6b7280;
  border-radius: 3px;
}
</style>
