<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const transactionId = route.params.id;

const transaction = ref(null);
const products = ref([]);
const statusHistories = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showStatusModal = ref(false);

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
    const response = await axios.get(
      `http://localhost:8000/api/admin/transactions/${transactionId}`
    );
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
  <div class="mx-auto max-w-6xl p-6">
    <button
      @click="goBack"
      class="mb-6 flex items-center rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
    >
      Kembali
    </button>

    <div v-if="isLoading" class="text-center text-gray-500">Memuat...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <h1 class="mb-8 text-3xl font-bold">
        Detail Transaksi ({{ transaction.transaction_code }})
      </h1>
      <!-- Informasi Transaksi -->
      <div class="mb-10 rounded-lg bg-white p-6 shadow-md">
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
      <div class="mb-10 rounded-lg bg-white p-6 shadow-md">
        <div class="mb-4 flex items-center justify-between">
          <!-- <h2 class="text-2xl font-semibold">
              Riwayat Status: <span class="text-blue-500">{{ latestStatus() }}</span>
          </h2> -->
          <h2 class="text-2xl font-semibold">
            <span class="font-bold">Riwayat Status: </span>
            <span :class="getStatusClass(latestStatus())">{{ latestStatus() }}</span>
          </h2>
          <button
            @click="showStatusModal = true"
            class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Lihat Detail
          </button>
        </div>
        <!-- <p class="text-gray-500">Klik tombol untuk melihat detail riwayat status.</p> -->
      </div>

      <!-- Produk dalam Transaksi -->
      <h5 class="mb-8 text-3xl font-bold">Produk</h5>
      <div class="mb-10 rounded-lg bg-white p-6 shadow-md">
        <div v-if="products.length">
          <div class="overflow-x-auto">
            <table class="min-w-full border text-left">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border px-4 py-3">Foto</th>
                  <th class="border px-4 py-3">Nama Produk</th>
                  <th class="border px-4 py-3">Kode Produk</th>
                  <th class="border px-4 py-3">Harga</th>
                  <th class="border px-4 py-3">Expired Date</th>
                  <th class="border px-4 py-3">Jumlah</th>
                  <th class="border px-4 py-3">Stock Sebelum</th>
                  <th class="border px-4 py-3">Stock Setelah</th>
                  <th class="border px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in products"
                  :key="product.id"
                  class="hover:bg-gray-50"
                >
                  <td class="border px-4 py-3">
                    <img
                      v-if="product.product_photo"
                      :src="`http://localhost:8000/storage/${product.product_photo}`"
                      class="h-16 w-16 rounded object-cover"
                    />
                    <span v-else>-</span>
                  </td>
                  <td class="border px-4 py-3">{{ product.product_name }}</td>
                  <td class="border px-4 py-3">{{ product.product_code }}</td>
                  <td class="border px-4 py-3">
                    {{ formatPrice(product.product_price) }}
                  </td>
                  <td class="border px-4 py-3">{{ product.exp_date }}</td>
                  <td class="border px-4 py-3">{{ product.quantity }}</td>
                  <td class="border px-4 py-3">{{ product.stock_before }}</td>
                  <td class="border px-4 py-3">{{ product.stock_after }}</td>
                  <td class="border px-4 py-3">{{ formatPrice(product.quantity * product.product_price) }}</td>
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
      <div class="mb-10 rounded-lg bg-white p-6 shadow-md">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-semibold">
            {{ transaction.shipping_method }}
          </h2>
        </div>
        <p class="text-gray-500">{{ transaction.shipping_time }}</p>
      </div>

      <h3 class="mb-8 text-3xl font-bold">Rincian Belanja</h3>
      <div class="mb-10 rounded-lg bg-white p-6 shadow-md">
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
        <div class="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
          <button @click="showStatusModal = false" class="absolute right-4 top-4 text-2xl text-gray-500 hover:text-black">&times;</button>
          <h3 class="mb-6 text-xl font-semibold">Timeline Riwayat Status</h3>
          <div class="relative border-l-2 border-blue-500 pl-6">
            <div v-for="(history, index) in statusHistories" :key="index" class="mb-8">
              <div class="absolute -left-2 top-1 h-4 w-4 rounded-full bg-blue-500"></div>
              <p class="text-lg font-semibold">{{ history.status }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(history.changed_at) }}</p>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Modal Timeline -->
      <!-- Modal Timeline -->
      <!-- Modal Timeline -->
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
            class="absolute right-4 top-4 text-2xl text-gray-500 hover:text-black"
          >
            &times;
          </button>

          <h3 class="mb-6 text-xl font-semibold">Timeline Riwayat Status</h3>

          <!-- Kotak Status Terakhir (Sticky) -->
          <div
            v-if="statusHistories.length"
            class="sticky top-0 z-10 mb-8 rounded-lg bg-blue-100 px-4 py-3 text-blue-800"
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
              class="relative mb-10 pl-8"
            >
              <!-- Lingkaran -->
              <div class="absolute -left-0 top-0 h-4 w-4 rounded-full bg-blue-500"></div>

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
/* Jika mau efek fade untuk modal */
</style>
