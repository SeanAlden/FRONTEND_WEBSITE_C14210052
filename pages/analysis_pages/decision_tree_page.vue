<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">Prediksi Produk Terlaris - Algoritma C4.5</h1>

    <div class="mt-4">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        @click="$router.push('/analysis_pages/accuracy_page')"
      >
        Hasil Prediksi
      </button>
    </div>

    <!-- Decision Tree -->
    <h2 class="mt-6 text-lg font-semibold">2. Decision Tree</h2>
    <pre class="border border-gray-300 bg-white p-4">{{ decisionTree }}</pre>
  </div>
</template>

<script>
// import axios from 'axios';
import axios from "axios";

export default {
//   data() {
//     return {
//       entropyValues: {},
//       gainValues: {},
//       decisionTree: '',
//       accuracy: {},
//       products: {}
//     };
//   },
//   mounted() {
//     this.fetchData();
//   },
//   methods: {
//     async fetchData() {
//       try {
//         const response = await axios.get('http://localhost:8000/api/analysis/results');
//         this.entropyValues = response.data.entropyValues;
//         this.gainValues = response.data.gainValues;
//         this.decisionTree = response.data.decisionTree;
//         this.accuracy = response.data.accuracy;
//         this.products = response.data.products;
//       } catch (error) {
//         console.error('Error fetching analysis data:', error);
//       }
//     }
//   }
// };

  // methods: {
  //   totalStock(stockList) {
  //     if (!Array.isArray(stockList)) return stockList; // Jika bukan array, tampilkan apa adanya
  //     return stockList.reduce((total, item) => total + item.stock, 0);
  //   },
  // },

  methods: {
    totalStock(stockList) {
      if (!Array.isArray(stockList) || stockList.length === 0) return 0; // Jika kosong, return 0
      return stockList.reduce((total, stock) => total + (stock.amount || 0), 0);
    },
  },

  data() {
    return {
      entropyValues: {},
      gainValues: {},
      accuracy: {},
      products: {},
      decisionTree: "",
    };
  },
  computed: {
    // sortedAccuracy() {
    //   return Object.entries(this.accuracy)
    //     .sort((a, b) => b[1] - a[1]) // Urut dari akurasi tertinggi ke terendah
    //     .reduce((acc, [id, accValue]) => {
    //       acc[id] = accValue;
    //       return acc;
    //     }, {});
    // },
  },

  computed: {
    mergedProducts() {
      const productMap = new Map();

      this.sortedAccuracy.forEach((product) => {
        if (!productMap.has(product.id)) {
          productMap.set(product.id, {
            ...product,
            totalStock: product.stock,
          });
        } else {
          productMap.get(product.id).totalStock += product.stock;
        }
      });

      return Array.from(productMap.values());
    },
    sortedAccuracy() {
      return Object.entries(this.accuracy)
        .sort((a, b) => b[1] - a[1]) // Urutkan dari akurasi tertinggi ke terendah
        .map(([id, accValue]) => ({
          id,
          accuracy: accValue,
          ...this.products[id], // Tambahkan data produk agar lebih mudah diakses
        }));
    },
  },

  async mounted() {
    try {
      const response = await axios.get("http://localhost:8000/api/analysis/results");
      this.entropyValues = response.data.entropyValues;
      this.gainValues = response.data.gainValues;
      this.accuracy = response.data.accuracy;
      this.products = response.data.products;
      this.decisionTree = response.data.decisionTree;
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  },
};
</script>

<style>
.container {
  max-width: 900px;
  margin: auto;
}
</style>
