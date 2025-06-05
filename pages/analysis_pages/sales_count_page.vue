<script setup>
// import { ref, onMounted } from "vue";
// import axios from "axios";

// const transactions = ref([]);
// const loading = ref(true);
// const error = ref(null);
// const searchQuery = ref("");
// const itemsPerPage = ref(10);
// const currentPage = ref(1);

// const fetchData = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/api/analysis/step1");
//     transactions.value = response.data.transactions;
//   } catch (err) {
//     error.value = "Gagal mengambil data, coba lagi nanti";
//   } finally {
//     loading.value = false;
//   }
// };

// // const filteredProducts = computed(() => {
// //   return transactions.value.filter((transaction) =>
// //     transaction.gross_amount.toString().includes(searchQuery.value)
// //   );
// // });

// const filteredProducts = computed(() => {
//   return transactions.value.filter((transaction) => {
//     const searchString = searchQuery.value.toLowerCase();
//     return (
//       transaction.id.toString().includes(searchString) ||
//       transaction.gross_amount.toString().includes(searchString) ||
//       transaction.transaction_date.toLowerCase().includes(searchString) ||
//       transaction.details.some(detail =>
//         detail.product.name.toLowerCase().includes(searchString) ||
//         detail.quantity.toString().includes(searchString)
//       )
//     );
//   });
// });

// const paginatedProducts = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage.value;
//   return filteredProducts.value.slice(start, start + itemsPerPage.value);
// });

// const totalPages = computed(() => {
//   return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
// });

// const generatePagination = computed(() => {
//   const total = totalPages.value;
//   const current = currentPage.value;
//   const pages = [];

//   if (total <= 7) {
//     return Array.from({ length: total }, (_, i) => i + 1);
//   }

//   if (current <= 4) {
//     pages.push(1, 2, 3, 4, 5, "...", total);
//   } else if (current >= total - 3) {
//     pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
//   } else {
//     pages.push(1, "...", current - 1, current, current + 1, "...", total);
//   }

//   return pages;
// });

// const changePage = (page) => {
//   if (page >= 1 && page <= totalPages.value && page !== "...") {
//     currentPage.value = page;
//   }
// };

// watch(itemsPerPage, () => {
//   currentPage.value = 1;
//   fetchProducts();
// });

// onMounted(fetchData);

import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

const transactions = ref([]);
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);

definePageMeta({
  middleware: ["auth"],
});

// const fetchData = async () => {
//   try {
//     const response = await axios.get(
//       useApi("/api/analysis/getTransactions")
//     );
//     transactions.value = response.data.transactions;
//   } catch (err) {
//     error.value = "Gagal mengambil data, coba lagi nanti";
//   } finally {
//     isLoading.value = false;
//   }
// };

const fetchData = async () => {
  try {
    const response = await axios.get(useApi("/api/analysis/getTransactions"));
    transactions.value = response.data.transactions.map((transaction) => {
      // Pastikan untuk mengonversi quantity ke integer
      transaction.details.forEach((detail) => {
        detail.quantity = parseInt(detail.quantity, 10); // Konversi ke integer
      });
      return transaction;
    });
  } catch (err) {
    error.value = "Gagal mengambil data, coba lagi nanti";
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

const filteredProducts = computed(() => {
  return transactions.value.filter((transaction) => {
    const searchString = searchQuery.value.toLowerCase();
    return (
      transaction.transaction_code.toString().includes(searchString) ||
      transaction.gross_amount.toString().includes(searchString) ||
      transaction.transaction_date.toLowerCase().includes(searchString) ||
      transaction.details.some(
        (detail) =>
          detail.product.name.toLowerCase().includes(searchString) ||
          detail.quantity.toString().includes(searchString)
      )
    );
  });
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProducts.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
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

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchData();
});

onMounted(fetchData);
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">
      Proses Analisis - Bobot Waktu & Penjualan Berbobot
    </h1>
    <p class="mb-4">
      Melakukan perhitungan penjualan mentah dahulu sebelum menghitung bobot waktu
    </p>

    <div class="mt-4">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        @click="$router.push('/analysis_pages/time_count_page')"
      >
        Time Count
      </button>
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"
      ></div>
    </div>
    <transition name="fade">
      <!-- <div v-if="isLoading" class="text-center">Memuat data...</div> -->
      <!-- <div v-else-if="error" class="text-red-500">{{ error }}</div> -->
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
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

          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search"
            class="rounded border p-2"
          />
        </div>

        <div class="overflow-x-auto whitespace-nowrap">
          <table class="w-full border-collapse border border-gray-300 bg-white">
            <thead>
              <tr class="bg-gray-200">
                <th class="border p-2">Transaction Code</th>
                <th class="border p-2">Gross Amount</th>
                <th class="border p-2">Date</th>
                <th class="border p-2">Product Quantities</th>
                <th class="border p-2">Raw Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in paginatedProducts"
                :key="transaction.id"
                class="border"
              >
                <td class="border p-2 text-center">{{ transaction.transaction_code }}</td>
                <td class="border p-2 text-center">
                  {{ formatPrice(transaction.gross_amount) }}
                </td>
                <td class="border p-2 text-center">
                  {{ new Date(transaction.transaction_date).toLocaleDateString() }}
                </td>
                <td class="border p-2">
                  <ul>
                    <li v-for="detail in transaction.details" :key="detail.id">
                      {{ detail.product.name }} ({{ detail.quantity }})
                    </li>
                  </ul>
                </td>
                <td class="border p-2 text-center">
                  {{
                    transaction.details.reduce((sum, detail) => sum + detail.quantity, 0)
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="mt-4 flex justify-between">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of
            {{ filteredProducts.length }} entries
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
    </transition>
  </div>
</template>

<style scoped>
th,
td {
  text-align: left;
  padding: 10px;
}
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
