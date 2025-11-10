import { ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import axios from 'axios';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'node:util';
import 'node:process';
import 'node:tty';
import 'mitt';

const _sfc_main = {
  __name: "sales_count_page",
  __ssrInlineRender: true,
  setup(__props) {
    const transactions = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const fetchData = async () => {
      try {
        const response = await axios.get(useApi("/api/api/analysis/getTransactions"));
        transactions.value = response.data.transactions.map((transaction) => {
          transaction.details.forEach((detail) => {
            detail.quantity = parseInt(detail.quantity, 10);
          });
          return transaction;
        });
      } catch (err) {
        error.value = "Gagal mengambil data, coba lagi nanti";
      } finally {
        isLoading.value = false;
      }
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const filteredProducts = computed(() => {
      return transactions.value.filter((transaction) => {
        const searchString = searchQuery.value.toLowerCase();
        return transaction.transaction_code.toLowerCase().includes(searchString) || transaction.gross_amount.toString().includes(searchString) || transaction.transaction_date.toLowerCase().includes(searchString) || transaction.details.some(
          (detail) => detail.product.name.toLowerCase().includes(searchString) || detail.quantity.toString().includes(searchString)
        );
      });
    });
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredProducts.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
    });
    const generatePagination = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const pages = [];
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", total);
      } else if (current >= total - 3) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
      return pages;
    });
    watch(itemsPerPage, () => {
      currentPage.value = 1;
      fetchData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-74743634><h1 class="mb-4 text-2xl font-bold" data-v-74743634> Proses Analisis - Bobot Waktu &amp; Penjualan Berbobot </h1><p class="mb-4" data-v-74743634> Melakukan perhitungan penjualan mentah dahulu sebelum menghitung bobot waktu </p><div class="mt-4" data-v-74743634><button class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700" data-v-74743634> Time Count </button></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-74743634><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-74743634></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-74743634><div class="flex items-center justify-between mb-4" data-v-74743634><div data-v-74743634><label class="mr-2" data-v-74743634>Show</label><select id="itemsPerPage" data-v-74743634><!--[-->`);
        ssrRenderList(itemsPerPageOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option)} data-v-74743634${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
        });
        _push(`<!--]--></select><span class="ml-2" data-v-74743634>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-74743634></div><div class="overflow-x-auto whitespace-nowrap" data-v-74743634><table class="w-full bg-white border border-collapse border-gray-300" data-v-74743634><thead data-v-74743634><tr class="bg-gray-200" data-v-74743634><th class="p-2 border" data-v-74743634>Transaction Code</th><th class="p-2 border" data-v-74743634>Gross Amount</th><th class="p-2 border" data-v-74743634>Date</th><th class="p-2 border" data-v-74743634>Product Quantities</th><th class="p-2 border" data-v-74743634>Raw Sales</th></tr></thead><tbody data-v-74743634><!--[-->`);
        ssrRenderList(paginatedProducts.value, (transaction) => {
          _push(`<tr class="border" data-v-74743634><td class="p-2 text-center border" data-v-74743634>${ssrInterpolate(transaction.transaction_code)}</td><td class="p-2 text-center border" data-v-74743634>${ssrInterpolate(formatPrice(transaction.gross_amount))}</td><td class="p-2 text-center border" data-v-74743634>${ssrInterpolate(new Date(transaction.transaction_date).toLocaleDateString())}</td><td class="p-2 border" data-v-74743634><ul data-v-74743634><!--[-->`);
          ssrRenderList(transaction.details, (detail) => {
            _push(`<li data-v-74743634>${ssrInterpolate(detail.product.name)} (${ssrInterpolate(detail.quantity)}) </li>`);
          });
          _push(`<!--]--></ul></td><td class="p-2 text-center border" data-v-74743634>${ssrInterpolate(transaction.details.reduce((sum, detail) => sum + detail.quantity, 0))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="flex justify-between mt-4" data-v-74743634><div data-v-74743634> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length))} of ${ssrInterpolate(filteredProducts.value.length)} entries </div><div class="flex items-center space-x-2" data-v-74743634><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-74743634> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-74743634>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-74743634> Next </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analysis_pages/sales_count_page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sales_count_page = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-74743634"]]);

export { sales_count_page as default };
//# sourceMappingURL=sales_count_page-BBJ-ZOet.mjs.map
