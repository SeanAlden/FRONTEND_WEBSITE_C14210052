<script setup>
// import axios from "axios";
// import { ref, reactive, computed, onMounted, watch } from "vue";

// definePageMeta({
//   middleware: ["auth"],
// });

// const entryProducts = ref([]);
// const products = ref([]);
// const expDates = ref([]);
// const showModal = ref(false);
// const selectedProduct = ref(null);
// const formData = ref({ product_id: "", exp_date: "", added_stock: 0 });
// const searchQuery = ref("");
// const itemsPerPageOptions = [5, 10, 20, 50];
// const itemsPerPage = ref(5);
// const currentPage = ref(1);
// const isLoading = ref(true);

// const fallbackImage = "/assets/images/avatar.png";

// const showAddExpDateModal = ref(false);
// const newExpDateData = reactive({
//   product_id: null,
//   new_exp_date: "",
// });
// const addExpDateError = ref("");
// const addExpDateSuccess = ref("");

// const fetchEntries = async () => {
//   const response = await axios.get(useApi(`/api/entry-products`));
//   entryProducts.value = response.data.data;
// };

// const fetchProducts = async () => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get(useApi(`/api/products`));
//     products.value = response.data.data;
//   } catch (error) {
//     alert("Terjadi kesalahan saat mengambil data produk: " + error.message);
//   } finally {
//     setTimeout(() => {
//       isLoading.value = false;
//     }, 200);
//   }
// };

// const fetchExpDates = async () => {
//   if (!formData.value.product_id) {
//     expDates.value = [];
//     return;
//   }
//   const response = await axios.get(
//     useApi(`/api/products/product/${formData.value.product_id}/exp-dates`)
//   );
//   const fetchedExpDates = response.data.data;

//   const expDatesWithStock = [];
//   for (const expDate of fetchedExpDates) {
//     const stockResponse = await axios.get(
//       useApi(`/api/products/product/${formData.value.product_id}/stock/${expDate}`)
//     );
//     expDatesWithStock.push({
//       date: expDate,
//       stock: stockResponse.data.stock,
//     });
//   }
//   expDates.value = expDatesWithStock;
// };

// watch(() => formData.value.product_id, fetchExpDates);

// const openModal = async (entry = null) => {
//   showModal.value = true;
//   selectedProduct.value = entry;
//   formData.value = entry
//     ? { ...entry, product_id: entry.product.id }
//     : { product_id: "", exp_date: "", added_stock: 1 };
//   if (entry) {
//     await fetchExpDates();
//   }
// };

// const closeModal = () => {
//   showModal.value = false;
// };

// const openAddExpDateModal = () => {
//   addExpDateError.value = "";
//   addExpDateSuccess.value = "";
//   newExpDateData.product_id = null;
//   newExpDateData.new_exp_date = "";
//   showAddExpDateModal.value = true;
// };

// const closeAddExpDateModal = () => {
//   showAddExpDateModal.value = false;
// };

// const saveNewExpDate = async () => {
//   addExpDateError.value = "";
//   addExpDateSuccess.value = "";

//   if (!newExpDateData.product_id || !newExpDateData.new_exp_date) {
//     addExpDateError.value = "Produk dan tanggal expired harus diisi.";
//     return;
//   }

//   try {
//     const response = await axios.post(
//       useApi(`/api/products/${newExpDateData.product_id}/add-exp-date`),
//       {
//         exp_date: newExpDateData.new_exp_date,
//       }
//     );

//     if (response.data.success) {
//       addExpDateSuccess.value = response.data.message;
//       setTimeout(() => {
//         closeAddExpDateModal();
//       }, 1500);
//     }
//   } catch (error) {
//     if (error.response && error.response.data && error.response.data.message) {
//       addExpDateError.value = error.response.data.message;
//     } else {
//       addExpDateError.value = "Gagal menambahkan tanggal expired.";
//     }
//   }
// };

// const saveEntry = async () => {
//   const url = selectedProduct.value
//     ? useApi(`/api/entry-products/${selectedProduct.value.id}`)
//     : useApi(`/api/entry-products/store`);

//   const method = selectedProduct.value ? "PUT" : "POST";

