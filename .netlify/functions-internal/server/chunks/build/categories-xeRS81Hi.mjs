import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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
import 'axios';

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
    const getCategories = async () => {
      try {
        const response = await fetch(
          useApi(`/api/categories`),
          {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
            // body: JSON.stringify({
            //   summoner: this.sumInput,
            //   region: this.regInput,
            // }),
          }
        );
        return await response.json();
      } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
      }
    };
    const fetchCategories = async () => {
      isLoading.value = true;
      const data = await getCategories();
      categories2.value = data || [];
      isLoading.value = false;
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-122bdb86><div class="flex items-center justify-between mb-4" data-v-122bdb86><h1 class="mb-4 text-2xl font-bold" data-v-122bdb86>Daftar Kategori</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category_pages/add_category",
        class: "inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
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
      _push(`</div><div class="flex items-center justify-between mb-4" data-v-122bdb86><div data-v-122bdb86><label class="mr-2" data-v-122bdb86>Show</label><select id="itemsPerPage" data-v-122bdb86><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-122bdb86${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-122bdb86>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-122bdb86></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-122bdb86><div class="w-12 h-12 ease-linear border-4 border-t-4 border-gray-200 rounded-full loader" data-v-122bdb86></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="${ssrRenderClass([{ "opacity-50 pointer-events-none": isLoading.value }, "overflow-x-auto transition-opacity duration-300 whitespace-nowrap"])}" data-v-122bdb86><table class="min-w-full text-gray-700 bg-white border-gray-300 rounded-lg shadow-md" data-v-122bdb86><thead data-v-122bdb86><tr class="bg-gray-200" data-v-122bdb86><th class="p-3" data-v-122bdb86>#</th><th class="p-3" data-v-122bdb86>Nama</th><th class="p-3" data-v-122bdb86>Produk</th><th class="p-3" data-v-122bdb86>Aksi</th></tr></thead><!--[-->`);
        ssrRenderList(paginatedCategories.value, (category) => {
          _push(`<tr class="border-t" data-v-122bdb86><td class="p-3" data-v-122bdb86>${ssrInterpolate(category.code)}</td><td class="p-3" data-v-122bdb86>`);
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
          _push(`</td><td class="p-3" data-v-122bdb86>`);
          if (category.products && category.products.length > 0) {
            _push(`<ul data-v-122bdb86><!--[-->`);
            ssrRenderList(category.products, (product) => {
              _push(`<li data-v-122bdb86>${ssrInterpolate(product.name)} - ${ssrInterpolate(product.code)}</li>`);
            });
            _push(`<!--]--></ul>`);
          } else {
            _push(`<span class="text-gray-500" data-v-122bdb86>Tidak ada produk</span>`);
          }
          _push(`</td><td class="p-3" data-v-122bdb86>`);
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
          ])}"${ssrIncludeBooleanAttr(category.products && category.products.length > 0) ? " disabled" : ""} data-v-122bdb86> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></table><div class="flex justify-between mt-4" data-v-122bdb86><div data-v-122bdb86> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredCategories.value.length))} of ${ssrInterpolate(filteredCategories.value.length)} entries </div><div class="flex items-center space-x-2" data-v-122bdb86><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-122bdb86> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-122bdb86>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-122bdb86> Next </button></div></div></div>`);
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
const categories = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-122bdb86"]]);

export { categories as default };
//# sourceMappingURL=categories-xeRS81Hi.mjs.map
