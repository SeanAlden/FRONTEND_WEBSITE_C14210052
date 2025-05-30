<template>
  <div>
    <h1 class="text-2xl font-bold">
      Proses Analisis - Menghitung Bobot Waktu & Total Penjualan Berbobot
    </h1>

    <button
      @click="$router.push('/analysis_pages/weight_count_page')"
      class="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
    >
      Weight Count
    </button>

    <h2 class="mt-4 text-lg font-semibold">1. Perhitungan Bobot Waktu</h2>

    <!-- Filter and Pagination Controls -->
    <div class="flex justify-between my-4">
      <div>
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" id="itemsPerPage">
          <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span class="ml-2">entries</span>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search"
        class="p-2 border rounded"
      />
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <!-- Table -->
    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table class="w-full mt-2 bg-white border">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2 border">Product Code</th>
              <th class="p-2 border">Product Name</th>
              <th class="p-2 border">First Date Transaction</th>
              <th class="p-2 border">Last Date Transaction</th>
              <th class="p-2 border">Selisih Hari</th>
              <th class="p-2 border">Bobot Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="productId in paginatedProductIds" :key="productId">
              <td class="p-2 border">{{ productCodes[productId] }}</td>
              <td class="p-2 border">{{ productNames[productId] }}</td>
              <td class="p-2 border">
                {{ formatDate(firstTransactionDates[productId]) }}
              </td>
              <td class="p-2 border">
                {{ formatDate(lastTransactionDates[productId]) }}
              </td>
              <td class="p-2 border">
                {{ formatDayHour(productDateDifferences[productId]) }}
              </td>
              <td class="p-2 border">{{ productTimeWeights[productId] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>

    <!-- Pagination Controls -->
    <div class="flex justify-between mt-4">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredProductIds.length) }} of
        {{ filteredProductIds.length }} entries
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
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: ["auth"],
});

// Router
const router = useRouter();

// State
const weightedSales = ref({});
const productNames = ref({});
const productCodes = ref({});
const firstTransactionDates = ref({});
const lastTransactionDates = ref({});
const productDateDifferences = ref({});
const productTimeWeights = ref({});
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const isLoading = ref(true);

// Fetch data
onMounted(async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/analysis/countAttributes"
    );
    const data = response.data;

    weightedSales.value = data.weightedSales;
    firstTransactionDates.value = data.firstTransactionDates;
    lastTransactionDates.value = data.lastTransactionDates;
    productDateDifferences.value = data.productDateDifferences;
    productTimeWeights.value = data.productTimeWeights;

    data.transactions.forEach((transaction) => {
      transaction.details.forEach((detail) => {
        productNames.value[detail.product.id] = detail.product.name;
        productCodes.value[detail.product.id] = detail.product.code;
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
});

// Computed
const productIds = computed(() => Object.keys(productTimeWeights.value));

const filteredProductIds = computed(() => {
  return productIds.value.filter((productId) => {
    const name = productNames.value[productId] || "";
    const code = productCodes.value[productId] || "";
    const query = searchQuery.value.toLowerCase();
    return [name, code].some((field) => field.toLowerCase().includes(query));
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredProductIds.value.length / itemsPerPage.value)
);

const paginatedProductIds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProductIds.value.slice(start, start + itemsPerPage.value);
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

// Methods
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function formatDayHour(diffInDays) {
  const days = Math.floor(diffInDays);
  const hours = Math.round((diffInDays - days) * 24);
  return `${days} Hari, ${hours} Jam`;
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// Watchers
watch(itemsPerPage, () => {
  currentPage.value = 1;
});
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
