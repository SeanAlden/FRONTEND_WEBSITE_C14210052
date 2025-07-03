<script setup>
// import axios from "axios";
// import { ref, onMounted, watch } from "vue";

// definePageMeta({
//   middleware: ["auth"],
// });

// const exitProducts = ref([]);
// const products = ref([]);
// const expDates = ref([]);
// const showModal = ref(false);
// const selectedProduct = ref(null);
// const formData = ref({ product_id: "", exp_date: "", removed_stock: 0 });
// const searchQuery = ref("");
// const itemsPerPageOptions = [5, 10, 20, 50];
// const itemsPerPage = ref(5);
// const currentPage = ref(1);
// const isLoading = ref(true);

// const fallbackImage = "/assets/images/avatar.png";

// const fetchExits = async () => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get(useApi(`/api/exit-products`));

//     exitProducts.value = response.data.data;
//   } catch (error) {
//     alert("Terjadi kesalahan: " + error.message);
//   } finally {
//     isLoading.value = false;
//   }
// };

// const fetchProducts = async () => {
//   const response = await axios.get(useApi(`/api/products`));

//   products.value = response.data.data;
// };

// const fetchExpDates = async () => {
//   if (!formData.value.product_id) return;
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

// const openModal = (exit = null) => {
//   showModal.value = true;
//   selectedProduct.value = exit;
//   formData.value = exit
//     ? { ...exit, product_id: exit.product.id }
//     : { product_id: "", exp_date: "", removed_stock: 0 };
// };

// const closeModal = () => {
//   showModal.value = false;
// };

// const saveExit = async () => {
//   if (!formData.value.product_id || !formData.value.exp_date) {
//     alert("Harap pilih produk dan tanggal expired!");
//     return;
//   }

//   const url = selectedProduct.value
//     ? useApi(`/api/exit-products/${selectedProduct.value.id}`)
//     : useApi(`/api/exit-products/store`);

//   const method = selectedProduct.value ? "PUT" : "POST";

//   const response = await fetch(url, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData.value),
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     alert(result.message || "Terjadi kesalahan saat menyimpan data!");
//     return;
//   }

//   closeModal();
//   fetchExits();
//   fetchProducts();
// };

// const deleteExit = async (id) => {
//   if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

//   await fetch(useApi(`/api/exit-products/${id}`), { method: "DELETE" });
//   fetchExits();
//   fetchProducts();
// };

// const filteredExit = computed(() => {
//   return exitProducts.value.filter((exit) => {
//     const query = searchQuery.value.toLowerCase();
//     return (
//       exit.product.name.toLowerCase().includes(query) ||
//       exit.product.code.toLowerCase().includes(query) ||
//       exit.product.price.toString().includes(query) ||
//       exit.exp_date.toString().includes(query) ||
//       exit.removed_stock.toString().includes(query) ||
//       exit.previous_stock.toString().includes(query) ||
//       exit.current_stock.toString().includes(query) ||
//       exit.created_at.toString().includes(query)
//     );
//   });
// });

// const paginatedExit = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage.value;
//   return filteredExit.value.slice(start, start + itemsPerPage.value);
// });

// const totalPages = computed(() => {
//   return Math.ceil(filteredExit.value.length / itemsPerPage.value);
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

// watch(itemsPerPage, () => {
//   currentPage.value = 1;
//   fetchExits();
// });

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

// onMounted(() => {
//   fetchExits();
//   fetchProducts();
// });

// import axios from "axios";
// import { ref, computed, onMounted, watch } from "vue";

// definePageMeta({
//   middleware: ["auth"],
// });

// // Data utama
// const exitProducts = ref([]);
// const products = ref([]);
// const expDates = ref([]);
// const showModal = ref(false);
// const selectedProduct = ref(null);
// const formData = ref({ product_id: "", exp_date: "", removed_stock: 1 });

// // BARU: State untuk menyimpan detail item stok yang dipilih (termasuk jumlah stoknya)
// const selectedStockItem = ref(null);

