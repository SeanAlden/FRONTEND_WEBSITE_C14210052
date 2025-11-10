import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import axios from 'axios';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import './server.mjs';
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
  __name: "deleted_products_history",
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
        const res = await axios.get(useApi(`/api/api/nonactive-history`));
        products.value = res.data.data.map((item) => {
          item.details.forEach((detail) => {
            detail.product_stock = parseInt(detail.product_stock, 10);
          });
          return item;
        });
      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
      } finally {
        setTimeout(() => {
          isLoading.value = false;
        }, 200);
      }
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    };
    const getTotalStock = (item) => {
      if (!item.details || !Array.isArray(item.details)) return 0;
      return item.details.reduce((sum, detail) => sum + detail.product_stock, 0);
    };
    const filteredProducts = computed(() => {
      return products.value.filter((item) => {
        var _a, _b, _c, _d, _e;
        const query = searchQuery.value.toLowerCase();
        const product = item.product;
        return item.condition === "nonactive" && (((_a = product.code) == null ? void 0 : _a.toLowerCase().includes(query)) || ((_b = product.name) == null ? void 0 : _b.toLowerCase().includes(query)) || ((_d = (_c = product.category) == null ? void 0 : _c.name) == null ? void 0 : _d.toLowerCase().includes(query)) || ((_e = product.price) == null ? void 0 : _e.toString().includes(query)));
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-8bbe6cbf><h1 class="mb-4 text-2xl font-bold" data-v-8bbe6cbf>Riwayat Produk Dinonaktifkan</h1><div class="flex items-center justify-between mb-4" data-v-8bbe6cbf><div data-v-8bbe6cbf><label class="mr-2" data-v-8bbe6cbf>Show</label><select id="itemsPerPage" data-v-8bbe6cbf><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-8bbe6cbf${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-8bbe6cbf>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-8bbe6cbf></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-8bbe6cbf><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-8bbe6cbf></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-8bbe6cbf><table class="min-w-full text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md" data-v-8bbe6cbf><thead data-v-8bbe6cbf><tr class="bg-gray-200" data-v-8bbe6cbf><th class="p-2 border" data-v-8bbe6cbf>Kode</th><th class="p-2 border" data-v-8bbe6cbf>Foto</th><th class="p-2 border" data-v-8bbe6cbf>Nama</th><th class="p-2 border" data-v-8bbe6cbf>Kategori</th><th class="p-2 border" data-v-8bbe6cbf>Harga</th><th class="p-2 border" data-v-8bbe6cbf>Tanggal Kadaluarsa &amp; Stok</th><th class="p-2 border" data-v-8bbe6cbf>Total Stok</th><th class="p-2 border" data-v-8bbe6cbf>Waktu Nonaktif</th></tr></thead><tbody data-v-8bbe6cbf><!--[-->`);
        ssrRenderList(paginatedProducts.value, (item) => {
          _push(`<tr class="${ssrRenderClass({ "bg-red-100": item.condition === "nonactive" })}" data-v-8bbe6cbf><td class="p-2 border" data-v-8bbe6cbf>${ssrInterpolate(item.product.code)}</td><td class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2" data-v-8bbe6cbf><img${ssrRenderAttr(
            "src",
            item.product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${item.product.photo}`) : fallbackImage
          )} class="w-20 h-20 object-fit" data-v-8bbe6cbf></td><td class="p-2 border" data-v-8bbe6cbf>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/product_pages/detail/${item.product.id}`,
            class: "text-blue-500 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.product.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.product.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="p-2 border" data-v-8bbe6cbf>${ssrInterpolate(item.product.category.name || "Tidak ada")}</td><td class="p-2 border" data-v-8bbe6cbf>${ssrInterpolate(formatPrice(item.product.price))}</td><td class="p-2 border" data-v-8bbe6cbf><!--[-->`);
          ssrRenderList(item.details, (detail, i) => {
            _push(`<div class="${ssrRenderClass({
              "p-2 rounded-md": true
            })}" data-v-8bbe6cbf><strong data-v-8bbe6cbf>${ssrInterpolate(detail.product_exp_date)}</strong> - Stok: ${ssrInterpolate(detail.product_stock)}</div>`);
          });
          _push(`<!--]--></td><td class="p-2 border" data-v-8bbe6cbf>${ssrInterpolate(getTotalStock(item))}</td><td class="p-2 border" data-v-8bbe6cbf>${ssrInterpolate(formatDate(item.changed_at))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-8bbe6cbf><div data-v-8bbe6cbf> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length))} of ${ssrInterpolate(filteredProducts.value.length)} entries </div><div class="flex items-center space-x-2" data-v-8bbe6cbf><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-8bbe6cbf> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([
            "px-3 py-1 border rounded",
            currentPage.value === page ? "bg-blue-500 text-white" : "bg-gray-200"
          ])}"${ssrIncludeBooleanAttr(page === "...") ? " disabled" : ""} data-v-8bbe6cbf>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-8bbe6cbf> Next </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/deleted_products_history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const deleted_products_history = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8bbe6cbf"]]);

export { deleted_products_history as default };
//# sourceMappingURL=deleted_products_history-BAKQghIz.mjs.map
