import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import axios from 'axios';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
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

const _sfc_main = {
  __name: "categories",
  __ssrInlineRender: true,
  setup(__props) {
    const categories2 = ref([]);
    const searchQuery = ref("");
    ref(false);
    ref(null);
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchCategories = async () => {
      var _a;
      isLoading.value = true;
      try {
        const response = await axios.get(useApi("/api/categories"));
        categories2.value = ((_a = response.data) == null ? void 0 : _a.length) ? response.data : [];
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const filteredCategories = computed(() => {
      return categories2.value.filter((category) => {
        const query = searchQuery.value.toLowerCase();
        return category.name.toLowerCase().includes(query) || category.products && category.products.some((product) => product.name.toLowerCase().includes(query));
      });
    });
    const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredCategories.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredCategories.value.length / itemsPerPage.value);
    });
    const generatePagination = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const pages = [];
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
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
      fetchCategories();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-6" }, _attrs))} data-v-94b5441c><div class="mb-4 flex items-center justify-between" data-v-94b5441c><h1 class="mb-4 text-2xl font-bold" data-v-94b5441c>Daftar Kategori</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category_pages/add_category",
        class: "mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Tambah Kategori `);
          } else {
            return [
              createTextVNode(" Tambah Kategori ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mb-4 flex items-center justify-between" data-v-94b5441c><div data-v-94b5441c><label class="mr-2" data-v-94b5441c>Show</label><select id="itemsPerPage" data-v-94b5441c><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-94b5441c${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-94b5441c>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="rounded border p-2" data-v-94b5441c></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-94b5441c><div class="loader h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear" data-v-94b5441c></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="${ssrRenderClass([{ "opacity-50 pointer-events-none": isLoading.value }, "overflow-x-auto whitespace-nowrap transition-opacity duration-300"])}" data-v-94b5441c><table class="min-w-full rounded-lg border-gray-300 bg-white text-gray-700 shadow-md" data-v-94b5441c><thead data-v-94b5441c><tr class="bg-gray-200" data-v-94b5441c><th class="p-3" data-v-94b5441c>#</th><th class="p-3" data-v-94b5441c>Nama</th><th class="p-3" data-v-94b5441c>Produk</th><th class="p-3" data-v-94b5441c>Aksi</th></tr></thead><!--[-->`);
        ssrRenderList(paginatedCategories.value, (category) => {
          _push(`<tr class="border-t" data-v-94b5441c><td class="p-3" data-v-94b5441c>${ssrInterpolate(category.code)}</td><td class="p-3" data-v-94b5441c>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/category_pages/detail/${category.id}`,
            class: "text-blue-500 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(category.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(category.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="p-3" data-v-94b5441c>`);
          if (category.products && category.products.length > 0) {
            _push(`<ul data-v-94b5441c><!--[-->`);
            ssrRenderList(category.products, (product) => {
              _push(`<li data-v-94b5441c>${ssrInterpolate(product.name)} - ${ssrInterpolate(product.code)}</li>`);
            });
            _push(`<!--]--></ul>`);
          } else {
            _push(`<span class="text-gray-500" data-v-94b5441c>Tidak ada produk</span>`);
          }
          _push(`</td><td class="p-3" data-v-94b5441c>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/category_pages/edit/${category.id}`,
            class: "text-blue-500"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Edit`);
              } else {
                return [
                  createTextVNode("Edit")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button class="${ssrRenderClass([
            category.products && category.products.length > 0 ? "text-gray-500 cursor-not-allowed" : "text-red-500",
            "ml-2"
          ])}"${ssrIncludeBooleanAttr(category.products && category.products.length > 0) ? " disabled" : ""} data-v-94b5441c> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></table><div class="mt-4 flex justify-between" data-v-94b5441c><div data-v-94b5441c> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredCategories.value.length))} of ${ssrInterpolate(filteredCategories.value.length)} entries </div><div class="flex items-center space-x-2" data-v-94b5441c><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50" data-v-94b5441c> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "rounded border px-3 py-1 transition-all duration-200"])}" data-v-94b5441c>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50" data-v-94b5441c> Next </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category_pages/categories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const categories = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-94b5441c"]]);

export { categories as default };
//# sourceMappingURL=categories-CHD8K6lM.mjs.map