// const searchQuery = ref("");
// const itemsPerPageOptions = [5, 10, 20, 50];
// const itemsPerPage = ref(5);
// const currentPage = ref(1);
// const isLoading = ref(true);
// const fallbackImage = "/assets/images/avatar.png";

// // Ambil riwayat barang keluar
// const fetchExits = async () => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get(useApi(`/api/exit-products`));
//     exitProducts.value = response.data.data;
//   } catch (error) {
//     alert("Terjadi kesalahan: " + error.message);
//   } finally {
//     isLoading.value = false;
//   }
// };

// // Ambil daftar produk
// const fetchProducts = async () => {
//   const response = await axios.get(useApi(`/api/products`));
//   products.value = response.data.data;
// };

// // Ambil daftar tanggal expired beserta stoknya
// const fetchExpDates = async () => {
//   selectedStockItem.value = null; // Reset setiap kali produk berubah
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
//   // Hanya tampilkan tanggal yang memiliki stok atau yang sedang diedit
//   expDates.value = expDatesWithStock.filter((item) => {
//     if (selectedProduct.value) {
//       return item.stock > 0 || item.date === selectedProduct.value.exp_date;
//     }
//     return item.stock > 0;
//   });
// };

// // Awasi perubahan produk, lalu ambil data tanggalnya
// watch(() => formData.value.product_id, fetchExpDates);

// // BARU: Awasi perubahan tanggal, lalu simpan detail stoknya
// watch(
//   () => formData.value.exp_date,
//   (newDate) => {
//     if (newDate) {
//       selectedStockItem.value =
//         expDates.value.find((item) => item.date === newDate) || null;
//     } else {
//       selectedStockItem.value = null;
//     }
//   }
// );

// // Buka modal
// const openModal = (exit = null) => {
//   showModal.value = true;
//   selectedProduct.value = exit;
//   selectedStockItem.value = null; // Reset

//   formData.value = exit
//     ? {
//         product_id: exit.product.id,
//         exp_date: exit.exp_date,
//         removed_stock: exit.removed_stock,
//       }
//     : { product_id: "", exp_date: "", removed_stock: 1 };

//   if (exit) {
//     fetchExpDates(); // Panggil fetchExpDates jika sedang edit
//   }
// };

// const closeModal = () => {
//   showModal.value = false;
// };

// // Simpan data barang keluar
// const saveExit = async () => {
//   if (!formData.value.product_id || !formData.value.exp_date) {
//     alert("Harap pilih produk dan tanggal expired!");
//     return;
//   }

//   const url = selectedProduct.value
//     ? useApi(`/api/exit-products/${selectedProduct.value.id}`)
//     : useApi(`/api/exit-products/store`);

//   const method = selectedProduct.value ? "PUT" : "POST";

//   try {
//     const response = await axios({
//       method: method,
//       url: url,
//       data: formData.value,
//     });

//     if (response.data.success) {
//       closeModal();
//       fetchExits();
//       fetchProducts();
//     }
//   } catch (error) {
//     alert(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data!");
//   }
// };

// // BARU: Fungsi untuk menghapus tanggal expired
// const deleteExpDate = async () => {
//   if (!selectedStockItem.value) return;

//   const { product_id, exp_date } = formData.value;

//   if (
//     confirm(
//       `Anda yakin ingin menghapus data expired tanggal ${exp_date} untuk produk ini? Stok akan dihapus permanen.`
//     )
//   ) {
//     try {
//       await axios.delete(useApi(`/api/products/${product_id}/exp-date/${exp_date}`));
//       alert("Tanggal expired berhasil dihapus.");
//       closeModal();
//       // Data tidak perlu di-fetch ulang karena sudah tidak relevan
//     } catch (error) {
//       alert(error.response?.data?.message || "Gagal menghapus tanggal expired.");
//     }
//   }
// };

// // Hapus riwayat barang keluar
// const deleteExit = async (id) => {
//   if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

//   await fetch(useApi(`/api/exit-products/${id}`), { method: "DELETE" });
//   fetchExits();
//   fetchProducts();
// };

