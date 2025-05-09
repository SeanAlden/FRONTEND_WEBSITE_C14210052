<script setup>
import { ref, computed, onMounted } from "vue";

// Data transaksi dari API
const transactions = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Filter bulan & tahun
const selectedMonth = ref(new Date().getMonth() + 1); // Default bulan ini
const selectedYear = ref(new Date().getFullYear()); // Default tahun ini

// Daftar bulan dalam bahasa Indonesia
const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Fetch data transaksi dari API Laravel
const fetchTransactions = async () => {
  try {
    isLoading.value = true;
    const response = await fetch("http://localhost:8000/api/admin/transactions");
    if (!response.ok) throw new Error("Gagal mengambil data transaksi");

    const data = await response.json();
    transactions.value = data.transactions;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// Panggil fetch saat komponen dimuat
onMounted(fetchTransactions);

// Filter transaksi berdasarkan bulan & tahun yang dipilih
const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const date = new Date(transaction.transaction_date);
    return (
      date.getMonth() + 1 === selectedMonth.value &&
      date.getFullYear() === selectedYear.value
    );
  });
});

// **Menggabungkan produk yang sama menjadi satu baris**
const mergedTransactions = computed(() => {
  const productMap = new Map();

  filteredTransactions.value.forEach((transaction) => {
    transaction.details.forEach((detail) => {
      const product = detail.product;
      const key = `${product.name}-${product.price}`; // Unik berdasarkan nama & harga

      if (!productMap.has(key)) {
        productMap.set(key, {
          no: 0, // Akan diatur nanti
          photo: product.photo || "/default-image.png",
          name: product.name,
          price: product.price,
          sold: 0,
          totalIncome: 0,
          margin: 0,
        });
      }

      const existingProduct = productMap.get(key);
      existingProduct.sold += detail.quantity;
      existingProduct.totalIncome += product.price * detail.quantity;
      existingProduct.margin += product.price * detail.quantity * 0.25;
    });
  });

  // Konversi Map ke array & atur nomor urut
  return Array.from(productMap.values()).map((product, index) => ({
    ...product,
    no: index + 1,
  }));
});
</script>

<template>
  <!-- <div class="bg-gray-100 mx-auto p-6 max-w-5xl min-h-screen"> -->
  <div class="bg-gray-100 mx-auto p-6 container">
    <h1 class="font-bold text-3xl text-center">Toko Obat Asia Raya</h1>
    <h2 class="font-semibold text-xl text-center">Product Sales Report</h2>
    <p class="text-gray-500 text-center">
      Bulan {{ months[selectedMonth - 1] }} Tahun {{ selectedYear }}
    </p>

    <!-- Filter -->
    <div class="flex justify-center space-x-4 mt-4">
      <div>
        <label class="font-medium">Pilih Bulan:</label>
        <select v-model="selectedMonth" class="px-3 py-1 border rounded">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>
      </div>
      <div>
        <label class="font-medium">Pilih Tahun:</label>
        <input
          v-model="selectedYear"
          type="number"
          class="px-3 py-1 border rounded w-20"
        />
      </div>
    </div>

    <!-- Tabel Data -->
    <div class="bg-white shadow-md mt-6 p-4 rounded-lg overflow-x-auto whitespace-nowrap">
      <table class="w-full border-collapse">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-2 py-2 border">No</th>
            <th class="px-2 py-2 border">Photo</th>
            <th class="px-2 py-2 border">Name</th>
            <th class="px-2 py-2 border">Harga</th>
            <th class="px-2 py-2 border">Sold</th>
            <th class="px-2 py-2 border">Kas Masuk</th>
            <th class="px-2 py-2 border">Margin Penjualan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="7" class="py-4 text-gray-500 text-center">Memuat data...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="7" class="text-red-500 text-center">{{ error }}</td>
          </tr>
          <tr v-else-if="mergedTransactions.length === 0">
            <td colspan="7" class="py-4 text-gray-500 text-center">
              Tidak ada data untuk bulan ini
            </td>
          </tr>
          <tr v-else v-for="product in mergedTransactions" :key="product.no">
            <td class="px-4 py-2 border text-lg-center">{{ product.no }}</td>
            <td class="flex justify-center items-center px-0 py-2 border">
              <img
                :src="
                  product.photo
                    ? `http://localhost:8000/storage/${product.photo}`
                    : '/assets/images/avatar.png'
                "
                class="w-20 h-20 object-fit"
              />
            </td>

            <td class="px-2 py-2 border text-blue-600 hover:underline cursor-pointer">
              {{ product.name }}
            </td>
            <td class="px-2 py-2 border text-center">
              <!-- Rp {{ product.price.toLocaleString("id-ID") }} -->
              {{ formatPrice(product.price) }}
            </td>
            <td class="px-2 py-2 border text-center">{{ product.sold }}</td>
            <td class="px-2 py-2 border text-center">
              <!-- Rp {{ product.totalIncome.toLocaleString("id-ID") }} -->
              {{ formatPrice(product.totalIncome) }}
            </td>
            <td class="px-2 py-2 border text-center">
              <!-- Rp {{ product.margin.toLocaleString("id-ID") }} -->
              {{ formatPrice(product.margin) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
