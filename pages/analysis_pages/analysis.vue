<template>
  <div class="p-8">
    <h1 class="mb-4 text-2xl font-bold">Analisis Klasifikasi Produk (C4.5)</h1>

    <div v-if="loading" class="text-gray-500">Memuat data...</div>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error }}</div>
    <div v-else-if="!result" class="text-gray-500">Data analisis tidak ditemukan.</div>
    <div v-else>
      <section class="mb-6">
        <h2 class="mb-2 text-xl font-semibold">Dataset</h2>
        <table class="min-w-full text-sm border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 border">ID</th>
              <th class="p-2 border">Nama</th>
              <th class="p-2 border">Kategori Harga</th>
              <th class="p-2 border">Kategori Stok</th>
              <th class="p-2 border">Total Penjualan</th>
              <th class="p-2 font-bold border">Label</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in result.dataset" :key="item.id" class="hover:bg-gray-50">
              <td class="p-2 border">{{ item.id }}</td>
              <td class="p-2 border">{{ item.name }}</td>
              <td class="p-2 border">{{ item.price_cat }}</td>
              <td class="p-2 border">{{ item.stock_cat }}</td>
              <td class="p-2 border">{{ item.sales }}</td>
              <td class="p-2 font-medium border">{{ item.label }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section class="mb-6">
          <h2 class="mb-2 text-xl font-semibold">Perhitungan Awal</h2>
          <div class="p-4 bg-gray-100 rounded">
            <p>
              <strong>Entropy Total (S):</strong>
              <span class="font-mono">{{ result.entropy_total }}</span>
            </p>
            <hr class="my-2" />
            <h3 class="mt-2 mb-1 font-semibold">Gain Ratio Atribut:</h3>
            <ul class="pl-6 list-disc">
              <li v-for="(ratio, attr) in result.gain_ratio" :key="attr">
                <strong>{{ attr }}</strong
                >: <span class="font-mono">{{ ratio }}</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 class="mb-2 text-xl font-semibold">Hasil Pohon Keputusan (Decision Tree)</h2>
          <pre
            class="p-4 text-sm text-green-400 whitespace-pre-wrap bg-gray-900 rounded-lg"
          >{{ JSON.stringify(result.decision_tree, null, 2) }}</pre>
          <small class="block mt-2 text-gray-500">
            Struktur di atas merepresentasikan aturan keputusan. Baca dari atribut paling luar ke dalam.
          </small>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "../../composables/useApi";
import axios from "axios";

// const result = ref(null);
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
pre {
  line-height: 1.5;
}
</style>