// const filteredExit = computed(() => {
//   return exitProducts.value.filter((exit) => {
//     const query = searchQuery.value.toLowerCase();
//     return (
//       exit.product.name.toLowerCase().includes(query) ||
//       exit.product.code.toLowerCase().includes(query) ||
//       exit.product.price.toString().includes(query) ||
//       exit.exp_date.toString().includes(query) ||
//       exit.removed_stock.toString().includes(query) ||
//       exit.previous_stock.toString().includes(query) ||
//       exit.current_stock.toString().includes(query) ||
//       exit.created_at.toString().includes(query)
//     );
//   });
// });

// const paginatedExit = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage.value;
//   return filteredExit.value.slice(start, start + itemsPerPage.value);
// });

// const totalPages = computed(() => {
//   return Math.ceil(filteredExit.value.length / itemsPerPage.value);
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

// watch(itemsPerPage, () => {
//   currentPage.value = 1;
//   fetchExits();
// });

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
//   fetchExits();
// });

// onMounted(() => {
//   fetchExits();
//   fetchProducts();
// });

import axios from "axios";
import { ref, computed, onMounted, watch } from "vue";

definePageMeta({
  middleware: ["auth"],
});

// Data utama
const exitProducts = ref([]);
const products = ref([]);
const expDates = ref([]);
const showModal = ref(false);
const selectedProduct = ref(null);
const formData = ref({ product_id: "", exp_date: "", removed_stock: 1 });

// State untuk menyimpan detail item stok yang dipilih
const selectedStockItem = ref(null);

const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const isLoading = ref(true);
const fallbackImage = "/assets/images/avatar.png";

// Ambil riwayat barang keluar
const fetchExits = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(useApi(`/api/exit-products`));
    exitProducts.value = response.data.data;
  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    isLoading.value = false;
  }
};

// Ambil daftar produk
const fetchProducts = async () => {
  const response = await axios.get(useApi(`/api/products`));
  products.value = response.data.data;
};

// Ambil daftar tanggal expired beserta stoknya
const fetchExpDates = async () => {
  selectedStockItem.value = null; // Reset setiap kali produk berubah
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
  // Hanya tampilkan tanggal yang memiliki stok atau yang sedang diedit
  expDates.value = expDatesWithStock.filter((item) => {
    if (selectedProduct.value) {
      return item.stock >= 0 || item.date === selectedProduct.value.exp_date;
    }
    return item.stock >= 0;
  });
};

// Awasi perubahan produk, lalu ambil data tanggalnya
watch(() => formData.value.product_id, fetchExpDates);

// Awasi perubahan tanggal, lalu simpan detail stoknya
watch(
  () => formData.value.exp_date,
  (newDate) => {
    if (newDate) {
      selectedStockItem.value =
        expDates.value.find((item) => item.date === newDate) || null;
    } else {
      selectedStockItem.value = null;
    }
  }
);

// Buka modal
const openModal = (exit = null) => {
  showModal.value = true;
  selectedProduct.value = exit;
  selectedStockItem.value = null; // Reset

  formData.value = exit
    ? {
        product_id: exit.product.id,
        exp_date: exit.exp_date,
        removed_stock: exit.removed_stock,
      }
    : { product_id: "", exp_date: "", removed_stock: 1 };

  if (exit) {
    fetchExpDates(); // Panggil fetchExpDates jika sedang edit
  }
};

const closeModal = () => {
  showModal.value = false;
};

