<template>
  <div
    :class="isSidebarOpen ? 'w-64' : 'w-16'"
    class="fixed flex flex-col bg-gray-800 min-h-screen overflow-y-auto text-white transition-all duration-300"
  >
    <div class="flex justify-between items-center p-4">
      <span v-if="isSidebarOpen" class="font-bold text-red-400 text-lg"
        >Asia Raya Cashier</span
      >
      <button @click="$emit('toggle-sidebar')" class="hover:bg-gray-700 p-2 rounded">
        <img src="/assets/icons/menu-white.svg" alt="Toggle" class="w-6 h-6" />
      </button>
    </div>

    <nav class="flex flex-col space-y-2 mt-4">
      <NuxtLink to="/" class="flex items-center hover:bg-gray-700 p-3">
        <img src="/assets/icons/dashboard.png" class="mr-3 w-6 h-6" />
        <span v-if="isSidebarOpen">Dashboard</span>
      </NuxtLink>
      <NuxtLink
        to="/sales_report_pages/sales_reports"
        class="flex items-center hover:bg-gray-700 p-3"
      >
        <img src="/assets/icons/report.png" class="mr-3 w-6 h-6" />
        <span v-if="isSidebarOpen">Sales Reports</span>
      </NuxtLink>
      <NuxtLink
        to="/category_pages/categories"
        class="flex items-center hover:bg-gray-700 p-3"
      >
        <img src="/assets/icons/category.png" class="mr-3 w-6 h-6" />
        <span v-if="isSidebarOpen">Categories</span>
      </NuxtLink>
      <div>
        <div
          @click="toggleProductsDropdown"
          class="flex justify-between items-center hover:bg-gray-700 p-3 cursor-pointer"
        >
          <div class="flex items-center">
            <img src="/assets/icons/product.png" class="mr-3 w-6 h-6" />
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
          <div v-if="isProductsOpen" class="space-y-2 ml-9 text-sm">
            <NuxtLink to="/product_pages/products" class="block hover:bg-gray-600 p-2"
              >Product List</NuxtLink
            >
            <NuxtLink
              to="/product_pages/deleted_products"
              class="block hover:bg-gray-600 p-2"
              >Deleted Products</NuxtLink
            >
						<NuxtLink
              to="/product_pages/deleted_products_history"
              class="block hover:bg-gray-600 p-2"
              >Deleted Products History</NuxtLink
            >
            <NuxtLink
              to="/product_pages/entry_products"
              class="block hover:bg-gray-600 p-2"
              >Entry Products</NuxtLink
            >
            <NuxtLink
              to="/product_pages/exit_products"
              class="block hover:bg-gray-600 p-2"
              >Exit Products</NuxtLink
            >
            <NuxtLink
              to="/product_pages/product_stocks_report"
              class="block hover:bg-gray-600 p-2"
              >Product Stocks Report</NuxtLink
            >
          </div>
        </transition>
      </div>
      <NuxtLink
        to="/transaction_pages/transactions"
        class="flex items-center hover:bg-gray-700 p-3"
      >
        <img src="/assets/icons/transactions.png" class="mr-3 w-6 h-6" />
        <span v-if="isSidebarOpen">Transactions</span>
      </NuxtLink>
      <NuxtLink
        to="/employee_pages/employees"
        class="flex items-center hover:bg-gray-700 p-3"
      >
        <img src="/assets/icons/employee.png" class="mr-3 w-6 h-6" />
        <span v-if="isSidebarOpen">Employees</span>
      </NuxtLink>
      <NuxtLink
        to="/analysis_pages/sales_count_page"
        class="flex items-center hover:bg-gray-700 p-3"
      >
        <img src="/assets/icons/analysis.png" class="mr-3 w-6 h-6" />
        <span v-if="isSidebarOpen">Analisis C4.5</span>
      </NuxtLink>
    </nav>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const isProductsOpen = ref(false);
const props = defineProps(["isSidebarOpen"]);
const emit = defineEmits(["toggle-sidebar"]);

// const toggleProductsDropdown = () => {
//   isProductsOpen.value = !isProductsOpen.value;
// };

// const toggleProductsDropdown = () => {
//   if (!props.isSidebarOpen) {
//     emit("toggle-sidebar");
//   } else {
//     isProductsOpen.value = !isProductsOpen.value;
//   }
// };

const toggleProductsDropdown = () => {
  if (!props.isSidebarOpen) {
    emit("toggle-sidebar");
    isProductsOpen.value = true; // langsung buka dropdown setelah sidebar dibuka
  } else {
    isProductsOpen.value = !isProductsOpen.value;
  }
};

watch(
  () => props.isSidebarOpen,
  (val) => {
    if (!val) isProductsOpen.value = false;
  }
);
</script>
<style scoped>
/* .slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
} */

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
</style>


