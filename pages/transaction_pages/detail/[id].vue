<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const transactionId = route.params.id;

const transaction = ref(null);
const products = ref([]);
const statusHistories = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showStatusModal = ref(false);
const token = useCookie("my_auth_token");

const fallbackImage = "/assets/images/avatar.png";

// // Fungsi untuk mengekspor ke PDF
// const exportToPDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(12);
//   // Menambahkan judul
//   doc.text("Detail Transaksi", 14, 16);
//   doc.text(`Kode Transaksi: ${transaction.value.transaction_code}`, 14, 24);
//   doc.text(`Waktu Transaksi: ${formatDate(transaction.value.transaction_date)}`, 14, 32);
//   doc.text(`Karyawan: ${transaction.value.user_name}`, 14, 40);

//   // Menambahkan header tabel
//   const headers = [
//     "Foto",
//     "Nama Produk",
//     "Kode Produk",
//     "Harga",
//     "Expired Date",
//     "Jumlah",
//     "Stock Sebelum",
//     "Stock Setelah",
//     "Total",
//   ];
//   const data = products.value.map((product) => [
//     product.product_photo
//       ? `http://localhost:8000/storage/${product.product_photo}`
//       : "-",
//     product.product_name,
//     product.product_code,
//     formatPrice(product.product_price),
//     product.exp_date,
//     product.quantity,
//     product.stock_before,
//     product.stock_after,
//     formatPrice(product.quantity * product.product_price),
//   ]);
//   // Menambahkan header dan data ke PDF
//   doc.autoTable({
//     head: [headers],
//     body: data,
//   });
//   // Menyimpan PDF
//   doc.save("detail_transaksi.pdf");
// };

// // Fungsi untuk mengekspor ke Excel
// const exportToExcel = () => {
//   const data = products.value.map((product) => ({
//     Foto: product.product_photo
//       ? `http://localhost:8000/storage/${product.product_photo}`
//       : "-",
//     "Nama Produk": product.product_name,
//     "Kode Produk": product.product_code,
//     Harga: formatPrice(product.product_price),
//     "Expired Date": product.exp_date,
//     Jumlah: product.quantity,
//     "Stock Sebelum": product.stock_before,
//     "Stock Setelah": product.stock_after,
//     Total: formatPrice(product.quantity * product.product_price),
//   }));
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Detail Transaksi");
//   // Menyimpan file Excel
//   XLSX.writeFile(workbook, `detail_transaksi_${transaction_code}.xlsx`);
// };

// // Fungsi untuk mengekspor ke PDF
// const exportToPDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(12);

//   // Menambahkan judul
//   doc.text("Detail Transaksi", 14, 16);
//   doc.text(`Kode Transaksi: ${transaction.value.transaction_code}`, 14, 24);
//   doc.text(`Waktu Transaksi: ${formatDate(transaction.value.transaction_date)}`, 14, 32);
//   doc.text(`Karyawan: ${transaction.value.user_name}`, 14, 40);

//   // Menambahkan header tabel
//   const headers = ["Foto", "Nama Produk", "Kode Produk", "Harga", "Expired Date", "Jumlah", "Stock Sebelum", "Stock Setelah", "Total"];
//   const data = products.value.map((product) => [
//     product.product_photo ? `http://localhost:8000/storage/${product.product_photo}` : "-",
//     product.product_name,
//     product.product_code,
//     formatPrice(product.product_price),
//     product.exp_date,
//     product.quantity,
//     product.stock_before,
//     product.stock_after,
//     formatPrice(product.quantity * product.product_price),
//   ]);

//   // Menambahkan header dan data ke PDF
//   doc.autoTable({
//     head: [headers],
//     body: data,
//   });

//   // Menyimpan PDF dengan nama file yang mencakup kode transaksi
//   doc.save(`detail_transaksi_${transaction.value.transaction_code}.pdf`);
// };

// // Fungsi untuk mengekspor ke Excel
// const exportToExcel = () => {
//   const data = products.value.map((product) => ({
//     "Foto": product.product_photo ? `http://localhost:8000/storage/${product.product_photo}` : "-",
//     "Nama Produk": product.product_name,
//     "Kode Produk": product.product_code,
//     "Harga": formatPrice(product.product_price),
//     "Expired Date": product.exp_date,
//     "Jumlah": product.quantity,
//     "Stock Sebelum": product.stock_before,
//     "Stock Setelah": product.stock_after,
//     "Total": formatPrice(product.quantity * product.product_price),
//   }));