// Simpan data barang keluar
const saveExit = async () => {
  if (!formData.value.product_id || !formData.value.exp_date) {
    alert("Harap pilih produk dan tanggal expired!");
    return;
  }

  const url = selectedProduct.value
    ? useApi(`/api/exit-products/${selectedProduct.value.id}`)
    : useApi(`/api/exit-products/store`);

  const method = selectedProduct.value ? "PUT" : "POST";

  try {
    const response = await axios({
      method: method,
      url: url,
      data: formData.value,
    });

    if (response.data.success) {
      closeModal();
      fetchExits();
      fetchProducts();
    }
  } catch (error) {
    alert(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data!");
  }
};

// Fungsi untuk menghapus tanggal expired
const deleteExpDate = async () => {
  if (!selectedStockItem.value) return;

  const { product_id, exp_date } = formData.value;

  if (
    confirm(
      `Anda yakin ingin menghapus data expired tanggal ${exp_date} untuk produk ini? Stok akan dihapus permanen.`
    )
  ) {
    try {
      await axios.delete(useApi(`/api/products/${product_id}/exp-date/${exp_date}`));
      alert("Tanggal expired berhasil dihapus.");
      closeModal();
      // Data tidak perlu di-fetch ulang karena sudah tidak relevan
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus tanggal expired.");
    }
  }
};

// Hapus riwayat barang keluar
const deleteExit = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

  await fetch(useApi(`/api/exit-products/${id}`), { method: "DELETE" });
  fetchExits();
  fetchProducts();
};

const filteredExit = computed(() => {
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
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
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
  fetchExits();
});

onMounted(() => {
  fetchExits();
  fetchProducts();
});
</script>