//   await fetch(url, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData.value),
//   });

//   closeModal();
//   fetchEntries();
//   fetchProducts();
// };

// const deleteEntry = async (id) => {
//   if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
//   await fetch(useApi(`/api/entry-products/${id}`), { method: "DELETE" });
//   fetchEntries();
//   fetchProducts();
// };

// const filteredEntry = computed(() => {
//   return entryProducts.value.filter((entry) => {
//     const query = searchQuery.value.toLowerCase();
//     return (
//       entry.product.name.toLowerCase().includes(query) ||
//       entry.product.code.toLowerCase().includes(query) ||
//       entry.product.price.toString().includes(query) ||
//       entry.exp_date.toString().includes(query) ||
//       entry.added_stock.toString().includes(query) ||
//       entry.previous_stock.toString().includes(query) ||
//       entry.current_stock.toString().includes(query) ||
//       entry.created_at.toString().includes(query)
//     );
//   });
// });

// const paginatedEntry = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage.value;
//   return filteredEntry.value.slice(start, start + itemsPerPage.value);
// });

// const totalPages = computed(() => {
//   return Math.ceil(filteredEntry.value.length / itemsPerPage.value);
// });

// const generatePagination = computed(() => {
//   const total = totalPages.value;
//   const current = currentPage.value;
//   const pages = [];

//   if (total <= 7) {
//     return Array.from({ length: total }, (_, i) => i + 1);
//   }

//   if (current <= 4) {
//     pages.push(1, 2, 3, 4, 5, "...", total);
//   } else if (current >= total - 3) {
//     pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
//   } else {
//     pages.push(1, "...", current - 1, current, current + 1, "...", total);
//   }

//   return pages;
// });

// const changePage = (page) => {
//   if (page >= 1 && page <= totalPages.value && page !== "...") {
//     currentPage.value = page;
//   }
// };

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
// };

// const formatPrice = (price) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(price);
// };

// const onImageError = (event) => {
//   event.target.src = fallbackImage;
// };

// watch(itemsPerPage, () => {
//   currentPage.value = 1;
//   fetchEntries();
// });

// onMounted(() => {
//   fetchEntries();
//   fetchProducts();
// });

import axios from "axios";
import { ref, reactive, computed, onMounted, watch } from "vue";

definePageMeta({
  middleware: ["auth"],
});

// Data utama
const entryProducts = ref([]);
const products = ref([]);
const expDates = ref([]);
const showModal = ref(false);
const selectedProduct = ref(null);

// State untuk form di dalam modal
const formData = ref({
  product_id: "",
  exp_date: "",
  new_exp_date: "", // Untuk input tanggal baru
  added_stock: 1,
});

// State untuk mengontrol tampilan input tanggal (dropdown atau input baru)
const isCreatingNewExpDate = ref(false);

const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const isLoading = ref(true);
const fallbackImage = "/assets/images/avatar.png";

// Ambil data riwayat barang masuk
const fetchEntries = async () => {
  const response = await axios.get(useApi(`/api/entry-products`));
  entryProducts.value = response.data.data;
};

// Ambil daftar semua produk
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(useApi(`/api/products`));
    products.value = response.data.data;
  } catch (error) {
    alert("Terjadi kesalahan saat mengambil data produk: " + error.message);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 200);
  }
};

// Ambil daftar tanggal kedaluwarsa untuk produk yang dipilih
const fetchExpDates = async () => {
  if (!formData.value.product_id) {
    expDates.value = [];
    return;
  }
  const response = await axios.get(
    useApi(`/api/products/product/${formData.value.product_id}/exp-dates`)
  );
  const fetchedExpDates = response.data.data;

  const expDatesWithStock = [];
  for (const expDate of fetchedExpDates) {
    const stockResponse = await axios.get(
      useApi(`/api/products/product/${formData.value.product_id}/stock/${expDate}`)
    );
    expDatesWithStock.push({
      date: expDate,
      stock: stockResponse.data.stock,
    });
  }
  expDates.value = expDatesWithStock;

  // Tambahkan opsi spesial untuk membuat tanggal baru
  expDates.value.push({ date: "--NEW--", stock: "Buat Tanggal Baru" });
};

