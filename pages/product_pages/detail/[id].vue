<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

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

onMounted(fetchProductDetail);
</script>

<template>
  <div class="p-6">
    <NuxtLink
      to="/product_pages/products"
      class="inline-block bg-blue-500 mb-4 px-4 py-2 rounded text-white"
    >
      Back
    </NuxtLink>
		<br>
		<br>
    <h1 class="mb-4 font-bold text-2xl">Detail Produk</h1>
    <div v-if="isLoading" class="text-center">Memuat...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="product" class="shadow p-4 border rounded">
      <img
        :src="
          product.photo
            ? `http://localhost:8000/storage/${product.photo}`
            : '/assets/images/avatar.png'
        "
        class="mb-4l w-48 h-full object-fit"
      />
			<br>
      <h2 class="font-semibold text-xl">{{ product.name }}</h2>
      <p><strong>ID:</strong> {{ product.id }}</p>
      <p><strong>Kode:</strong> {{ product.code }}</p>
      <p><strong>Kategori:</strong> {{ product.category?.name || "Tidak ada" }}</p>
      <p><strong>Harga:</strong> Rp {{ product.price }}</p>
      <p>
        <strong>Deskripsi:</strong> {{ product.description || "Tidak ada deskripsi" }}
      </p>

      <!-- Tabel Stok berdasarkan tanggal kadaluarsa -->
      <h3 class="mt-4 font-semibold text-lg">Stok per Tanggal Kadaluarsa</h3>
      <table class="mt-2 border w-full">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2 border">Tanggal Kadaluarsa</th>
            <th class="p-2 border">Jumlah Stok</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in product.stocks" :key="stock.exp_date">
            <td class="p-2 border text-center">{{ stock.exp_date }}</td>
            <td class="p-2 border text-center">{{ stock.stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
