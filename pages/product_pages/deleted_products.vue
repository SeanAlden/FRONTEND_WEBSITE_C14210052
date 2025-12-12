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

const fallbackImage = "/assets/images/avatar.png";

const fetchProducts = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const res = await axios.get(useApi(`/api/api/products`));
    // const data = await res.json();
    products.value = res.data.data;
  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    isLoading.value = false; // Set loading to false after fetching
  }
};

// const toggleProductStatus = async (id, status) => {
//   const confirmMessage =
//     status === "nonactive" ? "Hapus produk ini?" : "Aktifkan kembali produk ini?";
//   if (!confirm(confirmMessage)) return;

//   try {
//     const res = await fetch(`http://127.0.0.1:8000/api/products/updateCondition/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ condition: status }),
// 	  credentials: 'include' //
//     });

//     const data = await res.json();

//     if (data.success) {
//       fetchProducts();
//     } else {
//       alert(data.message);
//     }
//   } catch (error) {
//     alert("Terjadi kesalahan: " + error.message);
//   }
// };

// const toggleProductStatus = async (id, status) => {
//   const confirmMessage =
//     status === "nonactive" ? "Hapus produk ini?" : "Aktifkan kembali produk ini?";
//   if (!confirm(confirmMessage)) return;

//   try {
//     const data = await apiFetch(`updateCondition/products/${id}`, "PUT", {
//       condition: status,
//     });

//     if (data.success) {
//       fetchProducts(); // misalnya fungsi untuk refresh data
//     } else {
//       alert(data.message);
//     }
//   } catch (error) {
//     alert("Terjadi kesalahan: " + error.message);
//   }
// };

