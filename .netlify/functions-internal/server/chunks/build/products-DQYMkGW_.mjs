import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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

const fallbackImage = "/assets/images/avatar.png";
const _sfc_main = {
  __name: "products",
  __ssrInlineRender: true,
  setup(__props) {
    const products2 = ref([]);
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchProducts = async () => {
      isLoading.value = true;
      try {
        const res = await axios.get(useApi(`/api/products`));
        products2.value = res.data.data;
      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
      } finally {
        isLoading.value = false;
      }
    };
    const isExpiringSoon = (expDate) => {
      if (!expDate) return false;
      const today = /* @__PURE__ */ new Date();
      const expirationDate = new Date(expDate);
      const timeDiff = expirationDate - today;
      const daysRemaining = timeDiff / (1e3 * 60 * 60 * 24);
      return daysRemaining <= 90 && daysRemaining > 0;
    };
    const isExpiredOrToday = (expDate) => {
      if (!expDate) return false;
      const today = /* @__PURE__ */ new Date();
      const expirationDate = new Date(expDate);
      return expirationDate <= today;
    };
    const getTotalStock = (stocks) => {
      return stocks.reduce((total, stock) => total + parseInt(stock.stock, 10), 0);
    };
    const filteredProducts = computed(() => {
      return products2.value.filter((product) => {
        var _a, _b;
        const query = searchQuery.value.toLowerCase();
        return product.condition === "active" && (product.code.toLowerCase().includes(query) || product.name.toLowerCase().includes(query) || ((_b = (_a = product.category) == null ? void 0 : _a.name) == null ? void 0 : _b.toLowerCase().includes(query)) || product.price.toString().includes(query) || product.stocks.some((stock) => stock.exp_date.includes(query)) || getTotalStock(product.stocks).toString().includes(query) || product.condition.toLowerCase().includes(query));
      });
    });
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-59d211e6><div class="flex items-center justify-between mb-4" data-v-59d211e6><h1 class="text-2xl font-bold" data-v-59d211e6>Daftar Produk</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/product_pages/add_product",
        class: "inline-block p-2 text-white bg-green-500 rounded"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Tambah Produk `);
          } else {
            return [
              createTextVNode(" Tambah Produk ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center justify-between mb-4" data-v-59d211e6><div data-v-59d211e6><label class="mr-2" data-v-59d211e6>Show</label><select id="itemsPerPage" data-v-59d211e6><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-59d211e6${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-59d211e6>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-59d211e6></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-59d211e6><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-59d211e6></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-59d211e6><table class="min-w-full text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md" data-v-59d211e6><thead data-v-59d211e6><tr class="bg-gray-200" data-v-59d211e6><th class="p-2 border" data-v-59d211e6>#</th><th class="p-2 border" data-v-59d211e6>Foto</th><th class="p-2 border" data-v-59d211e6>Nama</th><th class="p-2 border" data-v-59d211e6>Kategori</th><th class="p-2 border" data-v-59d211e6>Harga</th><th class="p-2 border" data-v-59d211e6>Tanggal Kadaluarsa &amp; Stok</th><th class="p-2 border" data-v-59d211e6>Total Stok</th><th class="p-2 border" data-v-59d211e6>Aksi</th></tr></thead><tbody data-v-59d211e6><!--[-->`);
        ssrRenderList(paginatedProducts.value, (product) => {
          var _a;
          _push(`<tr data-v-59d211e6><td class="p-2 border" data-v-59d211e6>${ssrInterpolate(product.code)}</td><td class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2" data-v-59d211e6><img${ssrRenderAttr(
            "src",
            product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${product.photo}`) : fallbackImage
          )} class="w-20 h-20 object-fit" data-v-59d211e6></td><td class="p-3 border" data-v-59d211e6>`);
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
          _push(`</td><td class="p-2 border" data-v-59d211e6>${ssrInterpolate(((_a = product.category) == null ? void 0 : _a.name) || "Tidak ada")}</td><td class="p-2 border" data-v-59d211e6>${ssrInterpolate(formatPrice(product.price))}</td><td class="p-2 border" data-v-59d211e6><ul data-v-59d211e6><!--[-->`);
          ssrRenderList(product.stocks, (stock) => {
            _push(`<li class="${ssrRenderClass({
              "bg-red-500 text-white": isExpiredOrToday(stock.exp_date),
              "bg-yellow-200": isExpiringSoon(stock.exp_date),
              "p-2 rounded-md": true,
              "text-red-500": parseInt(stock.stock, 10) < 7
            })}" data-v-59d211e6><strong data-v-59d211e6>${ssrInterpolate(stock.exp_date)}</strong> - Stok: ${ssrInterpolate(parseInt(stock.stock, 10))}</li>`);
          });
          _push(`<!--]--></ul></td><td class="${ssrRenderClass([{ "text-red-500": getTotalStock(product.stocks) < 7 }, "p-2 font-bold border"])}" data-v-59d211e6>${ssrInterpolate(getTotalStock(product.stocks))}</td><td class="p-2 border" data-v-59d211e6>`);
          if (product.condition === "active") {
            _push(`<!--[-->`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/product_pages/edit/${product.id}`,
              class: "mr-2 text-blue-500"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Edit `);
                } else {
                  return [
                    createTextVNode(" Edit ")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<button class="text-red-500" data-v-59d211e6> Hapus </button><!--]-->`);
          } else {
            _push(`<!--[--><span class="font-bold text-red-500" data-v-59d211e6>Nonaktif</span><button class="p-1 ml-2 text-white bg-yellow-400 rounded" data-v-59d211e6> Batal </button><!--]-->`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-59d211e6><div data-v-59d211e6> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length))} of ${ssrInterpolate(filteredProducts.value.length)} entries </div><div class="flex items-center space-x-2" data-v-59d211e6><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-59d211e6> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-59d211e6>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-59d211e6> Next </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-59d211e6"]]);

export { products as default };
//# sourceMappingURL=products-DQYMkGW_.mjs.map
