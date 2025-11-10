<template>
  <!-- <div> -->
  <!-- <h1 class="mb-4 text-xl font-bold">Prediksi Produk Terlaris - Algoritma C4.5</h1> -->
  <!--  -->
  <!-- <div class="mt-4"> -->
  <!-- <button -->
  <!-- class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700" -->
  <!-- @click="$router.push('/analysis_pages/accuracy_page')" -->
  <!-- > -->
  <!-- Hasil Prediksi -->
  <!-- </button> -->
  <!-- </div> -->
  <!--  -->
  <!-- Decision Tree -->
  <!-- <h2 class="mt-6 text-lg font-semibold">2. Decision Tree</h2> -->
  <!-- <pre class="p-4 bg-white border border-gray-300">{{ decisionTree }}</pre> -->
  <!-- </div> -->
  <div>
    <!-- Content with Transition -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div>
        <h1 class="mb-4 text-xl font-bold">Prediksi Produk Terlaris - Algoritma C4.5</h1>

        <div class="mt-4">
          <button
            class="px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded hover:bg-blue-700"
            @click="$router.push('/analysis_pages/accuracy_page')"
          >
            Hasil Prediksi
          </button>
        </div>
        <h2 class="mt-6 text-lg font-semibold">2. Decision Tree</h2>

        <!-- Loading Animation -->
        <!-- <div
      v-if="isLoading"
      class="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-75"
    >
      <div
        class="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
      ></div>
    </div> -->
        <div class="flex items-center justify-center py-10" v-if="isLoading">
          <!-- <p>Loading...</p> -->
          <!-- Ganti dengan spinner jika perlu -->
          <div
            class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
          ></div>
        </div>
        <!-- Decision Tree with Staggered Animation -->
        <div v-if="!isLoading">
          <transition
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
          >
            <div>
              <pre class="p-4 mt-2 bg-white border border-gray-300">{{
                decisionTree
              }}</pre>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import axios from 'axios';
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

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
      isLoading: true,
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

  // async mounted() {
  //   try {
  //     const response = await axios.get("http://localhost:8000/api/analysis/results");
  //     this.entropyValues = response.data.entropyValues;
  //     this.gainValues = response.data.gainValues;
  //     this.accuracy = response.data.accuracy;
  //     this.products = response.data.products;
  //     this.decisionTree = response.data.decisionTree;
  //   } catch (error) {
  //     console.error("Error fetching analysis data:", error);
  //   }
  // },

  async mounted() {
    try {
      const response = await axios.get(useApi("/api/api/analysis/results"));
      this.entropyValues = response.data.entropyValues;
      this.gainValues = response.data.gainValues;
      this.accuracy = response.data.accuracy;
      this.products = response.data.products;
      this.decisionTree = response.data.decisionTree;
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style>
.container {
  max-width: 900px;
  margin: auto;
}
/* Tambahan animasi khusus jika diperlukan */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}
</style>
