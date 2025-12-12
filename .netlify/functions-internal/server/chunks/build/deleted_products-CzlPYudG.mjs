import { _ as __nuxt_component_0 } from './nuxt-link-D5njNngX.mjs';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import axios from 'axios';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './server.mjs';
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
  __name: "deleted_products",
  __ssrInlineRender: true,
  setup(__props) {
    const products = ref([]);
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchProducts = async () => {
      isLoading.value = true;
      try {
        const res = await axios.get(useApi(`/api/api/products`));
        products.value = res.data.data;
      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
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
    const getTotalStock = (stocks) => {
      return stocks.reduce((total, stock) => total + parseInt(stock.stock, 10), 0);
    };
    const filteredProducts = computed(() => {
      return products.value.filter((product) => {
        var _a, _b;
        const query = searchQuery.value.toLowerCase();
        return product.condition === "nonactive" && (product.code.toLowerCase().includes(query) || // Pencarian berdasarkan kode
        product.name.toLowerCase().includes(query) || // Pencarian berdasarkan nama
        ((_b = (_a = product.category) == null ? void 0 : _a.name) == null ? void 0 : _b.toLowerCase().includes(query)) || // Pencarian berdasarkan kategori
        product.price.toString().includes(query) || // Pencarian berdasarkan harga
        product.stocks.some((stock) => stock.exp_date.includes(query)) || // Pencarian berdasarkan tanggal kedaluwarsa
        getTotalStock(product.stocks).toString().includes(query) || // Pencarian berdasarkan total stok
        product.condition.toLowerCase().includes(query));
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
      fetchProducts();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-fafbaacf><h1 class="mb-4 text-2xl font-bold" data-v-fafbaacf>Daftar Produk Dinonaktifkan</h1><div class="flex items-center justify-between mb-4" data-v-fafbaacf><div data-v-fafbaacf><label class="mr-2" data-v-fafbaacf>Show</label><select id="itemsPerPage" data-v-fafbaacf><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-fafbaacf${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-fafbaacf>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-fafbaacf></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-fafbaacf><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-fafbaacf></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-fafbaacf><table class="min-w-full text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md" data-v-fafbaacf><thead data-v-fafbaacf><tr class="bg-gray-200" data-v-fafbaacf><th class="p-2 border" data-v-fafbaacf>#</th><th class="p-2 border" data-v-fafbaacf>Foto</th><th class="p-2 border" data-v-fafbaacf>Nama</th><th class="p-2 border" data-v-fafbaacf>Kategori</th><th class="p-2 border" data-v-fafbaacf>Harga</th><th class="p-2 border" data-v-fafbaacf>Tanggal Kadaluarsa &amp; Stok</th><th class="p-2 border" data-v-fafbaacf>Total Stok</th><th class="p-2 border" data-v-fafbaacf>Aksi</th></tr></thead><tbody data-v-fafbaacf><!--[-->`);
        ssrRenderList(paginatedProducts.value, (product) => {
          var _a;
          _push(`<tr class="${ssrRenderClass({ "bg-red-200": product.condition === "nonactive" })}" data-v-fafbaacf><td class="p-2 border" data-v-fafbaacf>${ssrInterpolate(product.code)}</td><td class="p-2 border" data-v-fafbaacf><div class="flex min-h-[100px] min-w-[100px] items-center justify-center w-full h-full" data-v-fafbaacf><img${ssrRenderAttr(
            "src",
            product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${product.photo}`) : fallbackImage
          )} class="object-cover w-20 h-20 rounded" data-v-fafbaacf></div></td><td class="p-3 border" data-v-fafbaacf>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/product_pages/detail/${product.id}`,
            class: "text-blue-500 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(product.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(product.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="p-2 border" data-v-fafbaacf>${ssrInterpolate(((_a = product.category) == null ? void 0 : _a.name) || "Tidak ada")}</td><td class="p-2 border" data-v-fafbaacf>${ssrInterpolate(formatPrice(product.price))}</td><td class="p-2 border" data-v-fafbaacf><ul data-v-fafbaacf><!--[-->`);
          ssrRenderList(product.stocks, (stock) => {
            _push(`<li class="${ssrRenderClass({
              "p-2 rounded-md": true
            })}" data-v-fafbaacf><strong data-v-fafbaacf>${ssrInterpolate(stock.exp_date)}</strong> - Stok: ${ssrInterpolate(parseInt(stock.stock, 10))}</li>`);
          });
          _push(`<!--]--></ul></td><td class="p-2 font-bold border" data-v-fafbaacf>${ssrInterpolate(getTotalStock(product.stocks))}</td><td class="p-2 border" data-v-fafbaacf>`);
          if (product.condition === "nonactive") {
            _push(`<button class="p-1 ml-2 text-white bg-blue-500 rounded" data-v-fafbaacf> Aktifkan </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-fafbaacf><div data-v-fafbaacf> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length))} from ${ssrInterpolate(filteredProducts.value.length)} entries </div><div class="flex items-center space-x-2" data-v-fafbaacf><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-fafbaacf> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-fafbaacf>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-fafbaacf> Next </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/deleted_products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const deleted_products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fafbaacf"]]);

export { deleted_products as default };
//# sourceMappingURL=deleted_products-CzlPYudG.mjs.map
