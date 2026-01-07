<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">Prediksi Produk Terlaris</h1>

    <div class="mt-4">
      <!-- <button
        class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        @click="$router.push('/analysis_pages/accuracy_page')"
      >
        Decision Tree
      </button> -->
			<button
        class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        @click="$router.push('/analysis_pages/accuracy_page')"
      >
        Hasil Prediksi
      </button>
    </div>

    <h2 class="mt-6 text-lg font-semibold">Perhitungan Entropy & Gain</h2>

    <div class="flex justify-between my-4">
      <div class="overflow-x-auto whitespace-nowrap">
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

    <!-- Loading Spinner -->
    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <transition name="fade">
      <div v-if="!isLoading">
        <table
          class="w-full mt-2 bg-white border border-collapse border-gray-300 table-auto"
        >
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2 border">Produk</th>
              <th class="p-2 border">Kode</th>
              <th class="p-2 border">Harga</th>
              <th class="p-2 border">Status</th>
              <th class="p-2 border">Entropy</th>
              <th class="p-2 border">Gain</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(gain, id) in paginatedProducts" :key="id">
              <td class="p-2 border">
                <div class="flex items-center space-x-2">
                  <img
                    v-if="products[id]?.photo"
                    :src="products[id].photo"
                    alt="Foto Produk"
                    class="object-cover w-10 h-10 rounded"
                  />
                  <span>{{ products[id]?.name || "Unknown" }}</span>
                </div>
              </td>
              <td class="p-2 border">{{ products[id]?.code || "Unknown" }}</td>
              <td class="p-2 border">{{ formatPrice(products[id]?.price) }}</td>
              <td class="p-2 border">{{ products[id]?.condition || "-" }}</td>
              <td class="p-2 border">
                {{ entropyValues[id] !== undefined ? entropyValues[id].toFixed(4) : "-" }}
              </td>
              <td class="p-2 border">{{ gain !== undefined ? gain.toFixed(4) : "-" }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
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
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted, watch } from "vue";

definePageMeta({
  middleware: ["auth"],
});

export default {
  setup() {
    const entropyValues = ref({});
    const gainValues = ref({});
    const products = ref({});
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(useApi("/api/api/analysis/results"));

        // key products by ID
        products.value = Object.fromEntries(
          (response.data.products || []).map((p) => [p.id, p])
        );

        entropyValues.value = response.data.entropyValues || {};
        gainValues.value = response.data.gainValues || {};
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Filter products by search query
    const filteredProducts = computed(() => {
      return Object.entries(gainValues.value).filter(([id, gain]) => {
        const name = products.value[id]?.name || "";
        const code = products.value[id]?.code || "";
        const price = products.value[id]?.price?.toString() || "";
        const condition = products.value[id]?.condition || "";
        const entropy =
          entropyValues.value[id] !== undefined ? entropyValues.value[id].toFixed(4) : "";
        const gainValue = gain !== undefined ? gain.toFixed(4) : "";
        const query = searchQuery.value.toLowerCase();

        return [name, code, price, condition, entropy, gainValue].some((field) =>
          field.toLowerCase().includes(query)
        );
      });
    });

    // Pagination
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return Object.fromEntries(
        filteredProducts.value.slice(start, start + itemsPerPage.value)
      );
    });

    const totalPages = computed(() =>
      Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );

    // const formatPrice = (price) => {
    //   if (typeof price !== "number") return "-";
    //   return new Intl.NumberFormat("id-ID", {
    //     style: "currency",
    //     currency: "IDR",
    //     minimumFractionDigits: 0,
    //   }).format(price);
    // };

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
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
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
    });

    onMounted(fetchData);

    return {
      entropyValues,
      gainValues,
      products,
      searchQuery,
      itemsPerPageOptions,
      itemsPerPage,
      currentPage,
      filteredProducts,
      paginatedProducts,
      totalPages,
      generatePagination,
      changePage,
      formatPrice,
      isLoading,
    };
  },
};
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