<template>
  <!-- <div class="container p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Barang Keluar</h1>
      <button
        @click="openModal()"
        class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
      >
        + Tambah Barang Keluar
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
              <th class="p-3 text-center border">#</th>
              <th class="p-3 text-center border">Foto</th>
              <th class="p-3 text-left border">Nama</th>
              <th class="p-3 text-center border">Harga</th>
              <th class="p-3 text-center border">Tanggal Expired</th>
              <th class="p-3 text-center border">Sebelum</th>
              <th class="p-3 text-center border">Jumlah</th>
              <th class="p-3 text-center border">Sesudah</th>
              <th class="p-3 text-center border">Waktu Pengurangan</th>
              <th class="p-3 text-center border">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="exit in paginatedExit"
              :key="exit.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3 border">{{ exit.product.code }}</td>
              <td
                class="flex min-h-[120px] min-w-[120px] items-center justify-center border p-2"
              >
                <img
                  :src="
                    exit.product.photo
                      ? useApi(`/public/storage/${exit.product.photo}`)
                      : fallbackImage
                  "
                  @error="onImageError"
                  class="w-20 h-20 object-fit"
                />
              </td>
              <td class="p-3 border">{{ exit.product.name }}</td>
              <td class="p-3 text-center border">
                {{ formatPrice(exit.product.price) }}
              </td>
              <td class="p-3 text-center border">
                {{ exit.exp_date }}
              </td>
              <td class="p-3 font-bold text-center border">{{ exit.previous_stock }}</td>
              <td class="p-3 font-bold text-center text-red-500 border">
                - {{ exit.removed_stock }}
              </td>
              <td class="p-3 font-bold text-center border">{{ exit.current_stock }}</td>
              <td class="p-3 text-center border">
                {{ formatDate(exit.created_at) }}
              </td>
              <td class="p-3 text-center border">
                <button
                  @click="openModal(exit)"
                  class="px-3 py-1 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <button
                  @click="deleteExit(exit.id)"
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
            {{ Math.min(currentPage * itemsPerPage, filteredExit.length) }} of
            {{ filteredExit.length }} entries
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
        <h2 class="mb-4 text-xl font-bold">Pilih Barang Keluar</h2>

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
          v-model="formData.removed_stock"
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
          <button @click="saveExit" class="px-4 py-2 text-white bg-blue-600 rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div> -->
  <div class="container p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Barang Keluar</h1>
      <button
        @click="openModal()"
        class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
      >
        + Tambah Barang Keluar
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
              <th class="p-3 text-center border">#</th>
              <th class="p-3 text-center border">Foto</th>
              <th class="p-3 text-left border">Nama</th>
              <th class="p-3 text-center border">Harga</th>
              <th class="p-3 text-center border">Tanggal Expired</th>
              <th class="p-3 text-center border">Sebelum</th>
              <th class="p-3 text-center border">Jumlah</th>
              <th class="p-3 text-center border">Sesudah</th>
              <th class="p-3 text-center border">Waktu Pengurangan</th>
              <th class="p-3 text-center border">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="exit in paginatedExit"
              :key="exit.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3 border">{{ exit.product.code }}</td>
              <!-- <td
                class="flex min-h-[120px] min-w-[120px] items-center justify-center border p-2"
              >
                <img
                  :src="
                    exit.product.photo
                      ? useApi(`/public/storage/${exit.product.photo}`)
                      : fallbackImage
                  "
                  @error="onImageError"
                  class="object-contain w-20 h-20"
                />
              </td> -->
              <td class="p-2 border">
                <div class="flex min-h-[100px] min-w-[100px] items-center justify-center w-full h-full">
                  <img
                    :src="
                      exit.product.photo
                        ? useApi(`/public/storage/${exit.product.photo}`)
                        : fallbackImage
                    "
                    @error="onImageError"
                    class="object-cover w-20 h-20 rounded"
                  />
                </div>
              </td>
              <td class="p-3 border">{{ exit.product.name }}</td>
              <td class="p-3 text-center border">
                {{ formatPrice(exit.product.price) }}
              </td>
              <td class="p-3 text-center border">
                {{ exit.exp_date }}
              </td>
              <td class="p-3 font-bold text-center border">{{ exit.previous_stock }}</td>
              <td class="p-3 font-bold text-center text-red-500 border">
                - {{ exit.removed_stock }}
              </td>
              <td class="p-3 font-bold text-center border">{{ exit.current_stock }}</td>
              <td class="p-3 text-center border">
                {{ formatDate(exit.created_at) }}
              </td>
              <td class="p-3 text-center border">
                <button
                  @click="openModal(exit)"
                  class="px-3 py-1 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <button
                  @click="deleteExit(exit.id)"
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
            {{ Math.min(currentPage * itemsPerPage, filteredExit.length) }} of
            {{ filteredExit.length }} entries
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow-lg">
        <h2 class="mb-4 text-xl font-bold">Pilih Barang Keluar</h2>

        <label class="block mb-2 text-gray-700">Pilih Produk:</label>
        <select
          v-model="formData.product_id"
          :disabled="selectedProduct"
          class="w-full p-2 mb-4 border disabled:bg-gray-200"
        >
          <option value="" disabled>-- Pilih Produk --</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.code }})
          </option>
        </select>

        <label class="block mb-2 text-gray-700">Tanggal Expired:</label>
        <select
          v-model="formData.exp_date"
          :disabled="!formData.product_id || selectedProduct"
          class="w-full p-2 mb-4 border disabled:bg-gray-200"
        >
          <option value="" disabled>-- Pilih Tanggal --</option>
          <option v-for="exp in expDates" :key="exp.date" :value="exp.date">
            {{ exp.date }} (Stok: {{ exp.stock }})
          </option>
        </select>

        <div v-if="selectedStockItem">
          <div v-if="selectedStockItem.stock > 0">
            <label class="block mb-2 text-gray-700">Jumlah Stok Keluar:</label>
            <input
              type="number"
              v-model="formData.removed_stock"
              class="w-full p-2 mb-4 border"
              min="1"
              :max="selectedStockItem.stock"
            />
          </div>

          <div
            v-else
            class="p-4 my-4 text-center bg-yellow-100 border-l-4 border-yellow-500"
          >
            <p class="font-bold">Stok untuk tanggal ini sudah habis (0).</p>
            <p class="text-sm">
              Anda dapat menghapus data tanggal expired ini dari daftar pilihan.
            </p>
            <button
              @click="deleteExpDate"
              class="px-4 py-2 mt-3 text-white bg-red-600 rounded shadow-md hover:bg-red-700"
            >
              Hapus Tanggal Expired Ini
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 mr-2 text-white bg-gray-400 rounded"
          >
            Batal
          </button>
          <button
            v-if="selectedStockItem && selectedStockItem.stock > 0"
            @click="saveExit"
            class="px-4 py-2 text-white bg-blue-600 rounded"
          >
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