// Awasi perubahan pada pilihan produk, lalu ambil data tanggal kedaluwarsanya
watch(() => formData.value.product_id, fetchExpDates);

// Awasi perubahan pada pilihan tanggal kedaluwarsa untuk menampilkan input tanggal baru
watch(
  () => formData.value.exp_date,
  (newValue) => {
    if (newValue === "--NEW--") {
      isCreatingNewExpDate.value = true;
    } else {
      isCreatingNewExpDate.value = false;
    }
  }
);

// Logika untuk membuka modal
const openModal = async (entry = null) => {
  showModal.value = true;
  selectedProduct.value = entry;
  isCreatingNewExpDate.value = false; // Selalu reset ke false

  formData.value = entry
    ? { ...entry, product_id: entry.product.id, new_exp_date: "" }
    : { product_id: "", exp_date: "", new_exp_date: "", added_stock: 1 };

  if (entry) {
    await fetchExpDates(); // Muat tanggal kedaluwarsa jika sedang mengedit
  }
};

// Logika untuk menutup modal
const closeModal = () => {
  showModal.value = false;
};

// Logika untuk menyimpan data barang masuk (bisa untuk tanggal lama atau baru)
const saveEntry = async () => {
  const url = selectedProduct.value
    ? useApi(`/api/entry-products/${selectedProduct.value.id}`)
    : useApi(`/api/entry-products/store`);

  const method = selectedProduct.value ? "PUT" : "POST";

  let payload = {
    product_id: formData.value.product_id,
    added_stock: formData.value.added_stock,
  };

  // Kirim payload yang sesuai berdasarkan pilihan pengguna
  if (isCreatingNewExpDate.value) {
    payload.new_exp_date = formData.value.new_exp_date;
  } else {
    payload.exp_date = formData.value.exp_date;
  }

  try {
    await axios({
      method: method,
      url: url,
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    closeModal();
    fetchEntries();
    fetchProducts();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      alert("Error: " + error.response.data.message);
    } else {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  }
};

// Logika untuk menghapus data barang masuk
const deleteEntry = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
  await fetch(useApi(`/api/entry-products/${id}`), { method: "DELETE" });
  fetchEntries();
  fetchProducts();
};

// Computed property untuk memfilter data berdasarkan pencarian
const filteredEntry = computed(() => {
  return entryProducts.value.filter((entry) => {
    const query = searchQuery.value.toLowerCase();
    return (
      entry.product.name.toLowerCase().includes(query) ||
      entry.product.code.toLowerCase().includes(query) ||
      entry.product.price.toString().includes(query) ||
      entry.exp_date.toString().includes(query) ||
      entry.added_stock.toString().includes(query) ||
      entry.previous_stock.toString().includes(query) ||
      entry.current_stock.toString().includes(query) ||
      entry.created_at.toString().includes(query)
    );
  });
});

// Computed property untuk paginasi data
const paginatedEntry = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredEntry.value.slice(start, start + itemsPerPage.value);
});

// Computed property untuk total halaman paginasi
const totalPages = computed(() => {
  return Math.ceil(filteredEntry.value.length / itemsPerPage.value);
});

// Computed property untuk menghasilkan tombol-tombol paginasi
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

// Fungsi untuk mengubah halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== "...") {
    currentPage.value = page;
  }
};

// Fungsi utilitas untuk memformat tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

// Fungsi utilitas untuk memformat harga
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Fungsi untuk menangani error saat gambar tidak termuat
const onImageError = (event) => {
  event.target.src = fallbackImage;
};

// Awasi perubahan pada pilihan item per halaman
watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchEntries();
});

// Muat data awal saat komponen pertama kali dimuat
onMounted(() => {
  fetchEntries();
  fetchProducts();
});
</script>

