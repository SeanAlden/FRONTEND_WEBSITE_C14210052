import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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
    const product = ref(null);
    const isLoading = ref(true);
    const error = ref(null);
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/product_pages/products",
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
      _push(`<br><br><h1 class="mb-4 text-2xl font-bold">Detail Produk</h1>`);
      if (isLoading.value) {
        _push(`<div class="text-center">Memuat...</div>`);
      } else if (error.value) {
        _push(`<div class="text-red-500">${ssrInterpolate(error.value)}</div>`);
      } else if (product.value) {
        _push(`<div class="rounded border p-4 shadow"><img${ssrRenderAttr(
          "src",
          product.value.photo ? `http://localhost:8000/storage/${product.value.photo}` : "/assets/images/avatar.png"
        )} class="mb-4l object-fit h-full w-48"><br><h2 class="text-xl font-semibold">${ssrInterpolate(product.value.name)}</h2><p><strong>Kode:</strong> ${ssrInterpolate(product.value.code)}</p><p><strong>Kategori:</strong> ${ssrInterpolate(((_a = product.value.category) == null ? void 0 : _a.name) || "Tidak ada")}</p><p><strong>Harga:</strong> ${ssrInterpolate(formatPrice(product.value.price))}</p><p><strong>Deskripsi:</strong></p><p class="whitespace-pre-line">${ssrInterpolate(product.value.description || "Tidak ada deskripsi")}</p><h3 class="mt-4 text-lg font-semibold">Stok per Tanggal Kadaluarsa</h3><table class="mt-2 w-full border"><thead><tr class="bg-gray-200"><th class="border p-2">Tanggal Kadaluarsa</th><th class="border p-2">Jumlah Stok</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(product.value.stocks, (stock) => {
          _push(`<tr><td class="border p-2 text-center">${ssrInterpolate(stock.exp_date)}</td><td class="border p-2 text-center">${ssrInterpolate(stock.stock)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/detail/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Cig7hGmx.mjs.map
