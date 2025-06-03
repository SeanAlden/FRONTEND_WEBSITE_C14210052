<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">Prediksi Produk Terlaris - Algoritma C4.5</h1>
    <h2 class="mt-6 text-lg font-semibold">3. Perhitungan Akurasi</h2>

    <div class="my-4 flex justify-between">
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

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"
      ></div>
    </div>

    <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
      <table
        class="mt-0 min-w-full table-auto border-collapse border border-gray-300 bg-white"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">Kode Produk</th>
            <th class="border p-2">Nama</th>
            <th class="border p-2">Kondisi</th>
            <th class="border p-2">Foto</th>
            <th class="border p-2">Kategori</th>
            <th class="border p-2">Harga</th>
            <th class="border p-2">Stok</th>
            <th class="border p-2">Akurasi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td class="border p-2">{{ product.code }}</td>
            <td class="border p-2">{{ product.name || "Unknown" }}</td>
            <td class="border p-2">
              <span
                class="rounded-full px-3 py-1 text-base font-semibold md:text-lg"
                :class="{
                  'bg-green-100 text-green-600': product.condition === 'active',
                  'bg-red-100 text-red-600': product.condition === 'nonactive',
                }"
              >
                {{ product.condition || "Unknown" }}
              </span>
            </td>

            <!-- <td class="flex items-center justify-center border p-2"> -->
            <td
              class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2"
            >
              <img
                :src="product.photo ? useApi(`/storage/${product.photo}`) : fallbackImage"
                @error="onImageError"
                class="object-fit h-20 w-20"
              />
            </td>
            <td class="border p-2">{{ product.category_name || "Unknown" }}</td>
            <td class="border p-2">{{ formatPrice(product.price) }}</td>
            <td class="border p-2">{{ product.stocks }}</td>
            <!-- <td class="border p-2">{{ product.accuracy.toFixed(2) }}%</td> -->
            <td class="border p-2">
              <span
                class="rounded-full px-3 py-1 text-sm font-semibold"
                :class="{
                  'bg-blue-100 text-blue-700': product.accuracy >= 75,
                  'bg-yellow-100 text-yellow-700':
                    product.accuracy < 75 && product.accuracy >= 50,
                  'bg-orange-100 text-orange-700':
                    product.accuracy < 50 && product.accuracy >= 25,
                  'bg-red-100 text-red-700': product.accuracy < 25,
                }"
              >
                {{ product.accuracy.toFixed(2) }}%
              </span>
            </td>
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

definePageMeta({
  middleware: ["auth"],
});

export default {
  setup() {
    const products = ref({});
    const accuracy = ref({});
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);

    const fallbackImage = "/assets/images/avatar.png";

    const fetchData = async () => {
      try {
        const response = await axios.get(useApi("/api/analysis/results"));
        products.value = response.data.products;
        accuracy.value = response.data.accuracy;
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const sortedAccuracy = computed(() => {
      return Object.entries(accuracy.value)
        .sort((a, b) => b[1] - a[1])
        .map(([id, accValue]) => ({
          id,
          accuracy: accValue,
          ...products.value[id],
        }));
    });

    const filteredProducts = computed(() => {
      return sortedAccuracy.value.filter((product) => {
        const query = searchQuery.value.toLowerCase();
        return [
          product.name || "",
          product.code || "",
          product.category_name || "",
          product.price?.toString() || "",
          product.stocks?.toString() || "",
          product.accuracy.toFixed(2),
        ].some((field) => field.toLowerCase().includes(query));
      });
    });

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredProducts.value.slice(start, start + itemsPerPage.value);
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

    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
    };

    const onImageError = (event) => {
      event.target.src = fallbackImage;
    };

    watch(itemsPerPage, () => {
      currentPage.value = 1;
    });

    onMounted(fetchData);

    return {
      products,
      accuracy,
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
      onImageError,
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