<template>
  <!-- <div class="container p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Barang Masuk</h1>
      <div class="flex gap-2">
        <button
          @click="openAddExpDateModal()"
          class="px-4 py-2 text-white bg-green-600 rounded shadow hover:bg-green-700"
        >
          + Tambah Tanggal Expired
        </button>
        <button
          @click="openModal()"
          class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
        >
          + Tambah Stok Barang Masuk
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
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
        class="p-2 border rounded"
      />
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead class="bg-gray-100 border-b">
            <tr class="bg-gray-200">
              <th class="p-3 text-left border">#</th>
              <th class="p-3 text-center border">Foto</th>
              <th class="p-3 text-left border">Nama</th>
              <th class="p-3 text-center border">Harga</th>
              <th class="p-3 text-center border">Tanggal Expired</th>
              <th class="p-3 text-center border">Sebelum</th>
              <th class="p-3 text-center border">Jumlah</th>
              <th class="p-3 text-center border">Sesudah</th>
              <th class="p-3 text-center border">Waktu Penambahan</th>
              <th class="p-3 text-center border">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in paginatedEntry"
              :key="entry.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3 border">{{ entry.product.code }}</td>
              <td
                class="flex min-h-[120px] min-w-[120px] items-center justify-center border p-2"
              >
                <img
                  :src="
                    entry.product.photo
                      ? useApi(`/public/storage/${entry.product.photo}`)
                      : fallbackImage
                  "
                  @error="onImageError"
                  class="w-20 h-20 object-fit"
                />
              </td>
              <td class="p-3 border">{{ entry.product.name }}</td>
              <td class="p-3 text-center border">
                {{ formatPrice(entry.product.price) }}
              </td>
              <td class="p-3 text-center border">
                {{ entry.exp_date }}
              </td>
              <td class="p-3 font-bold text-center border">{{ entry.previous_stock }}</td>
              <td class="p-3 font-bold text-center text-blue-500 border">
                + {{ entry.added_stock }}
              </td>
              <td class="p-3 font-bold text-center border">{{ entry.current_stock }}</td>
              <td class="p-3 text-center border">
                {{ formatDate(entry.created_at) }}
              </td>
              <td class="p-3 text-center border">
                <button
                  @click="openModal(entry)"
                  class="px-3 py-1 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <button
                  @click="deleteEntry(entry.id)"
                  class="px-3 py-1 ml-2 text-white bg-red-500 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between mt-4">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredEntry.length) }} of
            {{ filteredEntry.length }} entries
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

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow-lg">
        <h2 class="mb-4 text-xl font-bold">Pilih Barang Masuk</h2>

        <label class="block mb-2 text-gray-700">Pilih Produk:</label>
        <select v-model="formData.product_id" class="w-full p-2 mb-4 border">
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.code }}) - Rp
            {{ product.price.toLocaleString() }}
          </option>
        </select>

        <label class="block mb-2 text-gray-700">Tanggal Expired:</label>
        <select v-model="formData.exp_date" class="w-full p-2 mb-4 border">
          <option v-for="exp in expDates" :key="exp.date" :value="exp.date">
            {{ exp.date }} ({{ exp.stock }})
          </option>
        </select>

        <label class="block mb-2 text-gray-700">Jumlah Stok:</label>
        <input
          type="number"
          v-model="formData.added_stock"
          class="w-full p-2 mb-4 border"
          min="1"
        />

        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 mr-2 text-white bg-gray-400 rounded"
          >
            Batal
          </button>
          <button @click="saveEntry" class="px-4 py-2 text-white bg-blue-600 rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showAddExpDateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60"
    >
      <div class="w-1/3 p-6 bg-white rounded-lg shadow-xl">
        <h2 class="mb-4 text-xl font-bold">Tambah Tanggal Expired Baru</h2>

        <div
          v-if="addExpDateError"
          class="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded"
        >
          {{ addExpDateError }}
        </div>
        <div
          v-if="addExpDateSuccess"
          class="p-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded"
        >
          {{ addExpDateSuccess }}
        </div>

        <label class="block mb-2 text-sm font-medium text-gray-700">Pilih Produk:</label>
        <select
          v-model="newExpDateData.product_id"
          class="w-full p-2 mb-4 border border-gray-300 rounded-md"
        >
          <option :value="null" disabled>-- Pilih Produk --</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.code }})
          </option>
        </select>

        <label class="block mb-2 text-sm font-medium text-gray-700"
          >Tanggal Expired Baru:</label
        >
        <input
          type="date"
          v-model="newExpDateData.new_exp_date"
          class="w-full p-2 mb-6 border border-gray-300 rounded-md"
        />

        <div class="flex justify-end gap-3">
          <button
            @click="closeAddExpDateModal"
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            @click="saveNewExpDate"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div> -->

  <div class="container p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Barang Masuk</h1>
      <button
        @click="openModal()"
        class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
      >
        + Tambah Barang Masuk
      </button>
    </div>

    <div class="flex items-center justify-between mb-4">
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
        class="p-2 border rounded"
      />
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead class="bg-gray-100 border-b">
            <tr class="bg-gray-200">
              <th class="p-3 text-left border">#</th>
              <th class="p-3 text-center border">Foto</th>
              <th class="p-3 text-left border">Nama</th>
              <th class="p-3 text-center border">Harga</th>
              <th class="p-3 text-center border">Tanggal Expired</th>
              <th class="p-3 text-center border">Sebelum</th>
              <th class="p-3 text-center border">Jumlah</th>
              <th class="p-3 text-center border">Sesudah</th>
              <th class="p-3 text-center border">Waktu Penambahan</th>
              <th class="p-3 text-center border">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in paginatedEntry"
              :key="entry.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3 border">{{ entry.product.code }}</td>
              <td
                class="flex min-h-[120px] min-w-[120px] items-center justify-center border p-2"
              >
                <img
                  :src="
                    entry.product.photo
                      ? useApi(`/storage/${entry.product.photo}`)
                      : fallbackImage
                  "
                  @error="onImageError"
                  class="object-contain w-20 h-20"
                />
              </td>
              <td class="p-3 border">{{ entry.product.name }}</td>
              <td class="p-3 text-center border">
                {{ formatPrice(entry.product.price) }}
              </td>
              <td class="p-3 text-center border">
                {{ entry.exp_date }}
              </td>
              <td class="p-3 font-bold text-center border">{{ entry.previous_stock }}</td>
              <td class="p-3 font-bold text-center text-blue-500 border">
                + {{ entry.added_stock }}
              </td>
              <td class="p-3 font-bold text-center border">{{ entry.current_stock }}</td>
              <td class="p-3 text-center border">
                {{ formatDate(entry.created_at) }}
              </td>
              <td class="p-3 text-center border">
                <button
                  @click="openModal(entry)"
                  class="px-3 py-1 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <button
                  @click="deleteEntry(entry.id)"
                  class="px-3 py-1 ml-2 text-white bg-red-500 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between mt-4">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredEntry.length) }} of
            {{ filteredEntry.length }} entries
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

    <div
      v-if="showModal"
      class="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow-lg">
        <h2 class="mb-4 text-xl font-bold">Pilih Barang Masuk</h2>

        <label class="block mb-2 text-gray-700">Pilih Produk:</label>
        <select v-model="formData.product_id" class="w-full p-2 mb-4 border">
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.code }}) - Rp
            {{ product.price.toLocaleString() }}
          </option>
        </select>

        <label class="block mb-2 text-gray-700">Tanggal Expired:</label>

        <select
          v-if="!isCreatingNewExpDate"
          v-model="formData.exp_date"
          class="w-full p-2 border"
        >
          <option value="" disabled>-- Pilih Tanggal --</option>
          <option v-for="exp in expDates" :key="exp.date" :value="exp.date">
            {{ exp.date === "--NEW--" ? exp.stock : `${exp.date} (Stok: ${exp.stock})` }}
          </option>
        </select>

        <div v-else>
          <input type="date" v-model="formData.new_exp_date" class="w-full p-2 border" />
          <button
            @click="
              isCreatingNewExpDate = false;
              formData.exp_date = '';
            "
            class="mt-2 text-sm text-blue-500 hover:underline"
          >
            Batal, pilih dari daftar
          </button>
        </div>

        <label class="block mt-4 mb-2 text-gray-700">Jumlah Stok:</label>
        <input
          type="number"
          v-model="formData.added_stock"
          class="w-full p-2 mb-4 border"
          min="1"
        />

        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 mr-2 text-white bg-gray-400 rounded"
          >
            Batal
          </button>
          <button @click="saveEntry" class="px-4 py-2 text-white bg-blue-600 rounded">
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
