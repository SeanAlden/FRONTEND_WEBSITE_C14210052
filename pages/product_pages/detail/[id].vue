<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios"; 

const route = useRoute();
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

const fallbackImage = "/assets/images/avatar.png";

definePageMeta({
  middleware: ["auth"],
});

const fetchProductDetail = async () => {
  try {
    const res = await axios.get(useApi(`/api/api/products/${route.params.id}`));
    product.value = res.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
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

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

onMounted(fetchProductDetail);
</script>

<template>
  <div class="p-6">
    <NuxtLink
      to="/product_pages/products"
      class="inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
    >
      Back
    </NuxtLink>
    <br />
    <br />
    <h1 class="mb-4 text-2xl font-bold">Detail Produk</h1>
    <div v-if="isLoading" class="text-center">Memuat...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="product" class="p-4 border rounded shadow">
      <!-- <img
        :src="
          product.photo ? useApi(`/public/storage/${product.photo}`) : fallbackImage
        "
        @error="onImageError"
        class="w-48 h-full mb-4l object-fit"
      /> -->
			<img
        :src="
          product.photo ? useApi(`/storage/${product.photo}`) : fallbackImage
        "
        @error="onImageError"
        class="w-48 h-full mb-4l object-fit"
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
      <table class="w-full mt-2 border">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2 border">Tanggal Kadaluarsa</th>
            <th class="p-2 border">Jumlah Stok</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in product.stocks" :key="stock.exp_date">
            <td class="p-2 text-center border">{{ stock.exp_date }}</td>
            <td class="p-2 text-center border">{{ stock.stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
