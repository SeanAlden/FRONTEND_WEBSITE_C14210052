import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import axios from 'axios';
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

const fallbackImage = "/assets/images/avatar.png";
const _sfc_main = {
  __name: "exit_products",
  __ssrInlineRender: true,
  setup(__props) {
    const exitProducts = ref([]);
    const products = ref([]);
    const expDates = ref([]);
    const showModal = ref(false);
    const selectedProduct = ref(null);
    const formData = ref({ product_id: "", exp_date: "", removed_stock: 1 });
    const selectedStockItem = ref(null);
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchExits = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(useApi(`/api/api/exit-products`));
        exitProducts.value = response.data.data;
      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
      } finally {
        isLoading.value = false;
      }
    };
    const fetchExpDates = async () => {
      selectedStockItem.value = null;
      if (!formData.value.product_id) {
        expDates.value = [];
        return;
      }
      const response = await axios.get(
        useApi(`/api/api/products/product/${formData.value.product_id}/exp-dates`)
      );
      const fetchedExpDates = response.data.data;
      const expDatesWithStock = [];
      for (const expDate of fetchedExpDates) {
        const stockResponse = await axios.get(
          useApi(`/api/api/products/product/${formData.value.product_id}/stock/${expDate}`)
        );
        expDatesWithStock.push({
          date: expDate,
          stock: stockResponse.data.stock
        });
      }
      expDates.value = expDatesWithStock.filter((item) => {
        if (selectedProduct.value) {
          return item.stock >= 0 || item.date === selectedProduct.value.exp_date;
        }
        return item.stock >= 0;
      });
    };
    watch(() => formData.value.product_id, fetchExpDates);
    watch(
      () => formData.value.exp_date,
      (newDate) => {
        if (newDate) {
          selectedStockItem.value = expDates.value.find((item) => item.date === newDate) || null;
        } else {
          selectedStockItem.value = null;
        }
      }
    );
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
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    watch(itemsPerPage, () => {
      currentPage.value = 1;
      fetchExits();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-d0bf86b9><div class="flex items-center justify-between mb-4" data-v-d0bf86b9><h1 class="text-2xl font-bold" data-v-d0bf86b9>Barang Keluar</h1><button class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700" data-v-d0bf86b9> + Tambah Barang Keluar </button></div><div class="flex items-center justify-between mb-4" data-v-d0bf86b9><div data-v-d0bf86b9><label class="mr-2" data-v-d0bf86b9>Show</label><select id="itemsPerPage" data-v-d0bf86b9><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-d0bf86b9${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-d0bf86b9>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-d0bf86b9></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-d0bf86b9><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-d0bf86b9></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-d0bf86b9><table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md" data-v-d0bf86b9><thead class="bg-gray-100 border-b" data-v-d0bf86b9><tr class="bg-gray-200" data-v-d0bf86b9><th class="p-3 text-center border" data-v-d0bf86b9>#</th><th class="p-3 text-center border" data-v-d0bf86b9>Foto</th><th class="p-3 text-left border" data-v-d0bf86b9>Nama</th><th class="p-3 text-center border" data-v-d0bf86b9>Harga</th><th class="p-3 text-center border" data-v-d0bf86b9>Tanggal Expired</th><th class="p-3 text-center border" data-v-d0bf86b9>Sebelum</th><th class="p-3 text-center border" data-v-d0bf86b9>Jumlah</th><th class="p-3 text-center border" data-v-d0bf86b9>Sesudah</th><th class="p-3 text-center border" data-v-d0bf86b9>Waktu Pengurangan</th><th class="p-3 text-center border" data-v-d0bf86b9>Opsi</th></tr></thead><tbody data-v-d0bf86b9><!--[-->`);
        ssrRenderList(paginatedExit.value, (exit) => {
          _push(`<tr class="border-b hover:bg-gray-50" data-v-d0bf86b9><td class="p-3 border" data-v-d0bf86b9>${ssrInterpolate(exit.product.code)}</td><td class="p-2 border" data-v-d0bf86b9><div class="flex min-h-[100px] min-w-[100px] items-center justify-center w-full h-full" data-v-d0bf86b9><img${ssrRenderAttr(
            "src",
            exit.product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${exit.product.photo}`) : fallbackImage
          )} class="object-cover w-20 h-20 rounded" data-v-d0bf86b9></div></td><td class="p-3 border" data-v-d0bf86b9>${ssrInterpolate(exit.product.name)}</td><td class="p-3 text-center border" data-v-d0bf86b9>${ssrInterpolate(formatPrice(exit.product.price))}</td><td class="p-3 text-center border" data-v-d0bf86b9>${ssrInterpolate(exit.exp_date)}</td><td class="p-3 font-bold text-center border" data-v-d0bf86b9>${ssrInterpolate(exit.previous_stock)}</td><td class="p-3 font-bold text-center text-red-500 border" data-v-d0bf86b9> - ${ssrInterpolate(exit.removed_stock)}</td><td class="p-3 font-bold text-center border" data-v-d0bf86b9>${ssrInterpolate(exit.current_stock)}</td><td class="p-3 text-center border" data-v-d0bf86b9>${ssrInterpolate(formatDate(exit.created_at))}</td><td class="p-3 text-center border" data-v-d0bf86b9><button class="px-3 py-1 text-white bg-yellow-500 rounded" data-v-d0bf86b9> Edit </button><button class="px-3 py-1 ml-2 text-white bg-red-500 rounded" data-v-d0bf86b9> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-d0bf86b9><div data-v-d0bf86b9> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredExit.value.length))} of ${ssrInterpolate(filteredExit.value.length)} entries </div><div class="flex items-center space-x-2" data-v-d0bf86b9><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-d0bf86b9> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-d0bf86b9>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-d0bf86b9> Next </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showModal.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50" data-v-d0bf86b9><div class="w-1/3 p-6 bg-white rounded shadow-lg" data-v-d0bf86b9><h2 class="mb-4 text-xl font-bold" data-v-d0bf86b9>Pilih Barang Keluar</h2><label class="block mb-2 text-gray-700" data-v-d0bf86b9>Pilih Produk:</label><select${ssrIncludeBooleanAttr(selectedProduct.value) ? " disabled" : ""} class="w-full p-2 mb-4 border disabled:bg-gray-200" data-v-d0bf86b9><option value="" disabled data-v-d0bf86b9${ssrIncludeBooleanAttr(Array.isArray(formData.value.product_id) ? ssrLooseContain(formData.value.product_id, "") : ssrLooseEqual(formData.value.product_id, "")) ? " selected" : ""}>-- Pilih Produk --</option><!--[-->`);
        ssrRenderList(products.value, (product) => {
          _push(`<option${ssrRenderAttr("value", product.id)} data-v-d0bf86b9${ssrIncludeBooleanAttr(Array.isArray(formData.value.product_id) ? ssrLooseContain(formData.value.product_id, product.id) : ssrLooseEqual(formData.value.product_id, product.id)) ? " selected" : ""}>${ssrInterpolate(product.name)} (${ssrInterpolate(product.code)}) </option>`);
        });
        _push(`<!--]--></select><label class="block mb-2 text-gray-700" data-v-d0bf86b9>Tanggal Expired:</label><select${ssrIncludeBooleanAttr(!formData.value.product_id || selectedProduct.value) ? " disabled" : ""} class="w-full p-2 mb-4 border disabled:bg-gray-200" data-v-d0bf86b9><option value="" disabled data-v-d0bf86b9${ssrIncludeBooleanAttr(Array.isArray(formData.value.exp_date) ? ssrLooseContain(formData.value.exp_date, "") : ssrLooseEqual(formData.value.exp_date, "")) ? " selected" : ""}>-- Pilih Tanggal --</option><!--[-->`);
        ssrRenderList(expDates.value, (exp) => {
          _push(`<option${ssrRenderAttr("value", exp.date)} data-v-d0bf86b9${ssrIncludeBooleanAttr(Array.isArray(formData.value.exp_date) ? ssrLooseContain(formData.value.exp_date, exp.date) : ssrLooseEqual(formData.value.exp_date, exp.date)) ? " selected" : ""}>${ssrInterpolate(exp.date)} (Stok: ${ssrInterpolate(exp.stock)}) </option>`);
        });
        _push(`<!--]--></select>`);
        if (selectedStockItem.value) {
          _push(`<div data-v-d0bf86b9>`);
          if (selectedStockItem.value.stock > 0) {
            _push(`<div data-v-d0bf86b9><label class="block mb-2 text-gray-700" data-v-d0bf86b9>Jumlah Stok Keluar:</label><input type="number"${ssrRenderAttr("value", formData.value.removed_stock)} class="w-full p-2 mb-4 border" min="1"${ssrRenderAttr("max", selectedStockItem.value.stock)} data-v-d0bf86b9></div>`);
          } else {
            _push(`<div class="p-4 my-4 text-center bg-yellow-100 border-l-4 border-yellow-500" data-v-d0bf86b9><p class="font-bold" data-v-d0bf86b9>Stok untuk tanggal ini sudah habis (0).</p><p class="text-sm" data-v-d0bf86b9> Anda dapat menghapus data tanggal expired ini dari daftar pilihan. </p><button class="px-4 py-2 mt-3 text-white bg-red-600 rounded shadow-md hover:bg-red-700" data-v-d0bf86b9> Hapus Tanggal Expired Ini </button></div>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end" data-v-d0bf86b9><button class="px-4 py-2 mr-2 text-white bg-gray-400 rounded" data-v-d0bf86b9> Batal </button>`);
        if (selectedStockItem.value && selectedStockItem.value.stock > 0) {
          _push(`<button class="px-4 py-2 text-white bg-blue-600 rounded" data-v-d0bf86b9> Simpan </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
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
const exit_products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d0bf86b9"]]);

export { exit_products as default };
//# sourceMappingURL=exit_products-d9gSjrf0.mjs.map
