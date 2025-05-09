<template>
  <div>
    <h1 class="text-2xl font-bold">
      Proses Analisis - Menghitung Bobot Waktu & Total Penjualan Berbobot
    </h1>
    <button
      @click="$router.push('/analysis_pages/entropy_gain_page')"
      class="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
    >
      Entropy & Gain
    </button>
    <h2 class="mt-6 text-lg font-semibold">2. Perhitungan Total Penjualan Berbobot</h2>

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

    <div class="overflow-x-auto whitespace-nowrap">
      <table class="mt-2 w-full border bg-white">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">Product Name</th>
            <th class="border p-2">Product Code</th>
            <th class="border p-2">Product Price</th>
            <th class="border p-2">Raw Sales</th>
            <th class="border p-2">Weighted Sales</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sales, productId) in paginatedProducts" :key="productId">
            <td class="border p-2">{{ productNames[productId] }}</td>
            <td class="border p-2">{{ productCodes[productId] }}</td>
            <td class="border p-2">{{ formatPrice(productPrices[productId]) }}</td>
            <td class="border p-2">{{ sales.raw }}</td>
            <td class="border p-2">{{ sales.weighted.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

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
  </div>
</template>

<script>
import axios from "axios";
import { computed, ref, onMounted } from "vue";

export default {
  setup() {
    const weightedSales = ref({});
    const productNames = ref({});
    const productPrices = ref({});
    const productCodes = ref({});
    const searchQuery = ref("");
    const itemsPerPage = ref(10);
    const currentPage = ref(1);

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/analysis/countAttributes");
        const data = response.data;
        weightedSales.value = data.weightedSales;
        data.transactions.forEach((transaction) => {
          transaction.details.forEach((detail) => {
            productNames.value[detail.product.id] = detail.product.name;
            productPrices.value[detail.product.id] = detail.product.price;
            productCodes.value[detail.product.id] = detail.product.code;
          });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
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
      return Object.entries(weightedSales.value).filter(([productId, sales]) => {
        const name = productNames.value[productId] || "";
        const code = productCodes.value[productId] || "";
        const price = productPrices.value[productId]?.toString() || "";
        const raw = sales.raw.toString();
        const weighted = sales.weighted.toFixed(2);
        const query = searchQuery.value.toLowerCase();
        return [name, code, price, raw, weighted].some((field) =>
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
      weightedSales,
      productNames,
      productPrices,
      productCodes,
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
