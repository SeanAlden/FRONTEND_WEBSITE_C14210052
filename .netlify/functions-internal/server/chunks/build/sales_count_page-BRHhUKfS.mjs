import { ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import axios from 'axios';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
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
        const response = await axios.get(useApi("/api/analysis/getTransactions"));
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
        return transaction.id.toString().includes(searchString) || transaction.gross_amount.toString().includes(searchString) || transaction.transaction_date.toLowerCase().includes(searchString) || transaction.details.some(
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-6" }, _attrs))} data-v-edaeeaa2><h1 class="mb-4 text-2xl font-bold" data-v-edaeeaa2> Proses Analisis - Bobot Waktu &amp; Penjualan Berbobot </h1><p class="mb-4" data-v-edaeeaa2> Melakukan perhitungan penjualan mentah dahulu sebelum menghitung bobot waktu </p><div class="mt-4" data-v-edaeeaa2><button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700" data-v-edaeeaa2> Time Count </button></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-edaeeaa2><div class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear" data-v-edaeeaa2></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-edaeeaa2><div class="mb-4 flex items-center justify-between" data-v-edaeeaa2><div data-v-edaeeaa2><label class="mr-2" data-v-edaeeaa2>Show</label><select id="itemsPerPage" data-v-edaeeaa2><!--[-->`);
        ssrRenderList(itemsPerPageOptions, (option) => {
          _push(`<option${ssrRenderAttr("value", option)} data-v-edaeeaa2${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
        });
        _push(`<!--]--></select><span class="ml-2" data-v-edaeeaa2>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="rounded border p-2" data-v-edaeeaa2></div><div class="overflow-x-auto whitespace-nowrap" data-v-edaeeaa2><table class="w-full border-collapse border border-gray-300 bg-white" data-v-edaeeaa2><thead data-v-edaeeaa2><tr class="bg-gray-200" data-v-edaeeaa2><th class="border p-2" data-v-edaeeaa2>Transaction Code</th><th class="border p-2" data-v-edaeeaa2>Gross Amount</th><th class="border p-2" data-v-edaeeaa2>Date</th><th class="border p-2" data-v-edaeeaa2>Product Quantities</th><th class="border p-2" data-v-edaeeaa2>Raw Sales</th></tr></thead><tbody data-v-edaeeaa2><!--[-->`);
        ssrRenderList(paginatedProducts.value, (transaction) => {
          _push(`<tr class="border" data-v-edaeeaa2><td class="border p-2 text-center" data-v-edaeeaa2>${ssrInterpolate(transaction.transaction_code)}</td><td class="border p-2 text-center" data-v-edaeeaa2>${ssrInterpolate(formatPrice(transaction.gross_amount))}</td><td class="border p-2 text-center" data-v-edaeeaa2>${ssrInterpolate(new Date(transaction.transaction_date).toLocaleDateString())}</td><td class="border p-2" data-v-edaeeaa2><ul data-v-edaeeaa2><!--[-->`);
          ssrRenderList(transaction.details, (detail) => {
            _push(`<li data-v-edaeeaa2>${ssrInterpolate(detail.product.name)} (${ssrInterpolate(detail.quantity)}) </li>`);
          });
          _push(`<!--]--></ul></td><td class="border p-2 text-center" data-v-edaeeaa2>${ssrInterpolate(transaction.details.reduce((sum, detail) => sum + detail.quantity, 0))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="mt-4 flex justify-between" data-v-edaeeaa2><div data-v-edaeeaa2> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length))} of ${ssrInterpolate(filteredProducts.value.length)} entries </div><div class="flex items-center space-x-2" data-v-edaeeaa2><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50" data-v-edaeeaa2> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "rounded border px-3 py-1 transition-all duration-200"])}" data-v-edaeeaa2>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50" data-v-edaeeaa2> Next </button></div></div></div>`);
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
const sales_count_page = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-edaeeaa2"]]);

export { sales_count_page as default };
//# sourceMappingURL=sales_count_page-BRHhUKfS.mjs.map
