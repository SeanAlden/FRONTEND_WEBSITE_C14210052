<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-6 text-center text-2xl font-bold">Laporan Barang Masuk-Keluar</h1>

    <!-- FILTER SECTION -->
    <div class="mb-6 flex flex-wrap items-center justify-center gap-4">
      <div>
        <label class="font-semibold">Filter Tanggal:</label>
        <input
          type="date"
          v-model="selectedDate"
          class="rounded-md border px-4 py-2"
          @change="applyFilters"
        />
      </div>

      <div>
        <label class="font-semibold">Filter Bulan & Tahun:</label>
        <input
          type="month"
          v-model="selectedMonthYear"
          class="rounded-md border px-4 py-2"
          @change="applyFilters"
        />
      </div>

      <button @click="resetFilters" class="rounded-md bg-gray-500 px-4 py-2 text-white">
        Reset Filter
      </button>
    </div>

    <!-- SEARCH SECTION -->
    <div class="mb-4 flex items-center justify-between">
      <div>
        <label class="mr-2">Show</label>
        <!-- <select v-model="itemsPerPage" class="rounded border p-1">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select> -->
        <select v-model="itemsPerPage" id="itemsPerPage">
          <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span class="ml-2">entries</span>
      </div>
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search"
          class="rounded border p-2"
        />
      </div>
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"
      ></div>
    </div>

    <transition name="fade">
      <div
        v-if="!isLoading"
        class="overflow-x-auto whitespace-nowrap rounded-lg bg-white shadow-md"
      >
        <div
          v-for="(group, productName) in groupedStocks"
          :key="productName"
          class="mb-4"
        >
          <h2 class="text-lg font-bold">{{ productName }}</h2>
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-200 text-gray-700">
              <tr>
                <th class="border px-4 py-2">Kode</th>
                <th class="border px-4 py-2">Foto</th>
                <th class="border px-4 py-2">Harga</th>
                <th class="border px-4 py-2">Tanggal Expired</th>
                <th class="border px-4 py-2">Sebelum</th>
                <th class="border px-4 py-2">Jumlah</th>
                <th class="border px-4 py-2">Sesudah</th>
                <th class="border px-4 py-2">Waktu Masuk / Keluar</th>
                <th class="border px-4 py-2">Kondisi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in group" :key="index" class="hover:bg-gray-100">
                <td class="border px-4 py-2" v-if="index === 0">{{ item.code }}</td>
                <td class="border px-4 py-2" v-if="index !== 0"></td>
                <td class="border px-4 py-2">
                  <img
                    :src="item.photo"
                    alt="Foto Produk"
                    class="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td class="border px-4 py-2 text-center">
                  {{ formatPrice(item.price) }}
                </td>
                <td class="border px-4 py-2 text-center">{{ item.exp_date }}</td>
                <td class="border px-4 py-2 text-center font-bold">
                  {{ item.previous_stock }}
                </td>
                <!-- <td class="border px-4 py-2 text-center font-bold">{{ item.quantity }}</td> -->
                <td class="border px-4 py-2 text-center font-bold">
                  <span
                    :class="
                      item.condition === 'Masuk' ? 'text-green-600' : 'text-red-600'
                    "
                  >
                    {{ item.condition === "Masuk" ? "+" : "-" }}{{ item.quantity }}
                  </span>
                </td>

                <td class="border px-4 py-2 text-center font-bold">
                  {{ item.current_stock }}
                </td>
                <td class="border px-4 py-2 text-center">
                  {{ formatDate(item.timestamp) }}
                </td>
                <td class="border px-4 py-2 text-center">
                  <span
                    :class="
                      item.condition === 'Masuk'
                        ? 'text-green-600 font-bold'
                        : 'text-red-600 font-bold'
                    "
                  >
                    {{ item.condition }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredStocks.length) }} of
        {{ filteredStocks.length }} entries
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          v-for="page in generatePagination"
          :key="page"
          @click="changePage(page)"
          class="rounded border px-3 py-1 transition-all duration-200"
          :class="{
            'bg-blue-500 text-white': currentPage === page,
            'bg-white text-blue-500 hover:bg-blue-100':
              currentPage !== page && page !== '...',
          }"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const productStocks = ref([]);
const selectedDate = ref("");
const selectedMonthYear = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const isLoading = ref(true); // State untuk loading

// const fetchStockReport = async () => {
//   isLoading.value = true; // Set loading to true
//   try {
//     const response = await axios.get(useApi("/api/product-stocks-report"));
//     // const data = await response.json();
//     const data = response.data;
//     if (data.success) {
//       productStocks.value = data.data.map((item) => ({
//         id: item.id,
//         name: item.name,
//         code: item.code,
//         photo: item.photo
//           ? useApi(`/storage/${item.photo}`)
//           : '/assets/images/avatar.png',
//         price: item.price,
//         exp_date: item.exp_date,
//         previous_stock: item.previous_stock,
//         quantity: item.quantity,
//         current_stock: item.current_stock,
//         timestamp: item.timestamp,
//         condition: item.current_stock > item.previous_stock ? "Masuk" : "Keluar",
//       }));
//     }
//   } catch (error) {
//     console.error("Error fetching stock report:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

const fetchStockReport = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const response = await axios.get(useApi("/api/product-stocks-report"));
    const data = response.data;
    if (data.success) {
      productStocks.value = data.data.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        photo: item.photo
          ? useApi(`/storage/${item.photo}`)
          : "/assets/images/avatar.png",
        price: item.price,
        exp_date: item.exp_date,
        previous_stock: parseInt(item.previous_stock, 10), // Konversi ke integer
        quantity: parseInt(item.quantity, 10), // Konversi ke integer
        current_stock: parseInt(item.current_stock, 10), // Konversi ke integer
        timestamp: item.timestamp,
        condition:
          parseInt(item.current_stock, 10) > parseInt(item.previous_stock, 10)
            ? "Masuk"
            : "Keluar",
      }));
    }
  } catch (error) {
    console.error("Error fetching stock report:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 7);
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const filteredStocks = computed(() => {
  return productStocks.value.filter((item) => {
    const itemDate = new Date(item.timestamp);
    itemDate.setHours(itemDate.getHours() + 7);
    const itemFormattedDate = itemDate.toISOString().split("T")[0];
    const itemFormattedMonthYear = itemDate.toISOString().slice(0, 7);
    if (selectedDate.value && itemFormattedDate !== selectedDate.value) {
      return false;
    }
    if (selectedMonthYear.value && itemFormattedMonthYear !== selectedMonthYear.value) {
      return false;
    }
    return true;
  });
});

const applySearch = () => {
  currentPage.value = 1;
};

const filteredStocksBySearch = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return filteredStocks.value.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query) ||
      item.price.toString().includes(query) ||
      item.exp_date.toString().includes(query) ||
      item.previous_stock.toString().includes(query) ||
      item.quantity.toString().includes(query) ||
      item.current_stock.toString().includes(query) ||
      item.condition.toLowerCase().includes(query) ||
      item.timestamp.toLowerCase().includes(query)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredStocksBySearch.value.length / itemsPerPage.value);
});

const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredStocksBySearch.value.slice(start, start + itemsPerPage.value);
});

const groupedStocks = computed(() => {
  return paginatedStocks.value.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {});
});

const generatePagination = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== "...") {
    currentPage.value = page;
  }
};

const resetFilters = () => {
  selectedDate.value = "";
  selectedMonthYear.value = "";
  searchQuery.value = "";
  currentPage.value = 1;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

onMounted(fetchStockReport);
</script>

<style scoped>
.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
