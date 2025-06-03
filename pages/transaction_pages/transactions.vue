<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const transactions = ref([]);

const filterDate = ref("");
const filterStartDate = ref("");
const filterEndDate = ref("");

const filterMonthYear = ref("");
const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const expandedRow = ref(null);
const isLoading = ref(true); // State untuk loading
const token = useCookie("my_auth_token");

const fallbackImage = "/assets/images/avatar.png";

// Fungsi untuk mengekspor ke PDF
// const exportToPDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(12);

//   // Menambahkan judul
//   doc.text("Data Transaksi", 14, 16);

//   // Menambahkan header tabel
//   const headers = ["Kode Transaksi", "Nama", "Total Transaksi", "Waktu", "Status"];
//   const data = paginatedTransactions.value.map((transaction) => [
//     transaction.transaction_code,
//     transaction.mergedDetails[0].name,
//     formatPrice(transaction.total_payment),
//     formatDate(transaction.transaction_date),
//     transaction.status,
//   ]);
//   // Menambahkan header dan data ke PDF
//   doc.autoTable({
//     head: [headers],
//     body: data,
//   });
//   // Menyimpan PDF
//   doc.save("data_transaksi.pdf");
// };

const exportToPDF = () => {
  const doc = new jsPDF();

  // Judul PDF
  doc.setFontSize(16);
  doc.text("Data Transaksi", 14, 15);

  // Siapkan data untuk tabel PDF
  // const rows = paginatedTransactions.value.map((transaction) => [
  const rows = transactions.value.map((transaction) => [
    transaction.transaction_code,
    formatPrice(transaction.gross_amount),
    transaction.payment_method,
    transaction.shipping_method,
    formatPrice(transaction.total_payment),
    formatDate(transaction.transaction_date),
    transaction.status,
  ]);

  // Tambahkan tabel ke PDF
  autoTable(doc, {
    startY: 20,
    head: [
      [
        "Kode Transaksi",
        "Total Biaya Produk",
        "Metode Pembayaran",
        "Metode Pengiriman",
        "Total Transaksi",
        "Waktu",
        "Status",
      ],
    ],
    body: rows,
    styles: { fontSize: 9 },
  });

  // Simpan PDF
  doc.save("data_transaksi.pdf");
};

