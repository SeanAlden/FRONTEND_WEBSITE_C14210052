<template>
  <div class="p-8">
    <h1 class="mb-4 text-2xl font-bold">Analisis Klasifikasi Produk</h1>

    <div v-if="loading" class="text-gray-500">Memuat data...</div>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error }}</div>
    <div v-else>
      <section class="mb-6">
        <h2 class="mb-2 text-xl font-semibold">Dataset</h2>
        <table class="min-w-full border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 border">ID</th>
              <th class="p-2 border">Nama</th>
              <th class="p-2 border">Harga</th>
              <th class="p-2 border">Stok</th>
              <th class="p-2 border">Penjualan</th>
              <th class="p-2 border">Label</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in result.dataset" :key="item.id" class="hover:bg-gray-50">
              <td class="p-2 border">{{ item.id }}</td>
              <td class="p-2 border">{{ item.name }}</td>
              <td class="p-2 border">{{ item.price_cat }}</td>
              <td class="p-2 border">{{ item.stock_cat }}</td>
              <td class="p-2 border">{{ item.sales }}</td>
              <td class="p-2 border">{{ item.label }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="mb-6">
        <h2 class="mb-2 text-xl font-semibold">Entropy Total</h2>
        <p class="p-2 bg-gray-100 rounded">{{ result.entropy_total }}</p>
      </section>

      <section class="mb-6">
        <h2 class="mb-2 text-xl font-semibold">Information Gain</h2>
        <ul class="pl-6 list-disc">
          <li v-for="(gain, attr) in result.information_gain" :key="attr">
            <strong>{{ attr }}</strong
            >: {{ gain }}
          </li>
        </ul>
      </section>

      <section>
        <h2 class="mb-2 text-xl font-semibold">Decision Tree</h2>
        <pre class="p-4 text-green-400 whitespace-pre-wrap bg-gray-900 rounded">{{
          result.decision_tree
        }}</pre>
      </section>
    </div>
  </div>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
// import { useFetch } from '#app'
// import { useApi } from '../../composables/useApi';
// import axios from 'axios';

// const result = ref(null)
// const loading = ref(true)
// const error = ref(null)

// onMounted(async () => {
//   try {
//     const { data, error: fetchError } = await axios.get(useApi('/api/analysis/classify-products'))

//     if (fetchError.value) {
//       throw new Error(fetchError.value.message || 'Gagal memuat data')
//     }

//     result.value = data.value
//   } catch (err) {
//     error.value = err.message
//   } finally {
//     loading.value = false
//   }
// })

import { ref, onMounted } from "vue";
import { useApi } from "../../composables/useApi";
import axios from "axios";

const result = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get(useApi("/api/analysis/classify-products"));
    result.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Terjadi kesalahan";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
