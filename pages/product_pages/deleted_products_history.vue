<script setup>
import axios from "axios";
import { ref, computed, onMounted, watch } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const products = ref([]);
const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const isLoading = ref(true);

// const fetchProducts = async () => {
//   isLoading.value = true; // Set loading to true
//   try {
//     const res = await axios.get(useApi(`/api/nonactive-history`));
//     // const data = await res.json();
//     products.value = res.data.data;
//   } catch (error) {
//     alert("Terjadi kesalahan: " + error.message);
//   } finally {
//     // finally {
//     //   isLoading.value = false; // Set loading to false after fetching
//     // }
//     setTimeout(() => {
//       isLoading.value = false;
//     }, 200); // delay sedikit agar animasi terlihat smooth
//   }
// };

const fetchProducts = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const res = await axios.get(useApi(`/api/nonactive-history`));
    products.value = res.data.data.map((item) => {
      // Pastikan untuk mengonversi product_stock ke integer
      item.details.forEach(detail => {
        detail.product_stock = parseInt(detail.product_stock, 10); // Konversi ke integer
      });
      return item;
    });
  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 200); // delay sedikit agar animasi terlihat smooth
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
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

const getTotalStock = (item) => {
  if (!item.details || !Array.isArray(item.details)) return 0;
  return item.details.reduce((sum, detail) => sum + detail.product_stock, 0);
};

const filteredProducts = computed(() => {
  return products.value.filter((item) => {
    const query = searchQuery.value.toLowerCase();
    const product = item.product;

    return (
      item.condition === "nonactive" &&
      (product.code?.toLowerCase().includes(query) ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query) ||
        product.price?.toString().includes(query))
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
  fetchProducts();
});

onMounted(fetchProducts);
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">Riwayat Produk Dinonaktifkan</h1>

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

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"
      ></div>
    </div>

    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table
          class="min-w-full rounded-lg border border-gray-300 bg-white text-gray-700 shadow-md"
        >
          <thead>
            <tr class="bg-gray-200">
              <!-- <th class="border p-2">#</th> -->
              <th class="border p-2">Kode</th>
              <th class="border p-2">Foto</th>
              <th class="border p-2">Nama</th>
              <th class="border p-2">Kategori</th>
              <th class="border p-2">Harga</th>
              <th class="border p-2">Tanggal Kadaluarsa & Stok</th>
              <th class="border p-2">Total Stok</th>
              <th class="border p-2">Waktu Nonaktif</th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr
            v-for="(item, index) in paginatedProducts"
            :key="item.id"
            :class="{ 'bg-red-100': item.condition === 'nonactive' }"
          > -->
            <tr
              v-for="item in paginatedProducts"
              :key="item.id"
              :class="{ 'bg-red-100': item.condition === 'nonactive' }"
            >
              <!-- <td class="border p-2">{{ index + 1 }}</td> -->
              <td class="border p-2">{{ item.product.code }}</td>
              <!-- <td class="flex items-center justify-center border p-2"> -->
              <td
                class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2"
              >
                <img
                  :src="
                    item.product.photo
                      ? useApi(`/storage/${item.product.photo}`)
                      : '/assets/images/avatar.png'
                  "
                  class="object-fit h-20 w-20"
                />
              </td>
              <td class="border p-2">
                <NuxtLink
                  :to="`/product_pages/detail/${item.product.id}`"
                  class="text-blue-500 hover:underline"
                >
                  {{ item.product.name }}
                </NuxtLink>
              </td>
              <td class="border p-2">{{ item.product.category.name || "Tidak ada" }}</td>
              <td class="border p-2">{{ formatPrice(item.product.price) }}</td>
              <!-- <td class="border p-2">
						<strong>{{ item.details.product_exp_date }}</strong> - Stok: {{ item.details.product_stock }}
						</td> -->
              <td class="border p-2">
                <div
                  v-for="(detail, i) in item.details"
                  :key="i"
                  :class="{
                    'p-2 rounded-md': true,
                  }"
                >
                  <strong>{{ detail.product_exp_date }}</strong> - Stok:
                  {{ detail.product_stock }}
                </div>
              </td>
              <td class="border p-2">{{ getTotalStock(item) }}</td>
              <td class="border p-2">{{ formatDate(item.changed_at) }}</td>
            </tr>
          </tbody>
        </table>

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
              :class="[
                'px-3 py-1 border rounded',
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200',
              ]"
              :disabled="page === '...'"
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
