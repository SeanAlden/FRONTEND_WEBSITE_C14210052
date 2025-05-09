<script setup>
import { ref, computed, onMounted, watch } from "vue";

const products = ref([]);
const searchQuery = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);

const fetchProducts = async () => {
  const res = await fetch(`http://127.0.0.1:8000/api/products`);
  const data = await res.json();
  products.value = data.data;
};

// const toggleProductStatus = async (id, status) => {
//   const confirmMessage =
//     status === "nonactive" ? "Hapus produk ini?" : "Aktifkan kembali produk ini?";
//   if (!confirm(confirmMessage)) return;

//   try {
//     const res = await fetch(`http://127.0.0.1:8000/api/updateCondition/products/${id}`, {
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

const toggleProductStatus = async (id, status) => {
  const confirmMessage =
    status === "nonactive" ? "Hapus produk ini?" : "Aktifkan kembali produk ini?";
  if (!confirm(confirmMessage)) return;

  try {
    const data = await apiFetch(`updateCondition/products/${id}`, "PUT", {
      condition: status,
    });

    if (data.success) {
      fetchProducts(); // misalnya fungsi untuk refresh data
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
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

const getTotalStock = (stocks) => {
  return stocks.reduce((total, stock) => total + stock.stock, 0);
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

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchProducts();
});

onMounted(fetchProducts);
</script>

<template>
  <div class="mx-auto p-6 container">
    <h1 class="mb-4 font-bold text-2xl">Daftar Produk Dinonaktifkan</h1>

    <!-- <div class="flex justify-between mb-4">
      <button class="bg-blue-500 px-4 py-2 rounded text-white">Tambah Produk</button>
    </div> -->

    <!-- <NuxtLink
      to="/product_pages/add_product"
      class="inline-block bg-green-500 mb-4 p-2 rounded text-white"
    >
      Tambah Produk
    </NuxtLink> -->

    <!-- <div
      class="bg-white shadow-md p-4 border rounded-lg w-full overflow-x-auto whitespace-nowrap"
    > -->
    <!-- <div class="bg-white shadow-md rounded-lg overflow-x-auto"> -->
    <div class="flex justify-between items-center mb-4">
      <div>
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

    <!-- <table class="border w-full border-collapse">
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
              class="w-20 h-20 object-cover"
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
              class="bg-red-500 px-3 py-1 rounded text-white"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table> -->
    <div class="overflow-x-auto whitespace-nowrap">
      <table
        class="bg-white shadow-md border border-gray-300 rounded-lg min-w-full text-gray-700"
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
            <td class="flex justify-center items-center p-2 border">
              <img
                :src="
                  product.photo
                    ? `http://localhost:8000/storage/${product.photo}`
                    : '/assets/images/avatar.png'
                "
                class="w-20 h-20 object-cover"
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
                  <strong>{{ stock.exp_date }}</strong> - Stok: {{ stock.stock }}
                </li>
              </ul>
            </td>
            <td class="p-2 border font-bold">
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
                  class="bg-yellow-400 ml-2 p-1 rounded text-white"
                >
                  Batal
                </button>
              </template> -->
              <template v-if="product.condition === 'nonactive'">
                <!-- <span class="font-bold text-red-500">Nonaktif</span> -->
                <button
                  @click="toggleProductStatus(product.id, 'active')"
                  class="bg-blue-500 ml-2 p-1 rounded text-white"
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
  <!-- </div> -->
</template>