//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Detail Transaksi");

//   // Menyimpan file Excel dengan nama file yang mencakup kode transaksi
//   XLSX.writeFile(workbook, `detail_transaksi_${transaction.value.transaction_code}.xlsx`);
// };

// Fungsi untuk mengekspor ke PDF
// const exportToPDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(12);

//   // Menambahkan judul
//   doc.text("Detail Transaksi", 14, 16);
//   doc.text(`Kode Transaksi: ${transaction.value.transaction_code}`, 14, 24);
//   doc.text(`Waktu Transaksi: ${formatDate(transaction.value.transaction_date)}`, 14, 32);
//   doc.text(`Karyawan: ${transaction.value.user_name}`, 14, 40);
//   doc.text(`Total Biaya Produk: ${formatPrice(transaction.value.gross_amount)}`, 14, 48);
//   doc.text(`Total Biaya Transaksi: ${formatPrice(transaction.value.total_payment)}`, 14, 56);

//   // Menambahkan header tabel
//   const headers = ["Foto", "Nama Produk", "Kode Produk", "Harga", "Expired Date", "Jumlah", "Stock Sebelum", "Stock Setelah", "Total"];
//   const data = products.value.map((product) => [
//     product.product_photo ? `http://localhost:8000/storage/${product.product_photo}` : "-",
//     product.product_name,
//     product.product_code,
//     formatPrice(product.product_price),
//     product.exp_date,
//     product.quantity,
//     product.stock_before,
//     product.stock_after,
//     formatPrice(product.quantity * product.product_price),
//   ]);

//   // Menambahkan header dan data ke PDF
//   doc.autoTable({
//     head: [headers],
//     body: data,
//   });

//   // Menyimpan PDF dengan nama file yang mencakup kode transaksi
//   doc.save(`detail_transaksi_${transaction.value.transaction_code}.pdf`);
// };

const exportToPDF = () => {
  const doc = new jsPDF();

  // Judul
  doc.setFontSize(16);
  doc.text("Detail Transaksi", 14, 15);

  // Ringkasan Transaksi
  const summary = [
    ["Kode Transaksi", transaction.value.transaction_code],
    ["Tanggal", formatDate(transaction.value.transaction_date)],
    ["Karyawan", transaction.value.user_name],
    ["Metode Pembayaran", transaction.value.payment_method],
    ["Metode Pengiriman", transaction.value.shipping_method],
    ["Biaya Pengiriman", formatPrice(transaction.value.shipping_cost)],
    ["Total Biaya Produk", formatPrice(transaction.value.gross_amount)],
    ["Total Biaya Transaksi", formatPrice(transaction.value.total_payment)],
  ];

  autoTable(doc, {
    startY: 20,
    head: [["Informasi", "Nilai"]],
    body: summary,
  });

  // Detail Produk
  const productData = products.value.map((product) => [
    product.product_name,
    product.product_code,
    formatPrice(product.product_price),
    product.exp_date,
    product.quantity,
    product.stock_before,
    product.stock_after,
    formatPrice(product.quantity * product.product_price),
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [
      [
        "Nama Produk",
        "Kode Produk",
        "Harga",
        "Expired Date",
        "Jumlah",
        "Stock Sebelum",
        "Stock Setelah",
        "Total",
      ],
    ],
    body: productData,
  });

  // Simpan file
  doc.save(`detail_transaksi_${transaction.value.transaction_code}.pdf`);
};

