<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

definePageMeta({
  middleware: ["auth"],
});

const fetchProductDetail = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/products/${route.params.id}`);
    if (!res.ok) throw new Error("Gagal mengambil data produk");
    const data = await res.json();
    product.value = data.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

onMounted(fetchProductDetail);
</script>

<template>
  <div class="p-6">
    <NuxtLink
      to="/product_pages/products"
      class="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
    >
      Back
    </NuxtLink>
    <br />
    <br />
    <h1 class="mb-4 text-2xl font-bold">Detail Produk</h1>
    <div v-if="isLoading" class="text-center">Memuat...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="product" class="rounded border p-4 shadow">
      <img
        :src="
          product.photo
            ? `http://localhost:8000/storage/${product.photo}`
            : '/assets/images/avatar.png'
        "
        class="mb-4l object-fit h-full w-48"
      />
      <br />
      <h2 class="text-xl font-semibold">{{ product.name }}</h2>
      <p><strong>Kode:</strong> {{ product.code }}</p>
      <p><strong>Kategori:</strong> {{ product.category?.name || "Tidak ada" }}</p>
      <p><strong>Harga:</strong> {{ formatPrice(product.price) }}</p>
      <p>
        <strong>Deskripsi:</strong>
      </p>
      <p class="whitespace-pre-line">
        {{ product.description || "Tidak ada deskripsi" }}
      </p>

      <!-- Tabel Stok berdasarkan tanggal kadaluarsa -->
      <h3 class="mt-4 text-lg font-semibold">Stok per Tanggal Kadaluarsa</h3>
      <table class="mt-2 w-full border">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">Tanggal Kadaluarsa</th>
            <th class="border p-2">Jumlah Stok</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in product.stocks" :key="stock.exp_date">
            <td class="border p-2 text-center">{{ stock.exp_date }}</td>
            <td class="border p-2 text-center">{{ stock.stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