// Fungsi untuk mengekspor ke Excel
const exportToExcel = () => {
  // const data = paginatedTransactions.value.map((transaction) => ({
  const data = transactions.value.map((transaction) => ({
    "Kode Transaksi": transaction.transaction_code,
    // Nama: transaction.mergedDetails[0].name,
    "Total Biaya Produk": formatPrice(transaction.gross_amount),
    "Metode Pembayaran": transaction.payment_method,
    "Metode Pengiriman": transaction.shipping_method,
    "Total Transaksi": formatPrice(transaction.total_payment),
    Waktu: formatDate(transaction.transaction_date),
    Status: transaction.status,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Transaksi");
  // Menyimpan file Excel
  XLSX.writeFile(workbook, "data_transaksi.xlsx");
};

const goToTransactionDetail = (id) => {
  router.push(`/transaction_pages/detail/${id}`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(date.getHours());
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

// Fetch data transaksi dari API
onMounted(async () => {
  isLoading.value = true; // Set loading to true
  try {
    const response = await axios.get(useApi("/api/transactions"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    transactions.value = response.data.transactions.map((transaction) => {
      const mergedProducts = {};

      transaction.details.forEach((detail) => {
        const productId = detail.product.id;
        if (!mergedProducts[productId]) {
          mergedProducts[productId] = {
            product_id: productId,
            name: detail.product.name,
            code: detail.product.code,
            photo: detail.product.photo,
            price: detail.product.price,
            quantity: 0,
          };
        }
        mergedProducts[productId].quantity += detail.quantity;
      });

      return {
        ...transaction,
        mergedDetails: Object.values(mergedProducts),
      };
    });
  } catch (error) {
    console.error("Gagal mengambil data transaksi:", error);
  } finally {
    isLoading.value = false;
  }
});

// Computed property untuk filter transaksi berdasarkan tanggal atau bulan-tahun
// const filteredTransactions = computed(() => {
//   return transactions.value
//     .filter((transaction) => {
//       const transactionDate = new Date(transaction.transaction_date);
//       const formattedDate = transactionDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
//       const formattedMonthYear = transactionDate.toISOString().slice(0, 7); // Format YYYY-MM

//       if (filterDate.value && formattedDate !== filterDate.value) {
//         return false;
//       }
//       if (filterMonthYear.value && formattedMonthYear !== filterMonthYear.value) {
//         return false;
//       }
//       if (
//         searchQuery.value &&
//         !transaction.mergedDetails.some(
//           (detail) =>
//             detail.price.toString().includes(searchQuery.value.toLowerCase()) ||
//             transaction.transaction_code
//               .toLowerCase()
//               .includes(searchQuery.value.toLowerCase()) ||
//             detail.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//             detail.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//             detail.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//             detail.quantity.toString().includes(searchQuery.value.toLowerCase()) ||
//             transaction.gross_amount
//               .toString()
//               .includes(searchQuery.value.toLowerCase()) ||
//             transaction.status.toLowerCase().includes(searchQuery.value.toLowerCase())
//         )
//       ) {
//         return false;
//       }
//       return true;
//     })
//     .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)); // Mengurutkan dari terbaru ke terlama
// });

// const filteredTransactions = computed(() => {
//   return transactions.value
//     .filter((transaction) => {
//       const transactionDate = new Date(transaction.transaction_date);

//       // Tambahkan 7 jam ke waktu transaksi (7 jam = 25200000 milidetik)
//       const adjustedDate = new Date(transactionDate.getTime() + 7 * 60 * 60 * 1000);

//       const formattedDate = adjustedDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
//       const formattedMonthYear = adjustedDate.toISOString().slice(0, 7); // Format YYYY-MM

//       if (filterDate.value && formattedDate !== filterDate.value) {
//         return false;
//       }
//       if (filterMonthYear.value && formattedMonthYear !== filterMonthYear.value) {
//         return false;
//       }
//       if (
//         searchQuery.value &&
//         !transaction.mergedDetails.some(
//           (detail) =>
//             detail.price.toString().includes(searchQuery.value.toLowerCase()) ||
//             transaction.transaction_code
//               .toLowerCase()
//               .includes(searchQuery.value.toLowerCase()) ||
//             detail.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//             detail.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//             detail.quantity.toString().includes(searchQuery.value.toLowerCase()) ||
//             transaction.gross_amount
//               .toString()
//               .includes(searchQuery.value.toLowerCase()) ||
//             transaction.status.toLowerCase().includes(searchQuery.value.toLowerCase())
//         )
//       ) {
//         return false;
//       }
//       return true;
//     })
//     .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)); // Mengurutkan dari terbaru ke terlama
// });

// Update the filteredTransactions computed property
const filteredTransactions = computed(() => {
  return transactions.value
    .filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);

      // Tambahkan 7 jam ke waktu transaksi (7 jam = 25200000 milidetik)
      const adjustedDate = new Date(transactionDate.getTime() + 7 * 60 * 60 * 1000);

      const formattedDate = adjustedDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
      const formattedMonthYear = adjustedDate.toISOString().slice(0, 7); // Format YYYY-MM

      // Check for date range filter
      const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
      const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;
      // Adjust endDate to include the entire day
      if (endDate) {
        endDate.setHours(23, 59, 59, 999); // Set to end of the day
      }
      if (startDate && adjustedDate < startDate) {
        return false; // Exclude if before start date
      }
      if (endDate && adjustedDate > endDate) {
        return false; // Exclude if after end date
      }

      // // Check for date range filter
      // if (filterStartDate.value && new Date(filterStartDate.value) > adjustedDate) {
      //   return false;
      // }
      // if (filterEndDate.value && new Date(filterEndDate.value) < adjustedDate) {
      //   return false;
      // }
      // if (filterEndDate.value && new Date(filterEndDate.value) >= adjustedDate) {
      //   return true; // Include transactions on the end date
      // }

      if (filterDate.value && formattedDate !== filterDate.value) {
        return false;
      }
      if (filterMonthYear.value && formattedMonthYear !== filterMonthYear.value) {
        return false;
      }
      if (
        searchQuery.value &&
        !transaction.mergedDetails.some(
          (detail) =>
            detail.price.toString().includes(searchQuery.value.toLowerCase()) ||
            transaction.transaction_code
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase()) ||
            detail.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            detail.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            detail.quantity.toString().includes(searchQuery.value.toLowerCase()) ||
            transaction.gross_amount
              .toString()
              .includes(searchQuery.value.toLowerCase()) ||
            transaction.status.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)); // Mengurutkan dari terbaru ke terlama
});

// Reset filter
const resetFilters = () => {
  filterDate.value = "";
  filterMonthYear.value = "";
};

const getStatusClass = (status) => {
  switch (status) {
    case "Pesanan selesai":
    case "Pembatalan berhasil":
      return "text-green-500"; // Hijau
    case "Pembayaran lunas":
    case "Pesanan sampai":
    case "Pesanan selesai dikemas":
      return "text-blue-500"; // Biru
    case "Belum bayar":
    case "Dalam perjalanan":
    case "Dalam pengemasan":
    case "Proses pembatalan":
      return "text-orange-500"; // Oranye
    case "Pembayaran gagal":
    case "Dibatalkan":
    case "Pengiriman gagal":
      return "text-red-500"; // Merah
    default:
      return "text-black"; // Hitam
  }
};

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredTransactions.value.slice(start, start + itemsPerPage.value);
});

const totalFilteredTransactions = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage.value);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const generatePagination = computed(() => {
  const total = totalFilteredTransactions.value;
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
  if (page >= 1 && page <= totalFilteredTransactions.value && page !== "...") {
    currentPage.value = page;
  }
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold text-gray-800">Data Transaksi</h1>
    <div class="mb-4 flex justify-end">
      <button @click="exportToPDF" class="mr-2 rounded bg-blue-500 px-4 py-2 text-white">
        Ekspor ke PDF
      </button>
      <button @click="exportToExcel" class="rounded bg-green-500 px-4 py-2 text-white">
        Ekspor ke Excel
      </button>
    </div>

    <!-- <div class="mb-4 flex flex-wrap gap-4"> -->
    <!-- Reset Filter -->
    <!-- <button @click="resetFilters" class="rounded-md bg-gray-500 px-4 py-2 text-white"> -->
    <!-- Reset Filter -->
    <!-- </button> -->
    <!-- </div> -->

    <!-- Filter Form -->
    <div class="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <!-- Items Per Page -->
      <div class="flex flex-col">
        <div class="flex items-center">
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
      </div>

      <!-- Centered Date Filters -->
      <!-- <div class="flex flex-col gap-4 sm:flex-row lg:mx-auto">
        <div>
          <label class="block text-sm font-medium text-gray-700">Filter Tanggal:</label>
          <input
            type="date"
            v-model="filterDate"
            class="mt-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Filter Bulan-Tahun:</label
          >
          <input
            type="month"
            v-model="filterMonthYear"
            class="mt-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div> -->

      <!-- Centered Date Filters -->
      <div class="flex flex-col gap-4 sm:flex-row lg:mx-auto">
        <div>
          <label class="block text-sm font-medium text-gray-700">Tanggal Pertama:</label>
          <input
            type="date"
            v-model="filterStartDate"
            class="mt-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tanggal Terakhir:</label>
          <input
            type="date"
            v-model="filterEndDate"
            class="mt-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Filter Bulan-Tahun:</label
          >
          <input
            type="month"
            v-model="filterMonthYear"
            class="mt-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Search:</label>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search"
          class="mt-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"
      ></div>
    </div>

    <!-- Tabel Data Transaksi -->
    <transition name="fade">
      <div
        v-if="!isLoading"
        class="overflow-x-auto whitespace-nowrap rounded-lg bg-white shadow-md"
      >
        <!-- <table class="min-w-full border border-gray-500 bg-white"> -->
        <table class="min-w-full border-collapse border border-black bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="border border-black px-4 py-3 text-left">Kode Transaksi</th>
              <!-- <th class="border border-black px-4 py-3 text-left">Kode Produk</th> -->
              <th class="border border-black px-4 py-3 text-left">Foto</th>
              <th class="border border-black px-4 py-3 text-left">Nama</th>
              <!-- <th class="border border-black px-4 py-3 text-left">Harga</th>
            <th class="border border-black px-4 py-3 text-left">Kuantitas</th>
            <th class="border border-black px-4 py-3 text-left">Total Harga</th> -->
              <th class="border border-black px-4 py-3 text-left">Total Transaksi</th>
              <th class="border border-black px-4 py-3 text-left">Waktu</th>
              <th class="border border-black px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <!-- <tbody class="bg-white">
          <tr
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            class="cursor-pointer transition duration-200 hover:bg-gray-200"
            @click="goToTransactionDetail(transaction.id)"
          >
            <td class="border border-black px-4 py-3">
              {{ transaction.transaction_code }}
            </td>
            <td class="border border-black px-4 py-3">
              <img
                :src="
                  'http://localhost:8000/storage/' + transaction.mergedDetails[0].photo
                "
                alt="Foto Produk"
                class="h-12 w-12 rounded-md"
              />
            </td>
            <td class="border border-black px-4 py-3">
              {{ transaction.mergedDetails[0].name }}
              <div
                v-if="transaction.mergedDetails.length > 1"
                class="cursor-pointer text-xs text-blue-500 hover:underline"
              >
                <div>
                  Klik untuk lihat +{{ transaction.mergedDetails.length - 1 }} produk
                  lainnya
                </div>
              </div>
            </td>

            <td class="border border-black px-4 py-3">
              {{ formatPrice(transaction.total_payment) }}
            </td>
            <td class="border border-black px-4 py-3">
              {{ formatDate(transaction.transaction_date) }}
            </td>
            <td class="border border-black px-4 py-3">
              <span :class="['font-bold', getStatusClass(transaction.status)]">
                {{ transaction.status }}
              </span>
            </td>
          </tr>
        </tbody> -->

          <tbody class="bg-white">
            <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
              <!-- Kolom TIDAK diklik -->
              <td class="border border-black px-4 py-3">
                {{ transaction.transaction_code }}
              </td>

              <!-- Kolom foto produk -->
              <td
                class="cursor-pointer border border-black px-4 py-3 transition duration-200 hover:bg-gray-200"
                @click="goToTransactionDetail(transaction.id)"
              >
                <img
                  :src="
                      transaction.mergedDetails[0].photo ? useApi(`/storage/${transaction.mergedDetails[0].photo}`) : fallbackImage
                    "
                    @error="onImageError"
                  alt="Foto Produk"
                  class="h-12 w-12 rounded-md"
                />
              </td>

              <!-- Kolom nama produk -->
              <td
                class="cursor-pointer border border-black px-4 py-3 transition duration-200 hover:bg-gray-200"
                @click="goToTransactionDetail(transaction.id)"
              >
                {{ transaction.mergedDetails[0].name }}
                <div
                  v-if="transaction.mergedDetails.length > 1"
                  class="text-xs text-blue-500 hover:underline"
                >
                  Klik untuk lihat +{{ transaction.mergedDetails.length - 1 }} produk
                  lainnya
                </div>
              </td>

              <!-- Kolom total pembayaran -->
              <td
                class="cursor-pointer border border-black px-4 py-3 transition duration-200 hover:bg-gray-200"
                @click="goToTransactionDetail(transaction.id)"
              >
                {{ formatPrice(transaction.total_payment) }}
              </td>

              <!-- Kolom tanggal transaksi -->
              <td
                class="cursor-pointer border border-black px-4 py-3 transition duration-200 hover:bg-gray-200"
                @click="goToTransactionDetail(transaction.id)"
              >
                {{ formatDate(transaction.transaction_date) }}
              </td>

              <!-- Kolom status -->
              <td
                class="cursor-pointer border border-black px-4 py-3 transition duration-200 hover:bg-gray-200"
                @click="goToTransactionDetail(transaction.id)"
              >
                <span :class="['font-bold', getStatusClass(transaction.status)]">
                  {{ transaction.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} of
        {{ filteredTransactions.length }} entries
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
