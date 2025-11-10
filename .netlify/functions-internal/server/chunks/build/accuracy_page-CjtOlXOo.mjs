import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { unref, ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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
import 'axios';

const _sfc_main = {
  setup() {
    const products = ref({});
    const accuracy = ref({});
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fallbackImage = "/assets/images/avatar.png";
    const sortedAccuracy = computed(() => {
      return Object.entries(accuracy.value).sort((a, b) => b[1] - a[1]).map(([id, accValue]) => ({
        id,
        accuracy: accValue,
        ...products.value[id]
      }));
    });
    const filteredProducts = computed(() => {
      return sortedAccuracy.value.filter((product) => {
        var _a, _b;
        const query = searchQuery.value.toLowerCase();
        return [
          product.name || "",
          product.code || "",
          product.category_name || "",
          ((_a = product.price) == null ? void 0 : _a.toString()) || "",
          ((_b = product.stocks) == null ? void 0 : _b.toString()) || "",
          product.accuracy.toFixed(2)
        ].some((field) => field.toLowerCase().includes(query));
      });
    });
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredProducts.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(
      () => Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );
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
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value && page !== "...") {
        currentPage.value = page;
      }
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const onImageError = (event) => {
      event.target.src = fallbackImage;
    };
    watch(itemsPerPage, () => {
      currentPage.value = 1;
    });
    return {
      products,
      accuracy,
      searchQuery,
      itemsPerPageOptions,
      itemsPerPage,
      currentPage,
      filteredProducts,
      paginatedProducts,
      totalPages,
      generatePagination,
      changePage,
      formatPrice,
      isLoading,
      onImageError
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-f55bf642><h1 class="mb-4 text-xl font-bold" data-v-f55bf642>Prediksi Produk Terlaris - Algoritma C4.5</h1><h2 class="mt-6 text-lg font-semibold" data-v-f55bf642>3. Perhitungan Akurasi</h2><div class="flex justify-between my-4" data-v-f55bf642><div data-v-f55bf642><label class="mr-2" data-v-f55bf642>Show</label><select id="itemsPerPage" data-v-f55bf642><!--[-->`);
  ssrRenderList($setup.itemsPerPageOptions, (option) => {
    _push(`<option${ssrRenderAttr("value", option)} data-v-f55bf642${ssrIncludeBooleanAttr(Array.isArray($setup.itemsPerPage) ? ssrLooseContain($setup.itemsPerPage, option) : ssrLooseEqual($setup.itemsPerPage, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
  });
  _push(`<!--]--></select><span class="ml-2" data-v-f55bf642>entries</span></div><input type="text"${ssrRenderAttr("value", $setup.searchQuery)} placeholder="Search" class="p-2 border rounded" data-v-f55bf642></div>`);
  if ($setup.isLoading) {
    _push(`<div class="flex items-center justify-center py-10" data-v-f55bf642><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-f55bf642></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$setup.isLoading) {
    _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-f55bf642><table class="min-w-full mt-0 bg-white border border-collapse border-gray-300 table-auto" data-v-f55bf642><thead data-v-f55bf642><tr class="bg-gray-200" data-v-f55bf642><th class="p-2 border" data-v-f55bf642>Kode Produk</th><th class="p-2 border" data-v-f55bf642>Nama</th><th class="p-2 border" data-v-f55bf642>Kondisi</th><th class="p-2 border" data-v-f55bf642>Foto</th><th class="p-2 border" data-v-f55bf642>Kategori</th><th class="p-2 border" data-v-f55bf642>Harga</th><th class="p-2 border" data-v-f55bf642>Stok</th><th class="p-2 border" data-v-f55bf642>Akurasi</th></tr></thead><tbody data-v-f55bf642><!--[-->`);
    ssrRenderList($setup.paginatedProducts, (product) => {
      _push(`<tr data-v-f55bf642><td class="p-2 border" data-v-f55bf642>${ssrInterpolate(product.code)}</td><td class="p-2 border" data-v-f55bf642>${ssrInterpolate(product.name || "Unknown")}</td><td class="p-2 border" data-v-f55bf642><span class="${ssrRenderClass([{
        "bg-green-100 text-green-600": product.condition === "active",
        "bg-red-100 text-red-600": product.condition === "nonactive"
      }, "px-3 py-1 text-base font-semibold rounded-full md:text-lg"])}" data-v-f55bf642>${ssrInterpolate(product.condition || "Unknown")}</span></td><td class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2" data-v-f55bf642><img${ssrRenderAttr("src", product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${product.photo}`) : _ctx.fallbackImage)} class="w-20 h-20 object-fit" data-v-f55bf642></td><td class="p-2 border" data-v-f55bf642>${ssrInterpolate(product.category_name || "Unknown")}</td><td class="p-2 border" data-v-f55bf642>${ssrInterpolate($setup.formatPrice(product.price))}</td><td class="p-2 border" data-v-f55bf642>${ssrInterpolate(product.stocks)}</td><td class="p-2 border" data-v-f55bf642><span class="${ssrRenderClass([{
        "bg-blue-100 text-blue-700": product.accuracy >= 75,
        "bg-yellow-100 text-yellow-700": product.accuracy < 75 && product.accuracy >= 50,
        "bg-orange-100 text-orange-700": product.accuracy < 50 && product.accuracy >= 25,
        "bg-red-100 text-red-700": product.accuracy < 25
      }, "px-3 py-1 text-sm font-semibold rounded-full"])}" data-v-f55bf642>${ssrInterpolate(product.accuracy.toFixed(2))}% </span></td></tr>`);
    });
    _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-f55bf642><div data-v-f55bf642> Showing ${ssrInterpolate(($setup.currentPage - 1) * $setup.itemsPerPage + 1)} to ${ssrInterpolate(Math.min($setup.currentPage * $setup.itemsPerPage, $setup.filteredProducts.length))} of ${ssrInterpolate($setup.filteredProducts.length)} entries </div><div class="flex items-center space-x-2" data-v-f55bf642><button${ssrIncludeBooleanAttr($setup.currentPage === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-f55bf642> Prev </button><!--[-->`);
    ssrRenderList($setup.generatePagination, (page) => {
      _push(`<button class="${ssrRenderClass([{
        "bg-blue-500 text-white": $setup.currentPage === page,
        "bg-white text-blue-500 hover:bg-blue-100": $setup.currentPage !== page && page !== "..."
      }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-f55bf642>${ssrInterpolate(page)}</button>`);
    });
    _push(`<!--]--><button${ssrIncludeBooleanAttr($setup.currentPage === $setup.totalPages) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-f55bf642> Next </button></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analysis_pages/accuracy_page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const accuracy_page = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-f55bf642"]]);

export { accuracy_page as default };
//# sourceMappingURL=accuracy_page-CjtOlXOo.mjs.map