const toggleProductStatus = async (id, status) => {
  const confirmMessage =
    status === "nonactive" ? "Hapus produk ini?" : "Aktifkan kembali produk ini?";
  if (!confirm(confirmMessage)) return;

  try {
    const res = await axios.put(useApi(`/api/api/products/updateCondition/${id}`), {
      condition: status,
    });

    if (res.data?.success) {
      fetchProducts(); // Refresh data
    } else {
      alert(res.data?.message || "Gagal memperbarui status produk.");
    }
  } catch (error) {
    alert("Terjadi kesalahan: " + (error.response?.data?.message || error.message));
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const isExpiringSoon = (expDate) => {
  if (!expDate) return false;
  const today = new Date();
  const expirationDate = new Date(expDate);
  const timeDiff = expirationDate - today;
  const daysRemaining = timeDiff / (1000 * 60 * 60 * 24);
  return daysRemaining <= 90 && daysRemaining > 0;
};

// const getTotalStock = (stocks) => {
//   return stocks.reduce((total, stock) => total + stock.stock, 0);
// };

const getTotalStock = (stocks) => {
  return stocks.reduce((total, stock) => total + parseInt(stock.stock, 10), 0);
};

// const filteredProducts = computed(() => {
//   return products.value.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
//   );
// });

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const query = searchQuery.value.toLowerCase();

    return (
      product.condition === "nonactive" &&
      (product.code.toLowerCase().includes(query) || // Pencarian berdasarkan kode
        product.name.toLowerCase().includes(query) || // Pencarian berdasarkan nama
        product.category?.name?.toLowerCase().includes(query) || // Pencarian berdasarkan kategori
        product.price.toString().includes(query) || // Pencarian berdasarkan harga
        product.stocks.some((stock) => stock.exp_date.includes(query)) || // Pencarian berdasarkan tanggal kedaluwarsa
        getTotalStock(product.stocks).toString().includes(query) || // Pencarian berdasarkan total stok
        product.condition.toLowerCase().includes(query)) // Pencarian berdasarkan kondisi (aktif/nonaktif)
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
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
  <div class="container p-6 mx-auto">
    <h1 class="mb-4 text-2xl font-bold">Daftar Produk Dinonaktifkan</h1>

    <!-- <div class="flex justify-between mb-4">
      <button class="px-4 py-2 text-white bg-blue-500 rounded">Tambah Produk</button>
    </div> -->

    <!-- <NuxtLink
      to="/product_pages/add_product"
      class="inline-block p-2 mb-4 text-white bg-green-500 rounded"
    >
      Tambah Produk
    </NuxtLink> -->

    <!-- <div
      class="w-full p-4 overflow-x-auto bg-white border rounded-lg shadow-md whitespace-nowrap"
    > -->
    <!-- <div class="overflow-x-auto bg-white rounded-lg shadow-md"> -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <label class="mr-2">Show</label>
        <!-- <select v-model="itemsPerPage" class="p-1 border rounded">
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
        class="p-2 border rounded"
      />
    </div>

    <!-- <table class="w-full border border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">Kode</th>
          <th class="p-2 border">Foto</th>
          <th class="p-2 border">Nama</th>
          <th class="p-2 border">Kategori</th>
          <th class="p-2 border">Harga</th>
          <th class="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td class="p-2 border">{{ product.code }}</td>
          <td class="p-2 border">
            <img
              :src="
                product.photo
                  ? `http://localhost:8000/storage/${product.photo}`
                  : '/assets/images/avatar.png'
              "
              class="object-cover w-20 h-20"
            />
          </td>
          <td class="p-3 border">	
            <NuxtLink
              :to="`/product_pages/detail/${product.id}`"
              class="text-blue-500 hover:underline"
            >
              {{ product.name }}
            </NuxtLink>
          </td>
          <td class="p-2 border">{{ product.category?.name || "Tidak ada" }}</td>
          <td class="p-2 border">Rp {{ product.price }}</td>
          <td class="p-2 border">
            <button
              @click="changePage(1)"
              class="px-3 py-1 text-white bg-red-500 rounded"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table> -->

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table
          class="min-w-full text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md"
        >
          <!-- <table class="w-full text-gray-700"> -->
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2 border">#</th>
              <th class="p-2 border">Foto</th>
              <th class="p-2 border">Nama</th>
              <th class="p-2 border">Kategori</th>
              <th class="p-2 border">Harga</th>
              <th class="p-2 border">Tanggal Kadaluarsa & Stok</th>
              <th class="p-2 border">Total Stok</th>
              <th class="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              :class="{ 'bg-red-200': product.condition === 'nonactive' }"
            >
              <td class="p-2 border">{{ product.code }}</td>
              <!-- <td class="flex items-center justify-center p-2 border"> -->
              <!-- <td
                class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2"
              >
                <img
                  :src="
                    product.photo ? useApi(`/public/storage/${product.photo}`) : fallbackImage
                  "
                  @error="onImageError"
                  class="w-20 h-20 object-fit"
                />
              </td> -->

              <td class="p-2 border">
                <div class="flex min-h-[100px] min-w-[100px] items-center justify-center w-full h-full">
                  <img
                    :src="
                      product.photo
                        ? useApi(`/storage/${product.photo}`)
                        : fallbackImage
                    "
                    @error="onImageError"
                    class="object-cover w-20 h-20 rounded"
                  />
                </div>
              </td>

              <!-- <td class="p-2 border">
                <div class="flex min-h-[100px] min-w-[100px] items-center justify-center w-full h-full">
                  <img
                    :src="
                      product.photo
                        ? useApi(`/public/storage/${product.photo}`)
                        : fallbackImage
                    "
                    @error="onImageError"
                    class="object-cover w-20 h-20 rounded"
                  />
                </div>
              </td> -->

              <td class="p-3 border">
                <NuxtLink
                  :to="`/product_pages/detail/${product.id}`"
                  class="text-blue-500 hover:underline"
                >
                  {{ product.name }}
                </NuxtLink>
              </td>
              <td class="p-2 border">{{ product.category?.name || "Tidak ada" }}</td>
              <!-- <td class="p-2 border">Rp {{ product.price }}</td> -->
              <td class="p-2 border">{{ formatPrice(product.price) }}</td>
              <td class="p-2 border">
                <ul>
                  <li
                    v-for="stock in product.stocks"
                    :key="stock.id"
                    :class="{
                      'p-2 rounded-md': true,
                    }"
                  >
                    <strong>{{ stock.exp_date }}</strong> - Stok:
                    {{ parseInt(stock.stock, 10) }}
                  </li>
                </ul>
              </td>
              <td class="p-2 font-bold border">
                {{ getTotalStock(product.stocks) }}
              </td>
              <td class="p-2 border">
                <!-- <template v-if="product.condition === 'active'">
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
              </template> -->
                <!-- <template v-else>
                <span class="font-bold text-red-500">Nonaktif</span>
                <button
                  @click="toggleProductStatus(product.id, 'active')"
                  class="p-1 ml-2 text-white bg-yellow-400 rounded"
                >
                  Batal
                </button>
              </template> -->
                <template v-if="product.condition === 'nonactive'">
                  <!-- <span class="font-bold text-red-500">Nonaktif</span> -->
                  <button
                    @click="toggleProductStatus(product.id, 'active')"
                    class="p-1 ml-2 text-white bg-blue-500 rounded"
                  >
                    Aktifkan
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-between mt-4">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} from
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
  <!-- </div> -->
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
