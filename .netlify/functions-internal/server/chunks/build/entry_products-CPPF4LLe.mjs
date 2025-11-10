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
  __name: "entry_products",
  __ssrInlineRender: true,
  setup(__props) {
    const entryProducts = ref([]);
    const products = ref([]);
    const expDates = ref([]);
    const showModal = ref(false);
    ref(null);
    const formData = ref({
      product_id: "",
      exp_date: "",
      new_exp_date: "",
      added_stock: 1
    });
    const isCreatingNewExpDate = ref(false);
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchEntries = async () => {
      const response = await axios.get(useApi(`/api/api/entry-products`));
      entryProducts.value = response.data.data;
    };
    const fetchExpDates = async () => {
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
      expDates.value = expDatesWithStock;
      expDates.value.push({ date: "--NEW--", stock: "Buat Tanggal Baru" });
    };
    watch(() => formData.value.product_id, fetchExpDates);
    watch(
      () => formData.value.exp_date,
      (newValue) => {
        if (newValue === "--NEW--") {
          isCreatingNewExpDate.value = true;
        } else {
          isCreatingNewExpDate.value = false;
        }
      }
    );
    const filteredEntry = computed(() => {
      return entryProducts.value.filter((entry) => {
        const query = searchQuery.value.toLowerCase();
        return entry.product.name.toLowerCase().includes(query) || entry.product.code.toLowerCase().includes(query) || entry.product.price.toString().includes(query) || entry.exp_date.toString().includes(query) || entry.added_stock.toString().includes(query) || entry.previous_stock.toString().includes(query) || entry.current_stock.toString().includes(query) || entry.created_at.toString().includes(query);
      });
    });
    const paginatedEntry = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredEntry.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredEntry.value.length / itemsPerPage.value);
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
      fetchEntries();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-b3e3ac2f><div class="flex items-center justify-between mb-4" data-v-b3e3ac2f><h1 class="text-2xl font-bold" data-v-b3e3ac2f>Barang Masuk</h1><button class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700" data-v-b3e3ac2f> + Tambah Barang Masuk </button></div><div class="flex items-center justify-between mb-4" data-v-b3e3ac2f><div data-v-b3e3ac2f><label class="mr-2" data-v-b3e3ac2f>Show</label><select id="itemsPerPage" data-v-b3e3ac2f><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-b3e3ac2f${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-b3e3ac2f>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-b3e3ac2f></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-b3e3ac2f><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-b3e3ac2f></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-b3e3ac2f><table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md" data-v-b3e3ac2f><thead class="bg-gray-100 border-b" data-v-b3e3ac2f><tr class="bg-gray-200" data-v-b3e3ac2f><th class="p-3 text-left border" data-v-b3e3ac2f>#</th><th class="p-3 text-center border" data-v-b3e3ac2f>Foto</th><th class="p-3 text-left border" data-v-b3e3ac2f>Nama</th><th class="p-3 text-center border" data-v-b3e3ac2f>Harga</th><th class="p-3 text-center border" data-v-b3e3ac2f>Tanggal Expired</th><th class="p-3 text-center border" data-v-b3e3ac2f>Sebelum</th><th class="p-3 text-center border" data-v-b3e3ac2f>Jumlah</th><th class="p-3 text-center border" data-v-b3e3ac2f>Sesudah</th><th class="p-3 text-center border" data-v-b3e3ac2f>Waktu Penambahan</th><th class="p-3 text-center border" data-v-b3e3ac2f>Opsi</th></tr></thead><tbody data-v-b3e3ac2f><!--[-->`);
        ssrRenderList(paginatedEntry.value, (entry) => {
          _push(`<tr class="border-b hover:bg-gray-50" data-v-b3e3ac2f><td class="p-3 border" data-v-b3e3ac2f>${ssrInterpolate(entry.product.code)}</td><td class="p-2 border" data-v-b3e3ac2f><div class="flex min-h-[100px] min-w-[100px] items-center justify-center w-full h-full" data-v-b3e3ac2f><img${ssrRenderAttr(
            "src",
            entry.product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${entry.product.photo}`) : fallbackImage
          )} class="object-cover w-20 h-20 rounded" data-v-b3e3ac2f></div></td><td class="p-3 border" data-v-b3e3ac2f>${ssrInterpolate(entry.product.name)}</td><td class="p-3 text-center border" data-v-b3e3ac2f>${ssrInterpolate(formatPrice(entry.product.price))}</td><td class="p-3 text-center border" data-v-b3e3ac2f>${ssrInterpolate(entry.exp_date)}</td><td class="p-3 font-bold text-center border" data-v-b3e3ac2f>${ssrInterpolate(entry.previous_stock)}</td><td class="p-3 font-bold text-center text-blue-500 border" data-v-b3e3ac2f> + ${ssrInterpolate(entry.added_stock)}</td><td class="p-3 font-bold text-center border" data-v-b3e3ac2f>${ssrInterpolate(entry.current_stock)}</td><td class="p-3 text-center border" data-v-b3e3ac2f>${ssrInterpolate(formatDate(entry.created_at))}</td><td class="p-3 text-center border" data-v-b3e3ac2f><button class="px-3 py-1 text-white bg-yellow-500 rounded" data-v-b3e3ac2f> Edit </button><button class="px-3 py-1 ml-2 text-white bg-red-500 rounded" data-v-b3e3ac2f> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-b3e3ac2f><div data-v-b3e3ac2f> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredEntry.value.length))} of ${ssrInterpolate(filteredEntry.value.length)} entries </div><div class="flex items-center space-x-2" data-v-b3e3ac2f><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-b3e3ac2f> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-b3e3ac2f>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-b3e3ac2f> Next </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showModal.value) {
        _push(`<div class="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50" data-v-b3e3ac2f><div class="w-1/3 p-6 bg-white rounded shadow-lg" data-v-b3e3ac2f><h2 class="mb-4 text-xl font-bold" data-v-b3e3ac2f>Pilih Barang Masuk</h2><label class="block mb-2 text-gray-700" data-v-b3e3ac2f>Pilih Produk:</label><select class="w-full p-2 mb-4 border" data-v-b3e3ac2f><!--[-->`);
        ssrRenderList(products.value, (product) => {
          _push(`<option${ssrRenderAttr("value", product.id)} data-v-b3e3ac2f${ssrIncludeBooleanAttr(Array.isArray(formData.value.product_id) ? ssrLooseContain(formData.value.product_id, product.id) : ssrLooseEqual(formData.value.product_id, product.id)) ? " selected" : ""}>${ssrInterpolate(product.name)} (${ssrInterpolate(product.code)}) - Rp ${ssrInterpolate(product.price.toLocaleString())}</option>`);
        });
        _push(`<!--]--></select><label class="block mb-2 text-gray-700" data-v-b3e3ac2f>Tanggal Expired:</label>`);
        if (!isCreatingNewExpDate.value) {
          _push(`<select class="w-full p-2 border" data-v-b3e3ac2f><option value="" disabled data-v-b3e3ac2f${ssrIncludeBooleanAttr(Array.isArray(formData.value.exp_date) ? ssrLooseContain(formData.value.exp_date, "") : ssrLooseEqual(formData.value.exp_date, "")) ? " selected" : ""}>-- Pilih Tanggal --</option><!--[-->`);
          ssrRenderList(expDates.value, (exp) => {
            _push(`<option${ssrRenderAttr("value", exp.date)} data-v-b3e3ac2f${ssrIncludeBooleanAttr(Array.isArray(formData.value.exp_date) ? ssrLooseContain(formData.value.exp_date, exp.date) : ssrLooseEqual(formData.value.exp_date, exp.date)) ? " selected" : ""}>${ssrInterpolate(exp.date === "--NEW--" ? exp.stock : `${exp.date} (Stok: ${exp.stock})`)}</option>`);
          });
          _push(`<!--]--></select>`);
        } else {
          _push(`<div data-v-b3e3ac2f><input type="date"${ssrRenderAttr("value", formData.value.new_exp_date)} class="w-full p-2 border" data-v-b3e3ac2f><button class="mt-2 text-sm text-blue-500 hover:underline" data-v-b3e3ac2f> Batal, pilih dari daftar </button></div>`);
        }
        _push(`<label class="block mt-4 mb-2 text-gray-700" data-v-b3e3ac2f>Jumlah Stok:</label><input type="number"${ssrRenderAttr("value", formData.value.added_stock)} class="w-full p-2 mb-4 border" min="1" data-v-b3e3ac2f><div class="flex justify-end" data-v-b3e3ac2f><button class="px-4 py-2 mr-2 text-white bg-gray-400 rounded" data-v-b3e3ac2f> Batal </button><button class="px-4 py-2 text-white bg-blue-600 rounded" data-v-b3e3ac2f> Simpan </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/entry_products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const entry_products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b3e3ac2f"]]);

export { entry_products as default };
//# sourceMappingURL=entry_products-CPPF4LLe.mjs.map
