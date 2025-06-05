import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import axios from 'axios';
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

const fallbackImage = "/assets/images/avatar.png";
const _sfc_main = {
  __name: "exit_products",
  __ssrInlineRender: true,
  setup(__props) {
    const exitProducts = ref([]);
    const products = ref([]);
    const expDates = ref([]);
    const showModal = ref(false);
    ref(null);
    const formData = ref({ product_id: "", exp_date: "", removed_stock: 0 });
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchExits = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(useApi(`/api/exit-products`));
        exitProducts.value = response.data.data;
      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
      } finally {
        isLoading.value = false;
      }
    };
    const fetchExpDates = async () => {
      if (!formData.value.product_id) return;
      const response = await axios.get(
        useApi(`/api/products/product/${formData.value.product_id}/exp-dates`)
      );
      expDates.value = response.data.data;
    };
    watch(() => formData.value.product_id, fetchExpDates);
    const filteredExit = computed(() => {
      return exitProducts.value.filter((exit) => {
        const query = searchQuery.value.toLowerCase();
        return exit.product.name.toLowerCase().includes(query) || exit.product.code.toLowerCase().includes(query) || exit.product.price.toString().includes(query) || exit.exp_date.toString().includes(query) || exit.removed_stock.toString().includes(query) || exit.previous_stock.toString().includes(query) || exit.current_stock.toString().includes(query) || exit.created_at.toString().includes(query);
      });
    });
    const paginatedExit = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredExit.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredExit.value.length / itemsPerPage.value);
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
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    };
    watch(itemsPerPage, () => {
      currentPage.value = 1;
      fetchExits();
    });
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-6" }, _attrs))} data-v-4545270a><div class="mb-4 flex items-center justify-between" data-v-4545270a><h1 class="text-2xl font-bold" data-v-4545270a>Barang Keluar</h1><button class="rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700" data-v-4545270a> + Tambah </button></div><div class="mb-4 flex items-center justify-between" data-v-4545270a><div data-v-4545270a><label class="mr-2" data-v-4545270a>Show</label><select id="itemsPerPage" data-v-4545270a><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-4545270a${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-4545270a>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="rounded border p-2" data-v-4545270a></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-4545270a><div class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear" data-v-4545270a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-4545270a><table class="min-w-full rounded-lg border border-gray-300 bg-white shadow-md" data-v-4545270a><thead class="border-b bg-gray-100" data-v-4545270a><tr data-v-4545270a><th class="border p-3 text-center" data-v-4545270a>#</th><th class="border p-3 text-center" data-v-4545270a>Foto</th><th class="border p-3 text-left" data-v-4545270a>Nama</th><th class="border p-3 text-center" data-v-4545270a>Harga</th><th class="border p-3 text-center" data-v-4545270a>Tanggal Expired</th><th class="border p-3 text-center" data-v-4545270a>Sebelum</th><th class="border p-3 text-center" data-v-4545270a>Jumlah</th><th class="border p-3 text-center" data-v-4545270a>Sesudah</th><th class="border p-3 text-center" data-v-4545270a>Waktu Pengurangan</th><th class="border p-3 text-center" data-v-4545270a>Opsi</th></tr></thead><tbody data-v-4545270a><!--[-->`);
        ssrRenderList(unref(paginatedExit), (exit) => {
          _push(`<tr class="border-b hover:bg-gray-50" data-v-4545270a><td class="border p-3" data-v-4545270a>${ssrInterpolate(exit.product.code)}</td><td class="flex min-h-[120px] min-w-[120px] items-center justify-center border p-2" data-v-4545270a><img${ssrRenderAttr(
            "src",
            exit.product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${exit.product.photo}`) : fallbackImage
          )} class="object-fit h-20 w-20" data-v-4545270a></td><td class="border p-3" data-v-4545270a>${ssrInterpolate(exit.product.name)}</td><td class="border p-3 text-center" data-v-4545270a>${ssrInterpolate(formatPrice(exit.product.price))}</td><td class="border p-3 text-center" data-v-4545270a>${ssrInterpolate(exit.exp_date)}</td><td class="border p-3 text-center font-bold" data-v-4545270a>${ssrInterpolate(exit.previous_stock)}</td><td class="border p-3 text-center font-bold text-red-500" data-v-4545270a> - ${ssrInterpolate(exit.removed_stock)}</td><td class="border p-3 text-center font-bold" data-v-4545270a>${ssrInterpolate(exit.current_stock)}</td><td class="border p-3 text-center" data-v-4545270a>${ssrInterpolate(formatDate(exit.created_at))}</td><td class="border p-3 text-center" data-v-4545270a><button class="rounded bg-yellow-500 px-3 py-1 text-white" data-v-4545270a> Edit </button><button class="ml-2 rounded bg-red-500 px-3 py-1 text-white" data-v-4545270a> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="mt-4 flex justify-between" data-v-4545270a><div data-v-4545270a> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, unref(filteredExit).length))} of ${ssrInterpolate(unref(filteredExit).length)} entries </div><div class="flex items-center space-x-2" data-v-4545270a><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50" data-v-4545270a> Prev </button><!--[-->`);
        ssrRenderList(unref(generatePagination), (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "rounded border px-3 py-1 transition-all duration-200"])}" data-v-4545270a>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === unref(totalPages)) ? " disabled" : ""} class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50" data-v-4545270a> Next </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showModal.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50" data-v-4545270a><div class="w-1/3 rounded bg-white p-6 shadow-lg" data-v-4545270a><h2 class="mb-4 text-xl font-bold" data-v-4545270a>Pilih Barang Keluar</h2><label class="mb-2 block text-gray-700" data-v-4545270a>Pilih Produk:</label><select class="mb-4 w-full border p-2" data-v-4545270a><!--[-->`);
        ssrRenderList(products.value, (product) => {
          _push(`<option${ssrRenderAttr("value", product.id)} data-v-4545270a${ssrIncludeBooleanAttr(Array.isArray(formData.value.product_id) ? ssrLooseContain(formData.value.product_id, product.id) : ssrLooseEqual(formData.value.product_id, product.id)) ? " selected" : ""}>${ssrInterpolate(product.name)} (${ssrInterpolate(product.code)}) - Rp ${ssrInterpolate(product.price.toLocaleString())}</option>`);
        });
        _push(`<!--]--></select><label class="mb-2 block text-gray-700" data-v-4545270a>Tanggal Expired:</label><select class="mb-4 w-full border p-2" data-v-4545270a><!--[-->`);
        ssrRenderList(expDates.value, (exp) => {
          _push(`<option${ssrRenderAttr("value", exp)} data-v-4545270a${ssrIncludeBooleanAttr(Array.isArray(formData.value.exp_date) ? ssrLooseContain(formData.value.exp_date, exp) : ssrLooseEqual(formData.value.exp_date, exp)) ? " selected" : ""}>${ssrInterpolate(exp)}</option>`);
        });
        _push(`<!--]--></select><label class="mb-2 block text-gray-700" data-v-4545270a>Jumlah Stok:</label><input type="number"${ssrRenderAttr("value", formData.value.removed_stock)} class="mb-4 w-full border p-2" min="1" data-v-4545270a><div class="flex justify-end" data-v-4545270a><button class="mr-2 rounded bg-gray-400 px-4 py-2 text-white" data-v-4545270a> Batal </button><button class="rounded bg-blue-600 px-4 py-2 text-white" data-v-4545270a> Simpan </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/exit_products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const exit_products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4545270a"]]);

export { exit_products as default };
//# sourceMappingURL=exit_products-BYSRHxVP.mjs.map
