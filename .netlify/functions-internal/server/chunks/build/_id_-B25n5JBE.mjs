import { _ as __nuxt_component_0 } from './nuxt-link-D5njNngX.mjs';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
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
import 'node:util';
import 'node:process';
import 'node:tty';
import 'mitt';
import 'axios';

const fallbackImage = "/assets/images/avatar.png";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl p-6 mx-auto" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category_pages/categories",
        class: "inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
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
        _push(`<div class="p-6 mt-4 bg-white rounded shadow-md"><h1 class="text-2xl font-bold">${ssrInterpolate(category.value.name)} - (${ssrInterpolate(category.value.code)})</h1><div class="mt-4"><label for="category-description" class="block font-semibold">Deskripsi</label><textarea id="category-description" rows="10" readonly class="w-full p-3 mt-1 text-gray-800 bg-gray-100 border rounded-md resize-none">${ssrInterpolate(category.value.description)}</textarea></div><div class="mt-4"><h2 class="text-lg font-semibold">Produk Terkait</h2>`);
        if (category.value.products && category.value.products.length > 0) {
          _push(`<div><div class="grid grid-cols-1 gap-10 mt-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(category.value.products, (product) => {
            _push(`<div class="p-4 border rounded shadow"><img${ssrRenderAttr(
              "src",
              product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${product.photo}`) : fallbackImage
            )} class="w-full h-40 object-fit-contain"><h3 class="mt-2 font-semibold">${ssrInterpolate(product.name)}</h3><p class="text-sm text-gray-600">Kode: ${ssrInterpolate(product.code)}</p><p class="text-sm text-gray-600">Harga: ${ssrInterpolate(formatPrice(product.price))}</p><p class="text-sm text-gray-600">Total Stok: ${ssrInterpolate(product.total_stock)}</p></div>`);
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
//# sourceMappingURL=_id_-B25n5JBE.mjs.map
