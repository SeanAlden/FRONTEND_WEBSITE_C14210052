<script setup>
import { ref, onMounted, watch } from "vue";

const BASE_URL = "http://localhost:8000";

// Data utama
const exitProducts = ref([]);
const products = ref([]);
const expDates = ref([]);
const showModal = ref(false);
const selectedProduct = ref(null);
const formData = ref({ product_id: "", exp_date: "", removed_stock: 0 });
const searchQuery = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);

// Ambil data barang keluar
const fetchExits = async () => {
  const response = await fetch(`${BASE_URL}/api/exit-products`);
  const data = await response.json();
  exitProducts.value = data.data;
};

// Ambil daftar produk
const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/api/products`);
  const data = await response.json();
  products.value = data.data;
};

// Ambil tanggal expired berdasarkan produk yang dipilih
const fetchExpDates = async () => {
  if (!formData.value.product_id) return;
  const response = await fetch(
    `${BASE_URL}/api/product/${formData.value.product_id}/exp-dates`
  );
  const data = await response.json();
  expDates.value = data.data;
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
  const stockResponse = await fetch(
    `${BASE_URL}/api/product/${formData.value.product_id}/stock/${formData.value.exp_date}`
  );
  const stockData = await stockResponse.json();

  if (stockData.stock < 10) {
    alert("Stok tidak dapat dikurangi karena jumlahnya 10 atau kurang!");
    return;
  }

  // Jika stok mencukupi, lanjutkan simpan data
  const url = selectedProduct.value
    ? `${BASE_URL}/api/exit-products/${selectedProduct.value.id}`
    : `${BASE_URL}/api/exit-products/store`;

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

  // alert("Barang keluar berhasil disimpan!");
  closeModal();
  fetchExits();
};

// Hapus data barang keluar
const deleteExit = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

  await fetch(`${BASE_URL}/api/exit-products/${id}`, { method: "DELETE" });
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
  <div class="mx-auto p-6 container">
    <!-- Tombol Tambah -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold text-2xl">Barang Keluar</h1>
      <button
        @click="openModal()"
        class="bg-blue-600 hover:bg-blue-700 shadow px-4 py-2 rounded text-white"
      >
        + Tambah
      </button>
    </div>

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

    <!-- Tabel -->
    <div class="overflow-x-auto whitespace-nowrap">
      <table class="bg-white shadow-md border border-gray-300 rounded-lg min-w-full">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="p-3 border text-center">#</th>
            <th class="p-3 border text-center">Foto</th>
            <th class="p-3 border text-left">Nama</th>
            <th class="p-3 border text-center">Harga</th>
            <th class="p-3 border text-center">Tanggal Expired</th>
            <th class="p-3 border text-center">Sebelum</th>
            <th class="p-3 border text-center">Jumlah</th>
            <th class="p-3 border text-center">Sesudah</th>
            <!-- <th class="p-3 border text-center">Total Harga</th> -->
            <th class="p-3 border text-center">Waktu Pengurangan</th>
            <th class="p-3 border text-center">Opsi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(exit) in paginatedExit"
            :key="exit.id"
            class="hover:bg-gray-50 border-b"
          >
					<!-- <td class="p-3 border">{{ index + 1 }}</td> -->
            <td class="p-3 border">{{ exit.product.code }}</td>
            <td class="flex justify-center items-center p-2 border">
              <img
                :src="
                  exit.product.photo
                    ? `http://localhost:8000/storage/${exit.product.photo}`
                    : '/assets/images/avatar.png'
                "
                class="w-20 h-20 object-cover"
              />
            </td>
            <td class="p-3 border">{{ exit.product.name }}</td>
            <td class="p-3 border text-center">
              <!-- Rp {{ exit.product.price.toLocaleString() }} -->
              {{ formatPrice(exit.product.price) }}
            </td>
            <td class="p-3 border text-center">
              {{ exit.exp_date }}
            </td>
            <td class="p-3 border font-bold text-center">{{ exit.previous_stock }}</td>
            <td class="p-3 border font-bold text-red-500 text-center">- {{ exit.removed_stock }}</td>
            <td class="p-3 border font-bold text-center">{{ exit.current_stock }}</td>
            <!-- <td class="p-3 border text-center"> -->
              <!-- Rp {{ (exit.product.price * exit.current_stock).toLocaleString() }} -->
              <!-- {{ formatPrice(exit.product.price * exit.current_stock) }} -->
            <!-- </td> -->
            <td class="p-3 border text-center">
              <!-- {{ new Date(exit.created_at).toLocaleString() }} -->
              {{ formatDate(exit.created_at) }}
            </td>
            <td class="p-3 border text-center">
              <button
                @click="openModal(exit)"
                class="bg-yellow-500 px-3 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                @click="deleteExit(exit.id)"
                class="bg-red-500 ml-2 px-3 py-1 rounded text-white"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between mt-4">
        <div>
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, filteredExit.length) }} of
          {{ filteredExit.length }} entries
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

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50"
    >
      <div class="bg-white shadow-lg p-6 rounded w-1/3">
        <h2 class="mb-4 font-bold text-xl">Tambah Barang Keluar</h2>

        <!-- Dropdown Produk -->
        <label class="block mb-2 text-gray-700">Pilih Produk:</label>
        <select v-model="formData.product_id" class="mb-4 p-2 border w-full">
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.code }}) - Rp
            {{ product.price.toLocaleString() }}
          </option>
        </select>

        <!-- Dropdown Expired Date -->
        <label class="block mb-2 text-gray-700">Tanggal Expired:</label>
        <select v-model="formData.exp_date" class="mb-4 p-2 border w-full">
          <option v-for="exp in expDates" :key="exp" :value="exp">{{ exp }}</option>
        </select>

        <!-- Input Jumlah -->
        <label class="block mb-2 text-gray-700">Jumlah Stok:</label>
        <input
          type="number"
          v-model="formData.removed_stock"
          class="mb-4 p-2 border w-full"
          min="1"
        />

        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="bg-gray-400 mr-2 px-4 py-2 rounded text-white"
          >
            Batal
          </button>
          <button @click="saveExit" class="bg-blue-600 px-4 py-2 rounded text-white">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
