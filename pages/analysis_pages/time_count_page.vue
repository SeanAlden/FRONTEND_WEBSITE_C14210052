<template>
  <div>
    <h1 class="text-2xl font-bold">
      Proses Analisis - Menghitung Bobot Waktu & Total Penjualan Berbobot
    </h1>

    <button
      @click="$router.push('/analysis_pages/weight_count_page')"
      class="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
    >
      Weight Count
    </button>

    <h2 class="mt-4 text-lg font-semibold">1. Perhitungan Bobot Waktu</h2>

    <!-- Filter and Pagination Controls -->
    <!-- <div class="my-4 flex justify-between">		
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Show</label>
        <select v-model="itemsPerPage" class="rounded border p-1">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span class="ml-2">entries</span>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search"
        class="rounded border p-2"
      />
    </div> -->

    <!-- Filter and Pagination Controls -->
    <div class="my-4 flex justify-between">
      <div>
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" class="rounded border p-1">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
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

    <!-- Table -->
    <div class="overflow-x-auto whitespace-nowrap">
      <table class="mt-2 w-full border bg-white">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">Product Code</th>
            <th class="border p-2">Product Name</th>
            <th class="border p-2">First Date Transaction</th>
            <th class="border p-2">Last Date Transaction</th>
            <th class="border p-2">Selisih Hari</th>
            <th class="border p-2">Bobot Waktu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="productId in paginatedProductIds" :key="productId">
            <td class="border p-2">{{ productCodes[productId] }}</td>
            <td class="border p-2">{{ productNames[productId] }}</td>
            <td class="border p-2">{{ formatDate(firstTransactionDates[productId]) }}</td>
            <td class="border p-2">{{ formatDate(lastTransactionDates[productId]) }}</td>
            <td class="border p-2">
              {{ formatDayHour(productDateDifferences[productId]) }}
            </td>
            <td class="border p-2">{{ productTimeWeights[productId] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="mt-4 flex justify-between">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredProductIds.length) }} of
        {{ filteredProductIds.length }} entries
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

<script>
import axios from "axios";

export default {
  data() {
    return {
      weightedSales: {},
      productNames: {},
      productCodes: {},
      firstTransactionDates: {},
      lastTransactionDates: {},
      productDateDifferences: {},
      productTimeWeights: {},
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    productIds() {
      return Object.keys(this.productTimeWeights);
    },
    filteredProductIds() {
      return this.productIds.filter((productId) => {
        const name = this.productNames[productId] || "";
        const code = this.productCodes[productId] || "";
        const query = this.searchQuery.toLowerCase();
        return [name, code].some((field) => field.toLowerCase().includes(query));
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProductIds.length / this.itemsPerPage);
    },
    paginatedProductIds() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProductIds.slice(start, start + this.itemsPerPage);
    },
    generatePagination() {
      const total = this.totalPages;
      const current = this.currentPage;
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
    },
  },
  async created() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/analysis/countAttributes"
      );
      const data = response.data;
      this.weightedSales = data.weightedSales;
      this.firstTransactionDates = data.firstTransactionDates;
      this.lastTransactionDates = data.lastTransactionDates;
      this.productDateDifferences = data.productDateDifferences;
      this.productTimeWeights = data.productTimeWeights;

      data.transactions.forEach((transaction) => {
        transaction.details.forEach((detail) => {
          this.productNames[detail.product.id] = detail.product.name;
          this.productCodes[detail.product.id] = detail.product.code;
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    formatDayHour(diffInDays) {
      const days = Math.floor(diffInDays);
      const hours = Math.round((diffInDays - days) * 24);
      return `${days} Hari, ${hours} Jam`;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>
