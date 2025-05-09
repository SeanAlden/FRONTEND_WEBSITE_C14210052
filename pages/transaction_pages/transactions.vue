<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const transactions = ref([]);
const filterDate = ref("");
const filterMonthYear = ref("");
const searchQuery = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);
const expandedRow = ref(null);

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
  try {
    const response = await axios.get("http://localhost:8000/api/admin/transactions");
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

const filteredTransactions = computed(() => {
  return transactions.value
    .filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);

      // Tambahkan 7 jam ke waktu transaksi (7 jam = 25200000 milidetik)
      const adjustedDate = new Date(transactionDate.getTime() + 7 * 60 * 60 * 1000);

      const formattedDate = adjustedDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
      const formattedMonthYear = adjustedDate.toISOString().slice(0, 7); // Format YYYY-MM

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
</script>
<template>
  <div class="mx-auto p-6 container">
    <h1 class="mb-4 font-bold text-gray-800 text-2xl">Data Transaksi</h1>

    <!-- <div class="flex flex-wrap gap-4 mb-4"> -->
    <!-- Reset Filter -->
    <!-- <button @click="resetFilters" class="bg-gray-500 px-4 py-2 rounded-md text-white"> -->
    <!-- Reset Filter -->
    <!-- </button> -->
    <!-- </div> -->

    <!-- Filter Form -->
    <div class="flex lg:flex-row flex-col lg:justify-between lg:items-end gap-4 mb-4">
      <!-- Items Per Page -->
      <div class="flex flex-col">
        <div class="flex items-center">
          <label class="mr-2">Show</label>
          <select v-model="itemsPerPage" class="p-1 border rounded">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span class="ml-2">entries</span>
        </div>
      </div>

      <!-- Centered Date Filters -->
      <div class="flex sm:flex-row flex-col gap-4 lg:mx-auto">
        <div>
          <label class="block font-medium text-gray-700 text-sm">Filter Tanggal:</label>
          <input
            type="date"
            v-model="filterDate"
            class="shadow-sm mt-1 p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 text-sm"
            >Filter Bulan-Tahun:</label
          >
          <input
            type="month"
            v-model="filterMonthYear"
            class="shadow-sm mt-1 p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex flex-col">
        <label class="block font-medium text-gray-700 text-sm">Search:</label>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search"
          class="shadow-sm mt-1 p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Tabel Data Transaksi -->
    <div class="bg-white shadow-md rounded-lg overflow-x-auto whitespace-nowrap">
      <!-- <table class="bg-white border border-gray-500 min-w-full"> -->
      <table class="bg-white border border-black min-w-full border-collapse">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="px-4 py-3 border border-black text-left">Kode Transaksi</th>
            <!-- <th class="px-4 py-3 border border-black text-left">Kode Produk</th> -->
            <th class="px-4 py-3 border border-black text-left">Foto</th>
            <th class="px-4 py-3 border border-black text-left">Nama</th>
            <!-- <th class="px-4 py-3 border border-black text-left">Harga</th>
            <th class="px-4 py-3 border border-black text-left">Kuantitas</th>
            <th class="px-4 py-3 border border-black text-left">Total Harga</th> -->
            <th class="px-4 py-3 border border-black text-left">Total Transaksi</th>
            <th class="px-4 py-3 border border-black text-left">Waktu</th>
            <th class="px-4 py-3 border border-black text-left">Status</th>
          </tr>
        </thead>
        <!-- <tbody class="bg-white">
          <tr
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            class="hover:bg-gray-200 transition duration-200 cursor-pointer"
            @click="goToTransactionDetail(transaction.id)"
          >
            <td class="px-4 py-3 border border-black">
              {{ transaction.transaction_code }}
            </td>
            <td class="px-4 py-3 border border-black">
              <img
                :src="
                  'http://localhost:8000/storage/' + transaction.mergedDetails[0].photo
                "
                alt="Foto Produk"
                class="rounded-md w-12 h-12"
              />
            </td>
            <td class="px-4 py-3 border border-black">
              {{ transaction.mergedDetails[0].name }}
              <div
                v-if="transaction.mergedDetails.length > 1"
                class="text-blue-500 text-xs hover:underline cursor-pointer"
              >
                <div>
                  Klik untuk lihat +{{ transaction.mergedDetails.length - 1 }} produk
                  lainnya
                </div>
              </div>
            </td>

            <td class="px-4 py-3 border border-black">
              {{ formatPrice(transaction.total_payment) }}
            </td>
            <td class="px-4 py-3 border border-black">
              {{ formatDate(transaction.transaction_date) }}
            </td>
            <td class="px-4 py-3 border border-black">
              <span :class="['font-bold', getStatusClass(transaction.status)]">
                {{ transaction.status }}
              </span>
            </td>
          </tr>
        </tbody> -->

        <tbody class="bg-white">
          <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
            <!-- Kolom TIDAK diklik -->
            <td class="px-4 py-3 border border-black">
              {{ transaction.transaction_code }}
            </td>

            <!-- Kolom foto produk -->
            <td
              class="hover:bg-gray-200 px-4 py-3 border border-black transition duration-200 cursor-pointer"
              @click="goToTransactionDetail(transaction.id)"
            >
              <img
                :src="
                  'http://localhost:8000/storage/' + transaction.mergedDetails[0].photo
                "
                alt="Foto Produk"
                class="rounded-md w-12 h-12"
              />
            </td>

            <!-- Kolom nama produk -->
            <td
              class="hover:bg-gray-200 px-4 py-3 border border-black transition duration-200 cursor-pointer"
              @click="goToTransactionDetail(transaction.id)"
            >
              {{ transaction.mergedDetails[0].name }}
              <div
                v-if="transaction.mergedDetails.length > 1"
                class="text-blue-500 text-xs hover:underline"
              >
                Klik untuk lihat +{{ transaction.mergedDetails.length - 1 }} produk
                lainnya
              </div>
            </td>

            <!-- Kolom total pembayaran -->
            <td
              class="hover:bg-gray-200 px-4 py-3 border border-black transition duration-200 cursor-pointer"
              @click="goToTransactionDetail(transaction.id)"
            >
              {{ formatPrice(transaction.total_payment) }}
            </td>

            <!-- Kolom tanggal transaksi -->
            <td
              class="hover:bg-gray-200 px-4 py-3 border border-black transition duration-200 cursor-pointer"
              @click="goToTransactionDetail(transaction.id)"
            >
              {{ formatDate(transaction.transaction_date) }}
            </td>

            <!-- Kolom status -->
            <td
              class="hover:bg-gray-200 px-4 py-3 border border-black transition duration-200 cursor-pointer"
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

    <!-- Pagination -->
    <div class="flex justify-between mt-4">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} of
        {{ filteredTransactions.length }} entries
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
</template>
