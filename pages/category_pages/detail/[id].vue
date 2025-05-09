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

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useApi from "@/composables/useApi";

const { getCategoryById } = useApi();
const route = useRoute();
const router = useRouter();

const category = ref(null);
const isLoading = ref(true);

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
  <!-- <div class="mx-auto p-6 max-w-4xl"> -->
  <!-- <NuxtLink to="/category_pages/categories" class="text-blue-500 hover:underline"> -->
  <!-- &larr; Kembali ke Daftar Kategori -->
  <!-- </NuxtLink> -->
  <!--  -->
  <!-- <div v-if="isLoading" class="mt-6 text-gray-500 text-center">Loading...</div> -->
  <!--  -->
  <!-- <div v-else-if="category" class="bg-white shadow-md mt-4 p-6 rounded"> -->
  <!-- <h1 class="font-bold text-2xl">{{ category.name }}</h1> -->

  <!-- Container untuk deskripsi -->
  <!-- <div class="mt-4"> -->
  <!-- <label for="category-description" class="block font-semibold">Deskripsi</label> -->
  <!-- <textarea -->
  <!-- id="category-description" -->
  <!-- v-model="category.description" -->
  <!-- rows="4" -->
  <!-- readonly -->
  <!-- class="bg-gray-100 mt-1 p-3 border rounded-md w-full text-gray-800 resize-none" -->
  <!-- ></textarea> -->
  <!-- </div> -->
  <!--  -->
  <!-- <div class="mt-6"> -->
  <!-- <h2 class="font-semibold text-lg">Produk Terkait</h2> -->
  <!-- <div v-if="category.products && category.products.length > 0"> -->
  <!-- <div class="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4"> -->
  <!-- <div -->
  <!-- v-for="product in category.products" -->
  <!-- :key="product.id" -->
  <!-- class="shadow p-4 border rounded" -->
  <!-- > -->
  <!-- <img -->
  <!-- :src=" -->
  <!-- product.photo -->
  <!-- ? `http://localhost:8000/storage/${product.photo}` -->
  <!-- : '/assets/images/avatar.png' -->
  <!-- " -->
  <!-- class="w-full h-50 object-cover" -->
  <!-- /> -->
  <!-- <h3 class="mt-2 font-semibold">{{ product.name }}</h3> -->
  <!-- <p class="text-gray-600 text-sm">Harga: Rp{{ product.price }}</p> -->
  <!-- <p class="text-gray-600 text-sm">Total Stok: {{ product.totalStock }}</p> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- <p v-else class="mt-2 text-gray-500">Tidak ada produk terkait.</p> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div> -->

  <div class="mx-auto p-6 max-w-4xl">
    <!-- <NuxtLink to="/category_pages/categories" class="text-blue-500 hover:underline"> -->
    <NuxtLink
      to="/category_pages/categories"
      class="inline-block bg-blue-500 mb-4 px-4 py-2 rounded text-white"
    >
      Back
    </NuxtLink>

    <div v-if="isLoading" class="mt-6 text-gray-500 text-center">Loading...</div>

    <div v-else-if="category" class="bg-white shadow-md mt-4 p-6 rounded">
      <h1 class="font-bold text-2xl">{{ category.name }} - ({{ category.code }})</h1>

      <div class="mt-4">
        <label for="category-description" class="block font-semibold">Deskripsi</label>
        <textarea
          id="category-description"
          v-model="category.description"
          rows="15"
          readonly
          class="bg-gray-100 mt-1 p-3 border rounded-md w-full text-gray-800 resize-none"
        ></textarea>
      </div>

      <div class="mt-4">
        <h2 class="font-semibold text-lg">Produk Terkait</h2>
        <div v-if="category.products && category.products.length > 0">
          <div class="gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            <div
              v-for="product in category.products"
              :key="product.id"
              class="shadow p-4 border rounded"
            >
              <img
                :src="
                  product.photo
                    ? `http://localhost:8000/storage/${product.photo}`
                    : '/assets/images/avatar.png'
                "
                class="w-full h-40 object-fit-contain"
              />
              <h3 class="mt-2 font-semibold">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm">Kode: {{ product.code }}</p>
              <p class="text-gray-600 text-sm">Harga: Rp{{ product.price }}</p>
              <p class="text-gray-600 text-sm">Total Stok: {{ product.total_stock }}</p>
            </div>
          </div>
        </div>
        <p v-else class="mt-2 text-gray-500">Tidak ada produk terkait.</p>
      </div>
    </div>
  </div>
</template>