// Fungsi untuk mengekspor ke Excel
const exportToExcel = () => {
  const data = products.value.map((product) => ({
    Foto: product.product_photo ? useApi(`/public/storage/${product.product_photo}`) : "-",
    "Nama Produk": product.product_name,
    "Kode Produk": product.product_code,
    Harga: formatPrice(product.product_price),
    "Expired Date": product.exp_date,
    Jumlah: product.quantity,
    "Stock Sebelum": product.stock_before,
    "Stock Setelah": product.stock_after,
    Total: formatPrice(product.quantity * product.product_price),
  }));

  // Menambahkan informasi total biaya produk dan total biaya transaksi
  const summary = [
    {
      "Total Biaya Produk": formatPrice(transaction.value.gross_amount),
      "Total Biaya Transaksi": formatPrice(transaction.value.total_payment),
      "Waktu Transaksi": formatDate(transaction.value.transaction_date),
      "Metode Pengiriman": transaction.value.shipping_method,
      "Biaya Pengiriman": formatPrice(transaction.value.shipping_cost),
      "Metode Pembayaran": transaction.value.payment_method,
      Karyawan: transaction.value.user_name,
    },
  ];

  // Menggabungkan data produk dan ringkasan
  const worksheet = XLSX.utils.json_to_sheet(data);
  const summarySheet = XLSX.utils.json_to_sheet(summary);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");
  XLSX.utils.book_append_sheet(workbook, worksheet, "Detail Transaksi");

  // Menyimpan file Excel dengan nama file yang mencakup kode transaksi
  XLSX.writeFile(workbook, `detail_transaksi_${transaction.value.transaction_code}.xlsx`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(date.getHours());
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Filter produk dengan quantity > 0
const filteredProducts = computed(() =>
  props.products.filter((product) => product.quantity > 0)
);

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

onMounted(async () => {
  try {
    const response = await axios.get(useApi(`/api/transactions/${transactionId}`), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    transaction.value = response.data.transaction;
    products.value = response.data.products;
    statusHistories.value = response.data.status_histories;
  } catch (err) {
    console.error(err);
    error.value = "Gagal memuat detail transaksi.";
  } finally {
    isLoading.value = false;
  }
});

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

const goBack = () => {
  router.back();
};

const latestStatus = () => {
  if (statusHistories.value.length) {
    return statusHistories.value[statusHistories.value.length - 1].status;
  }
  return "-";
};
</script>

<template>
  <div class="max-w-6xl p-6 mx-auto">
    <button
      @click="goBack"
      class="flex items-center px-6 py-2 mb-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
    >
      Kembali
    </button>

    <div v-if="isLoading" class="text-center text-gray-500">Memuat...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <h1 class="mb-8 text-3xl font-bold">
        Detail Transaksi ({{ transaction.transaction_code }})
      </h1>
      <div class="flex justify-end mb-4">
        <button
          @click="exportToPDF"
          class="px-4 py-2 mr-2 text-white bg-blue-500 rounded"
        >
          Ekspor ke PDF
        </button>
        <button @click="exportToExcel" class="px-4 py-2 text-white bg-green-500 rounded">
          Ekspor ke Excel
        </button>
      </div>

      <!-- Informasi Transaksi -->
      <div class="p-6 mb-10 bg-white rounded-lg shadow-md">
        <div class="gap-4">
          <div><strong>Kode Transaksi:</strong> {{ transaction.transaction_code }}</div>
          <div>
            <strong>Waktu Transaksi:</strong>
            {{ formatDate(transaction.transaction_date) }}
          </div>
          <div><strong>Karyawan:</strong> {{ transaction.user_name }}</div>
        </div>
      </div>

      <!-- Riwayat Status -->
      <div class="p-6 mb-10 bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <!-- <h2 class="text-2xl font-semibold">
              Riwayat Status: <span class="text-blue-500">{{ latestStatus() }}</span>
          </h2> -->
          <h2 class="text-2xl font-semibold">
            <span class="font-bold">Riwayat Status: </span>
            <span :class="getStatusClass(latestStatus())">{{ latestStatus() }}</span>
          </h2>
          <button
            @click="showStatusModal = true"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Lihat Detail
          </button>
        </div>
        <!-- <p class="text-gray-500">Klik tombol untuk melihat detail riwayat status.</p> -->
      </div>

      <!-- Produk dalam Transaksi -->
      <h5 class="mb-8 text-3xl font-bold">Produk</h5>
      <div class="p-6 mb-10 bg-white rounded-lg shadow-md">
        <div v-if="products.length">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left border">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-3 border">Foto</th>
                  <th class="px-4 py-3 border">Nama Produk</th>
                  <th class="px-4 py-3 border">Kode Produk</th>
                  <th class="px-4 py-3 border">Harga</th>
                  <th class="px-4 py-3 border">Expired Date</th>
                  <th class="px-4 py-3 border">Jumlah</th>
                  <th class="px-4 py-3 border">Stock Sebelum</th>
                  <th class="px-4 py-3 border">Stock Setelah</th>
                  <th class="px-4 py-3 border">Total</th>
                </tr>
              </thead>
              <tbody>
                <!-- <tr
                  v-for="product in products"
                  :key="product.id"
                  class="hover:bg-gray-50"
                > -->
                <tr
                  v-for="product in products.filter((p) => p.quantity > 0)"
                  :key="product.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3 border">
                    <img
                      :src="
                        product.product_photo
                          ? useApi(`/public/storage/${product.product_photo}`)
                          : fallbackImage
                      "
                      @error="onImageError"
                      alt="Foto Produk"
                      class="object-cover w-16 h-16 rounded"
                    />
                    <!-- <img
                      v-if="product.product_photo"
                      :src="useApi(`/storage/${product.product_photo}`)"
                      class="object-cover w-16 h-16 rounded"
                    /> -->
                    <!-- <span v-else>-</span> -->
                  </td>
                  <td class="px-4 py-3 border">{{ product.product_name }}</td>
                  <td class="px-4 py-3 border">{{ product.product_code }}</td>
                  <td class="px-4 py-3 border">
                    {{ formatPrice(product.product_price) }}
                  </td>
                  <td class="px-4 py-3 border">{{ product.exp_date }}</td>
                  <td class="px-4 py-3 border">{{ product.quantity }}</td>
                  <td class="px-4 py-3 border">{{ product.stock_before }}</td>
                  <td class="px-4 py-3 border">{{ product.stock_after }}</td>
                  <td class="px-4 py-3 border">
                    {{ formatPrice(product.quantity * product.product_price) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else>
          <p>Produk tidak ditemukan.</p>
        </div>
      </div>

      <h3 class="mb-8 text-3xl font-bold">Metode Pengiriman</h3>
      <div class="p-6 mb-10 bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">
            {{ transaction.shipping_method }}
          </h2>
        </div>
        <p class="text-gray-500">{{ transaction.shipping_time }}</p>
      </div>

      <h3 class="mb-8 text-3xl font-bold">Rincian Belanja</h3>
      <div class="p-6 mb-10 bg-white rounded-lg shadow-md">
        <div class="gap-4">
          <div><strong>Metode Pembayaran:</strong> {{ transaction.payment_method }}</div>
          <br />
          <div><strong>Daftar Biaya</strong></div>
          Total Biaya Produk : {{ formatPrice(transaction.gross_amount) }}
          <div>Biaya Pengiriman : {{ formatPrice(transaction.shipping_cost) }}</div>
          <div>
            <div>--------------------------------------- +</div>
            <strong>Total Pembayaran :</strong>
            {{ formatPrice(transaction.total_payment) }}
          </div>
        </div>
      </div>

      <!-- Modal Timeline -->
      <!-- <div v-if="showStatusModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
          <button @click="showStatusModal = false" class="absolute text-2xl text-gray-500 right-4 top-4 hover:text-black">&times;</button>
          <h3 class="mb-6 text-xl font-semibold">Timeline Riwayat Status</h3>
          <div class="relative pl-6 border-l-2 border-blue-500">
            <div v-for="(history, index) in statusHistories" :key="index" class="mb-8">
              <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-1"></div>
              <p class="text-lg font-semibold">{{ history.status }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(history.changed_at) }}</p>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Modal Timeline -->
      <div
        v-if="showStatusModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div
          class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
        >
          <button
            @click="showStatusModal = false"
            class="absolute text-2xl text-gray-500 right-4 top-4 hover:text-black"
          >
            &times;
          </button>

          <h3 class="mb-6 text-xl font-semibold">Timeline Riwayat Status</h3>

          <!-- Kotak Status Terakhir (Sticky) -->
          <div
            v-if="statusHistories.length"
            class="sticky top-0 z-10 px-4 py-3 mb-8 text-blue-800 bg-blue-100 rounded-lg"
          >
            <p class="text-sm">Status Terakhir:</p>
            <!-- <p class="text-lg font-bold">
              {{ statusHistories[statusHistories.length - 1].status }}
            </p> -->
            <p
              class="text-lg font-bold"
              :class="getStatusClass(statusHistories[statusHistories.length - 1].status)"
            >
              {{ statusHistories[statusHistories.length - 1].status }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatDate(statusHistories[statusHistories.length - 1].changed_at) }}
            </p>
          </div>

          <!-- Timeline Scrollable -->
          <div class="relative ml-4">
            <div
              class="absolute left-2 top-0 h-full w-0.5 border-l-2 border-dashed border-blue-400"
            ></div>
            <!-- Garis putus-putus -->

            <div
              v-for="(history, index) in [...statusHistories].reverse()"
              :key="index"
              class="relative pl-8 mb-10"
            >
              <!-- Lingkaran -->
              <div class="absolute top-0 w-4 h-4 bg-blue-500 rounded-full -left-0"></div>

              <!-- Konten Status -->
              <p class="text-lg font-semibold">{{ history.status }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(history.changed_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
