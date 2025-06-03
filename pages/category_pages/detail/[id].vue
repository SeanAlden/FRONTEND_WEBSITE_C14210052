<script setup>
// import { ref, onMounted } from "vue";
// import { useRoute, useRouter } from "vue-router";
// import useApi from "@/composables/useApi";

// const { getCategoryById } = useApi();
// const route = useRoute();
// const router = useRouter();

// const category = ref(null);
// const isLoading = ref(true);

// onMounted(async () => {
//   try {
//     const categoryData = await getCategoryById(route.params.id);
//     if (!categoryData) {
//       alert("Kategori tidak ditemukan.");
//       router.push("/category_pages/categories");
//       return;
//     }

//     // Proses total stok untuk setiap produk
//     categoryData.products.forEach(product => {
//       product.totalStock = product.stocks?.reduce((total, stock) => total + stock.stock, 0) || 0;
//     });

//     category.value = categoryData;
//   } catch (error) {
//     console.error("Error fetching category details:", error);
//   } finally {
//     isLoading.value = false;
//   }
// });

// import { ref, onMounted } from "vue";
// import { useRoute, useRouter } from "vue-router";
// // import useApi from "@/composables/useApi";

// definePageMeta({
//   middleware: ["auth"],
// });

// // const { getCategoryById } = useApi();
// const route = useRoute();
// const router = useRouter();

// const category = ref(null);
// const isLoading = ref(true);

// // Fungsi getCategoryById dipindah dari useApi.js
// const getCategoryById = async (id) => {
//   try {
//     const response = await fetch(useApi(`/api/categories/${id}`));
//     if (!response.ok) throw new Error("Gagal mengambil data kategori");
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching category with ID ${id}:`, error);
//     return null;
//   }
// };

// const formatPrice = (price) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(price);
// };

// onMounted(async () => {
//   try {
//     const categoryData = await getCategoryById(route.params.id);
//     if (!categoryData) {
//       alert("Kategori tidak ditemukan.");
//       router.push("/category_pages/categories");
//       return;
//     }
//     category.value = categoryData;
//   } catch (error) {
//     console.error("Error fetching category details:", error);
//   } finally {
//     isLoading.value = false;
//   }
// });

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios"; // impor axios

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();

const category = ref(null);
const isLoading = ref(true);

const fallbackImage = "/assets/images/avatar.png";

// Gunakan useApi sebagai base URL (jika sudah dikonfigurasi)
// const useApi = (path) => {
//   const baseUrl = "https://your-api-base-url.com"; // Ganti dengan base URL yang sesuai
//   return `${baseUrl}${path}`;
// };

const getCategoryById = async (id) => {
  try {
    const response = await axios.get(useApi(`/api/categories/${id}`));
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
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

onMounted(async () => {
  try {
    const categoryData = await getCategoryById(route.params.id);
    if (!categoryData) {
      alert("Kategori tidak ditemukan.");
      router.push("/category_pages/categories");
      return;
    }
    category.value = categoryData;
  } catch (error) {
    console.error("Error fetching category details:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <!-- <div class="mx-auto max-w-4xl p-6"> -->
  <!-- <NuxtLink to="/category_pages/categories" class="text-blue-500 hover:underline"> -->
  <!-- &larr; Kembali ke Daftar Kategori -->
  <!-- </NuxtLink> -->
  <!--  -->
  <!-- <div v-if="isLoading" class="mt-6 text-center text-gray-500">Loading...</div> -->
  <!--  -->
  <!-- <div v-else-if="category" class="mt-4 rounded bg-white p-6 shadow-md"> -->
  <!-- <h1 class="text-2xl font-bold">{{ category.name }}</h1> -->

  <!-- Container untuk deskripsi -->
  <!-- <div class="mt-4"> -->
  <!-- <label for="category-description" class="block font-semibold">Deskripsi</label> -->
  <!-- <textarea -->
  <!-- id="category-description" -->
  <!-- v-model="category.description" -->
  <!-- rows="4" -->
  <!-- readonly -->
  <!-- class="mt-1 w-full resize-none rounded-md border bg-gray-100 p-3 text-gray-800" -->
  <!-- ></textarea> -->
  <!-- </div> -->
  <!--  -->
  <!-- <div class="mt-6"> -->
  <!-- <h2 class="text-lg font-semibold">Produk Terkait</h2> -->
  <!-- <div v-if="category.products && category.products.length > 0"> -->
  <!-- <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> -->
  <!-- <div -->
  <!-- v-for="product in category.products" -->
  <!-- :key="product.id" -->
  <!-- class="rounded border p-4 shadow" -->
  <!-- > -->
  <!-- <img -->
  <!-- :src=" -->
  <!-- product.photo -->
  <!-- ? `http://localhost:8000/storage/${product.photo}` -->
  <!-- : '/assets/images/avatar.png' -->
  <!-- " -->
  <!-- class="h-50 w-full object-cover" -->
  <!-- /> -->
  <!-- <h3 class="mt-2 font-semibold">{{ product.name }}</h3> -->
  <!-- <p class="text-sm text-gray-600">Harga: Rp{{ product.price }}</p> -->
  <!-- <p class="text-sm text-gray-600">Total Stok: {{ product.totalStock }}</p> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- <p v-else class="mt-2 text-gray-500">Tidak ada produk terkait.</p> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div> -->

  <div class="mx-auto max-w-6xl p-6">
    <!-- <NuxtLink to="/category_pages/categories" class="text-blue-500 hover:underline"> -->
    <NuxtLink
      to="/category_pages/categories"
      class="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
    >
      Back
    </NuxtLink>

    <div v-if="isLoading" class="mt-6 text-center text-gray-500">Loading...</div>

    <div v-else-if="category" class="mt-4 rounded bg-white p-6 shadow-md">
      <h1 class="text-2xl font-bold">{{ category.name }} - ({{ category.code }})</h1>

      <div class="mt-4">
        <label for="category-description" class="block font-semibold">Deskripsi</label>
        <textarea
          id="category-description"
          v-model="category.description"
          rows="10"
          readonly
          class="mt-1 w-full resize-none rounded-md border bg-gray-100 p-3 text-gray-800"
        ></textarea>
      </div>

      <div class="mt-4">
        <h2 class="text-lg font-semibold">Produk Terkait</h2>
        <div v-if="category.products && category.products.length > 0">
          <div class="mt-4 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="product in category.products"
              :key="product.id"
              class="rounded border p-4 shadow"
            >
              <img
                :src="
                      product.photo ? useApi(`/storage/${product.photo}`) : fallbackImage
                    "
                    @error="onImageError"
                class="object-fit-contain h-40 w-full"
              />
              <h3 class="mt-2 font-semibold">{{ product.name }}</h3>
              <p class="text-sm text-gray-600">Kode: {{ product.code }}</p>
              <p class="text-sm text-gray-600">Harga: {{ formatPrice(product.price) }}</p>
              <p class="text-sm text-gray-600">Total Stok: {{ product.total_stock }}</p>
            </div>
          </div>
        </div>
        <p v-else class="mt-2 text-gray-500">Tidak ada produk terkait.</p>
      </div>
    </div>
  </div>
</template>
