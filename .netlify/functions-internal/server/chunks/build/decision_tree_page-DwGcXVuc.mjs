import axios from 'axios';
import { useSSRContext } from 'vue';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import 'consola/core';
import 'mitt';

const _sfc_main = {
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
      if (!Array.isArray(stockList) || stockList.length === 0) return 0;
      return stockList.reduce((total, stock) => total + (stock.amount || 0), 0);
    }
  },
  data() {
    return {
      isLoading: true,
      entropyValues: {},
      gainValues: {},
      accuracy: {},
      products: {},
      decisionTree: ""
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
      const productMap = /* @__PURE__ */ new Map();
      this.sortedAccuracy.forEach((product) => {
        if (!productMap.has(product.id)) {
          productMap.set(product.id, {
            ...product,
            totalStock: product.stock
          });
        } else {
          productMap.get(product.id).totalStock += product.stock;
        }
      });
      return Array.from(productMap.values());
    },
    sortedAccuracy() {
      return Object.entries(this.accuracy).sort((a, b) => b[1] - a[1]).map(([id, accValue]) => ({
        id,
        accuracy: accValue,
        ...this.products[id]
        // Tambahkan data produk agar lebih mudah diakses
      }));
    }
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
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><div><h1 class="mb-4 text-xl font-bold">Prediksi Produk Terlaris - Algoritma C4.5</h1><div class="mt-4"><button class="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"> Hasil Prediksi </button></div><h2 class="mt-6 text-lg font-semibold">2. Decision Tree</h2>`);
  if ($data.isLoading) {
    _push(`<div class="flex items-center justify-center py-10"><div class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$data.isLoading) {
    _push(`<div><div><pre class="mt-2 border border-gray-300 bg-white p-4">${ssrInterpolate($data.decisionTree)}</pre></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analysis_pages/decision_tree_page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const decision_tree_page = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { decision_tree_page as default };
//# sourceMappingURL=decision_tree_page-DwGcXVuc.mjs.map
