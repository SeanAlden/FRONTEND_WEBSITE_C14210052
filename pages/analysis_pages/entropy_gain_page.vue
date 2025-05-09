<template>
  <div>
    <h1 class="mb-4 font-bold text-xl">Prediksi Produk Terlaris - Algoritma C4.5</h1>

    <div class="mt-4">
      <button
        class="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded text-white"
        @click="$router.push('/analysis_pages/decision_tree_page')"
      >
        Decision Tree
      </button>
    </div>

    <h2 class="mt-6 font-semibold text-lg">1. Perhitungan Entropy & Gain</h2>

    <div class="flex justify-between my-4">
      <div class="overflow-x-auto whitespace-nowrap">
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" class="p-1 border rounded">
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
        class="p-2 border rounded"
      />
    </div>

    <div>
      <table
        class="bg-white mt-2 border border-gray-300 w-full border-collapse table-auto"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2 border">Atribut (Produk)</th>
            <th class="p-2 border">Kode Produk</th>
            <th class="p-2 border">Harga Produk</th>
            <th class="p-2 border">Entropy</th>
            <th class="p-2 border">Gain</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gain, id) in paginatedProducts" :key="id">
            <td class="p-2 border">{{ products[id]?.name || "Unknown" }}</td>
            <td class="p-2 border">{{ products[id]?.code || "Unknown" }}</td>
            <td class="p-2 border">{{ formatPrice(products[id]?.price || "Unknown") }}</td>
            <td class="p-2 border">{{ entropyValues[id].toFixed(4) }}</td>
            <td class="p-2 border">{{ gain.toFixed(4) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between mt-4">
        <div>
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of
          {{ filteredProducts.length }} entries
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="bg-gray-300 disabled:opacity-50 px-3 py-1 border rounded"
          >
            Prev
          </button>
          <button
            v-for="page in generatePagination"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 border rounded transition-all duration-200"
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
            class="bg-gray-300 disabled:opacity-50 px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { computed, ref, onMounted } from "vue";

export default {
  setup() {
    const entropyValues = ref({});
    const gainValues = ref({});
    const products = ref({});
    const searchQuery = ref("");
    const itemsPerPage = ref(10);
    const currentPage = ref(1);

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/analysis/results");
        entropyValues.value = response.data.entropyValues;
        gainValues.value = response.data.gainValues;
        products.value = response.data.products;
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      }
    };

    const filteredProducts = computed(() => {
      return Object.entries(gainValues.value).filter(([id, gain]) => {
        const name = products.value[id]?.name || "";
        const code = products.value[id]?.code || "";
        const price = products.value[id]?.price?.toString() || "";
        const entropy = entropyValues.value[id]?.toFixed(4) || "";
        const gainValue = gain?.toFixed(4) || "";
        const query = searchQuery.value.toLowerCase();
        return [name, code, price, entropy, gainValue].some((field) =>
          field.toLowerCase().includes(query)
        );
      });
    });

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return Object.fromEntries(
        filteredProducts.value.slice(start, start + itemsPerPage.value)
      );
    });

    const totalPages = computed(() =>
      Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );

    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
    };

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

    onMounted(fetchData);

    return {
      formatPrice,
      entropyValues,
      gainValues,
      products,
      searchQuery,
      itemsPerPage,
      currentPage,
      filteredProducts,
      paginatedProducts,
      totalPages,
      generatePagination,
      changePage,
    };
  },
};
</script>
