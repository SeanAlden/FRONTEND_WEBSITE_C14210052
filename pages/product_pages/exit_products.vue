<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";

definePageMeta({
  middleware: ["auth"],
});

// const BASE_URL = "http://localhost:8000";

// Data utama
const exitProducts = ref([]);
const products = ref([]);
const expDates = ref([]);
const showModal = ref(false);
const selectedProduct = ref(null);
const formData = ref({ product_id: "", exp_date: "", removed_stock: 0 });
const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const isLoading = ref(true); // State untuk loading

// Ambil data barang keluar
const fetchExits = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const response = await axios.get(useApi(`/api/exit-products`));
    // const data = await response.json();
    exitProducts.value = response.data.data;
  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    isLoading.value = false; // Set loading to false after fetching
  }
};

// Ambil daftar produk
const fetchProducts = async () => {
  const response = await axios.get(useApi(`/api/products`));
  // const data = await response.json();
  products.value = response.data.data;
};

// Ambil tanggal expired berdasarkan produk yang dipilih
const fetchExpDates = async () => {
  if (!formData.value.product_id) return;
  const response = await axios.get(
    useApi(`/api/products/product/${formData.value.product_id}/exp-dates`)
  );
  // const data = await response.json();
  expDates.value = response.data.data;
};

// Watcher: update tanggal expired saat produk berubah
watch(() => formData.value.product_id, fetchExpDates);

// Tampilkan modal tambah
const openModal = (exit = null) => {
  showModal.value = true;
  selectedProduct.value = exit;
  formData.value = exit
    ? { ...exit, product_id: exit.product.id }
    : { product_id: "", exp_date: "", removed_stock: 0 };
};

// Tutup modal
const closeModal = () => {
  showModal.value = false;
};

// Simpan data barang keluar
// const saveExit = async () => {
//   const url = selectedProduct.value
//     ? `${BASE_URL}/api/exit-products/${selectedProduct.value.id}`
//     : `${BASE_URL}/api/exit-products/store`;

//   const method = selectedProduct.value ? "PUT" : "POST";

//   await fetch(url, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData.value),
//   });

//   closeModal();
//   fetchExits();
// };

const saveExit = async () => {
  if (!formData.value.product_id || !formData.value.exp_date) {
    alert("Harap pilih produk dan tanggal expired!");
    return;
  }

  // Ambil data stok sebelum dikurangi
  // const stockResponse = await fetch(
  //   `${BASE_URL}/api/product/${formData.value.product_id}/stock/${formData.value.exp_date}`
  // );
  // const stockData = await stockResponse.json();

  // if (stockData.stock < 10) {
  //   alert("Stok tidak dapat dikurangi karena jumlahnya 10 atau kurang!");
  //   return;
  // }

  // Jika stok mencukupi, lanjutkan simpan data
  const url = selectedProduct.value
    ? useApi(`/api/exit-products/${selectedProduct.value.id}`)
    : useApi(`/api/exit-products/store`);

  const method = selectedProduct.value ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData.value),
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.message || "Terjadi kesalahan saat menyimpan data!");
    return;
  }

  alert("Barang keluar berhasil disimpan!");
  closeModal();
  fetchExits();
};

// Hapus data barang keluar
const deleteExit = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

  await fetch(useApi(`/api/exit-products/${id}`), { method: "DELETE" });
  fetchExits();
};

const filteredExit = computed(() => {
  //   return exitProducts.value.filter((exit) =>
  // exit.product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  //   );

  return exitProducts.value.filter((exit) => {
    const query = searchQuery.value.toLowerCase();
    return (
      exit.product.name.toLowerCase().includes(query) ||
      exit.product.code.toLowerCase().includes(query) ||
      exit.product.price.toString().includes(query) ||
      exit.exp_date.toString().includes(query) ||
      exit.removed_stock.toString().includes(query) ||
      exit.previous_stock.toString().includes(query) ||
      exit.current_stock.toString().includes(query) ||
      exit.created_at.toString().includes(query)
    );
  });
});

const paginatedExit = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredExit.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredExit.value.length / itemsPerPage.value);
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
  // date.setHours(date.getHours() + 7); // Menambah 7 jam
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchExits();
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Load data saat komponen dipasang
onMounted(() => {
  fetchExits();
  fetchProducts();
});
</script>

