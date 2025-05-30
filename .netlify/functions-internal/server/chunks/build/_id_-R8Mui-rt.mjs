import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
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
import 'consola/core';
import 'axios';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const category = ref(null);
    const isLoading = ref(true);
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl p-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category_pages/categories",
        class: "mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back `);
          } else {
            return [
              createTextVNode(" Back ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (isLoading.value) {
        _push(`<div class="mt-6 text-center text-gray-500">Loading...</div>`);
      } else if (category.value) {
        _push(`<div class="mt-4 rounded bg-white p-6 shadow-md"><h1 class="text-2xl font-bold">${ssrInterpolate(category.value.name)} - (${ssrInterpolate(category.value.code)})</h1><div class="mt-4"><label for="category-description" class="block font-semibold">Deskripsi</label><textarea id="category-description" rows="10" readonly class="mt-1 w-full resize-none rounded-md border bg-gray-100 p-3 text-gray-800">${ssrInterpolate(category.value.description)}</textarea></div><div class="mt-4"><h2 class="text-lg font-semibold">Produk Terkait</h2>`);
        if (category.value.products && category.value.products.length > 0) {
          _push(`<div><div class="mt-4 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(category.value.products, (product) => {
            _push(`<div class="rounded border p-4 shadow"><img${ssrRenderAttr(
              "src",
              product.photo ? `http://localhost:8000/storage/${product.photo}` : "/assets/images/avatar.png"
            )} class="object-fit-contain h-40 w-full"><h3 class="mt-2 font-semibold">${ssrInterpolate(product.name)}</h3><p class="text-sm text-gray-600">Kode: ${ssrInterpolate(product.code)}</p><p class="text-sm text-gray-600">Harga: ${ssrInterpolate(formatPrice(product.price))}</p><p class="text-sm text-gray-600">Total Stok: ${ssrInterpolate(product.total_stock)}</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<p class="mt-2 text-gray-500">Tidak ada produk terkait.</p>`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category_pages/detail/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-R8Mui-rt.mjs.map
