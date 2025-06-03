<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const products = ref([]);
const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const isLoading = ref(true); // State untuk loading

const fallbackImage = "/assets/images/avatar.png";

const fetchProducts = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const res = await axios.get(useApi(`/api/products`));
    // const data = await res.json();
    products.value = res.data.data;
  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    isLoading.value = false; // Set loading to false after fetching
    // setTimeout(() => {
    //   isLoading.value = false;
    // }, 200); // delay sedikit agar animasi terlihat smooth
  }
};

const toggleProductStatus = async (id, status) => {
  const confirmMessage =
    status === "nonactive" ? "Hapus produk ini?" : "Aktifkan kembali produk ini?";
  if (!confirm(confirmMessage)) return;

  try {
    const res = await fetch(useApi(`/api/products/updateCondition/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condition: status }),
    });

    const data = await res.json();

    if (data.success) {
      fetchProducts();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
  }
};

const isExpiringSoon = (expDate) => {
  if (!expDate) return false;
  const today = new Date();
  const expirationDate = new Date(expDate);
  const timeDiff = expirationDate - today;
  const daysRemaining = timeDiff / (1000 * 60 * 60 * 24);
  return daysRemaining <= 90 && daysRemaining > 0;
};

const isExpiredOrToday = (expDate) => {
  if (!expDate) return false;
  const today = new Date();
  const expirationDate = new Date(expDate);
  return expirationDate <= today;
};

// const getTotalStock = (stocks) => {
//   return stocks.reduce((total, stock) => total + stock.stock, 0);
// };

const getTotalStock = (stocks) => {
  return stocks.reduce((total, stock) => total + parseInt(stock.stock, 10), 0);
};

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const query = searchQuery.value.toLowerCase();
    return (
      product.condition === "active" &&
      (product.code.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query) ||
        product.price.toString().includes(query) ||
        product.stocks.some((stock) => stock.exp_date.includes(query)) ||
        getTotalStock(product.stocks).toString().includes(query) ||
        product.condition.toLowerCase().includes(query))
    );
  });
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

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

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchProducts();
});

onMounted(fetchProducts);
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Daftar Produk</h1>
      <NuxtLink
        to="/product_pages/add_product"
        class="inline-block rounded bg-green-500 p-2 text-white"
      >
        Tambah Produk
      </NuxtLink>
    </div>

    <div class="mb-4 flex items-center justify-between">
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
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap" key="content">
        <table
          class="min-w-full rounded-lg border border-gray-300 bg-white text-gray-700 shadow-md"
        >
          <thead>
            <tr class="bg-gray-200">
              <th class="border p-2">#</th>
              <th class="border p-2">Foto</th>
              <th class="border p-2">Nama</th>
              <th class="border p-2">Kategori</th>
              <th class="border p-2">Harga</th>
              <th class="border p-2">Tanggal Kadaluarsa & Stok</th>
              <th class="border p-2">Total Stok</th>
              <th class="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td class="border p-2">{{ product.code }}</td>
              <!-- <td class="flex items-center justify-center border p-2"> -->
              <td
                class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2"
              >
                <img
                  :src="
                      product.photo ? useApi(`/storage/${product.photo}`) : fallbackImage
                    "
                    @error="onImageError"
                  class="object-fit h-20 w-20"
                />
              </td>
              <!-- <td class="flex min-h-[120px] min-w-[120px] items-center justify-center border p-2">
                <img
                  :src="
                    product.photo
                      ? `http://localhost:8000/storage/${product.photo}`
                      : '/assets/images/avatar.png'
                  "
                  class="h-auto max-w-[100px] object-cover"
                />
              </td> -->
              <td class="border p-3">
                <NuxtLink
                  :to="`/product_pages/detail/${product.id}`"
                  class="text-blue-500 hover:underline"
                >
                  {{ product.name }}
                </NuxtLink>
              </td>
              <td class="border p-2">{{ product.category?.name || "Tidak ada" }}</td>
              <td class="border p-2">{{ formatPrice(product.price) }}</td>
              <td class="border p-2">
                <ul>
                  <!-- <li
                    v-for="stock in product.stocks"
                    :key="stock.id"
                    :class="{
                      'bg-red-500 text-white': isExpiredOrToday(stock.exp_date),
                      'bg-yellow-200': isExpiringSoon(stock.exp_date),
                      'p-2 rounded-md': true,
                      'text-red-500': stock.stock < 7,
                    }"
                  >
                    <strong>{{ stock.exp_date }}</strong> - Stok: {{ stock.stock }}
                  </li> -->
                  <li
                    v-for="stock in product.stocks"
                    :key="stock.id"
                    :class="{
                      'bg-red-500 text-white': isExpiredOrToday(stock.exp_date),
                      'bg-yellow-200': isExpiringSoon(stock.exp_date),
                      'p-2 rounded-md': true,
                      'text-red-500': parseInt(stock.stock, 10) < 7,
                    }"
                  >
                    <strong>{{ stock.exp_date }}</strong> - Stok:
                    {{ parseInt(stock.stock, 10) }}
                  </li>
                </ul>
              </td>
              <td
                class="border p-2 font-bold"
                :class="{ 'text-red-500': getTotalStock(product.stocks) < 7 }"
              >
                {{ getTotalStock(product.stocks) }}
              </td>
              <td class="border p-2">
                <template v-if="product.condition === 'active'">
                  <NuxtLink
                    :to="`/product_pages/edit/${product.id}`"
                    class="mr-2 text-blue-500"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    @click="toggleProductStatus(product.id, 'nonactive')"
                    class="text-red-500"
                  >
                    Hapus
                  </button>
                </template>
                <template v-else>
                  <span class="font-bold text-red-500">Nonaktif</span>
                  <button
                    @click="toggleProductStatus(product.id, 'active')"
                    class="ml-2 rounded bg-yellow-400 p-1 text-white"
                  >
                    Batal
                  </button>
                </template>
              </td>
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