<template>
  <div class="container mx-auto p-6">
    <!-- Tombol Tambah -->
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Barang Keluar</h1>
      <button
        @click="openModal()"
        class="rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
      >
        + Tambah
      </button>
    </div>

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

    <!-- Tabel -->
    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table class="min-w-full rounded-lg border border-gray-300 bg-white shadow-md">
          <thead class="border-b bg-gray-100">
            <tr>
              <th class="border p-3 text-center">#</th>
              <th class="border p-3 text-center">Foto</th>
              <th class="border p-3 text-left">Nama</th>
              <th class="border p-3 text-center">Harga</th>
              <th class="border p-3 text-center">Tanggal Expired</th>
              <th class="border p-3 text-center">Sebelum</th>
              <th class="border p-3 text-center">Jumlah</th>
              <th class="border p-3 text-center">Sesudah</th>
              <!-- <th class="border p-3 text-center">Total Harga</th> -->
              <th class="border p-3 text-center">Waktu Pengurangan</th>
              <th class="border p-3 text-center">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="exit in paginatedExit"
              :key="exit.id"
              class="border-b hover:bg-gray-50"
            >
              <!-- <td class="border p-3">{{ index + 1 }}</td> -->
              <td class="border p-3">{{ exit.product.code }}</td>
              <!-- <td class="flex items-center justify-center border p-2"> -->
              <td
                class="flex min-h-[120px] min-w-[120px] items-center justify-center border p-2"
              >
                <img
                  :src="
                    exit.product.photo
                      ? useApi(`/storage/${exit.product.photo}`)
                      : '/assets/images/avatar.png'
                  "
                  class="object-fit h-20 w-20"
                />
              </td>
              <td class="border p-3">{{ exit.product.name }}</td>
              <td class="border p-3 text-center">
                <!-- Rp {{ exit.product.price.toLocaleString() }} -->
                {{ formatPrice(exit.product.price) }}
              </td>
              <td class="border p-3 text-center">
                {{ exit.exp_date }}
              </td>
              <td class="border p-3 text-center font-bold">{{ exit.previous_stock }}</td>
              <td class="border p-3 text-center font-bold text-red-500">
                - {{ exit.removed_stock }}
              </td>
              <td class="border p-3 text-center font-bold">{{ exit.current_stock }}</td>
              <!-- <td class="border p-3 text-center"> -->
              <!-- Rp {{ (exit.product.price * exit.current_stock).toLocaleString() }} -->
              <!-- {{ formatPrice(exit.product.price * exit.current_stock) }} -->
              <!-- </td> -->
              <td class="border p-3 text-center">
                <!-- {{ new Date(exit.created_at).toLocaleString() }} -->
                {{ formatDate(exit.created_at) }}
              </td>
              <td class="border p-3 text-center">
                <button
                  @click="openModal(exit)"
                  class="rounded bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </button>
                <button
                  @click="deleteExit(exit.id)"
                  class="ml-2 rounded bg-red-500 px-3 py-1 text-white"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredExit.length) }} of
            {{ filteredExit.length }} entries
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

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50"
    >
      <div class="w-1/3 rounded bg-white p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-bold">Pilih Barang Keluar</h2>

        <!-- Dropdown Produk -->
        <label class="mb-2 block text-gray-700">Pilih Produk:</label>
        <select v-model="formData.product_id" class="mb-4 w-full border p-2">
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.code }}) - Rp
            {{ product.price.toLocaleString() }}
          </option>
        </select>

        <!-- Dropdown Expired Date -->
        <label class="mb-2 block text-gray-700">Tanggal Expired:</label>
        <select v-model="formData.exp_date" class="mb-4 w-full border p-2">
          <option v-for="exp in expDates" :key="exp" :value="exp">{{ exp }}</option>
        </select>

        <!-- Input Jumlah -->
        <label class="mb-2 block text-gray-700">Jumlah Stok:</label>
        <input
          type="number"
          v-model="formData.removed_stock"
          class="mb-4 w-full border p-2"
          min="1"
        />

        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="mr-2 rounded bg-gray-400 px-4 py-2 text-white"
          >
            Batal
          </button>
          <button @click="saveExit" class="rounded bg-blue-600 px-4 py-2 text-white">
            Simpan
          </button>
        </div>
      </div>
    </div>
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
