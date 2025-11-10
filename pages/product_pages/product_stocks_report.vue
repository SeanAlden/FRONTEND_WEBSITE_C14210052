<template>
  <div class="container p-6 mx-auto">
    <h1 class="mb-6 text-2xl font-bold text-center">Laporan Barang Masuk-Keluar</h1>

    <div class="flex flex-wrap items-center justify-center gap-4 mb-6">
      <div>
        <label class="font-semibold">Filter Tanggal:</label>
        <input
          type="date"
          v-model="selectedDate"
          class="px-4 py-2 border rounded-md"
          @change="applyFilters"
        />
      </div>

      <div>
        <label class="font-semibold">Filter Bulan & Tahun:</label>
        <input
          type="month"
          v-model="selectedMonthYear"
          class="px-4 py-2 border rounded-md"
          @change="applyFilters"
        />
      </div>

      <button @click="resetFilters" class="px-4 py-2 text-white bg-gray-500 rounded-md">
        Reset Filter
      </button>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div>
        <label class="mr-2">Show</label>
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
          class="p-2 border rounded"
        />
      </div>
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <transition name="fade">
      <div
        v-if="!isLoading"
        class="overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap"
      >
        <div
          v-for="(group, productName) in groupedStocks"
          :key="productName"
          class="mb-4"
        >
          <h2 class="text-lg font-bold">{{ productName }}</h2>
          <table class="min-w-full border border-gray-300">
            <thead class="text-gray-700 bg-gray-200">
              <tr>
                <th class="px-4 py-2 border">Kode</th>
                <th class="px-4 py-2 border">Foto</th>
                <th class="px-4 py-2 border">Harga</th>
                <th class="px-4 py-2 border">Tanggal Expired</th>
                <th class="px-4 py-2 border">Sebelum</th>
                <th class="px-4 py-2 border">Jumlah</th>
                <th class="px-4 py-2 border">Sesudah</th>
                <th class="px-4 py-2 border">Waktu Masuk / Keluar</th>
                <th class="px-4 py-2 border">Kondisi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in group" :key="index" class="hover:bg-gray-100">
                <td class="px-4 py-2 border" v-if="index === 0">{{ item.code }}</td>
                <td class="px-4 py-2 border" v-if="index !== 0"></td>
                <!-- <td class="px-4 py-2 border">
                  <img
                    :src="item.photo ? item.photo : fallbackImage"
                    @error="onImageError"
                    alt="Foto Produk"
                    class="object-cover w-12 h-12 rounded"
                  />
                </td> -->
                <td class="flex items-center justify-center px-4 py-2 border">
                  <img
                    :src="item.photo ? item.photo : fallbackImage"
                    @error="onImageError"
                    alt="Foto Produk"
                    class="object-cover w-12 h-12 rounded"
                  />
                </td>
                <td class="px-4 py-2 text-center border">
                  {{ formatPrice(item.price) }}
                </td>
                <td class="px-4 py-2 text-center border">{{ item.exp_date }}</td>
                <td class="px-4 py-2 font-bold text-center border">
                  {{ item.previous_stock }}
                </td>
                <td class="px-4 py-2 font-bold text-center border">
                  <span
                    :class="
                      item.condition === 'Masuk' ? 'text-green-600' : 'text-red-600'
                    "
                  >
                    {{ item.condition === "Masuk" ? "+" : "-" }}{{ item.quantity }}
                  </span>
                </td>

                <td class="px-4 py-2 font-bold text-center border">
                  {{ item.current_stock }}
                </td>
                <td class="px-4 py-2 text-center border">
                  {{ formatDate(item.timestamp) }}
                </td>
                <td class="px-4 py-2 text-center border">
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
    <div class="flex justify-between mt-4">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredStocks.length) }} of
        {{ filteredStocks.length }} entries
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          v-for="page in generatePagination"
          :key="page"
          @click="changePage(page)"
          class="px-3 py-1 transition-all duration-200 border rounded"
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
          class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50"
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
const isLoading = ref(true);

const fallbackImage = "/assets/images/avatar.png";

const fetchStockReport = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(useApi("/api/api/product-stocks-report"));
    const data = response.data;
    if (data.success) {
      productStocks.value = data.data.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        // photo: item.photo
        //   ? useApi(`/public/storage/${item.photo}`)
        //   : "/assets/images/avatar.png",
        photo: item.photo
          ? useApi(`/storage/${item.photo}`)
          : "/assets/images/avatar.png",
        price: item.price,
        exp_date: item.exp_date,
        previous_stock: parseInt(item.previous_stock, 10),
        quantity: parseInt(item.quantity, 10),
        current_stock: parseInt(item.current_stock, 10),
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

const onImageError = (event) => {
  event.target.src = fallbackImage;
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
