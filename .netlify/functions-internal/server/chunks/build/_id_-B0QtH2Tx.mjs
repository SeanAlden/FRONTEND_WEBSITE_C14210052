import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
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
      _push(`<br><br><h1 class="mb-4 text-2xl font-bold">Detail Produk</h1>`);
      if (isLoading.value) {
        _push(`<div class="text-center">Memuat...</div>`);
      } else if (error.value) {
        _push(`<div class="text-red-500">${ssrInterpolate(error.value)}</div>`);
      } else if (product.value) {
        _push(`<div class="p-4 border rounded shadow"><img${ssrRenderAttr(
          "src",
          product.value.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${product.value.photo}`) : "/assets/images/avatar.png"
        )} class="w-48 h-full mb-4l object-fit"><br><h2 class="text-xl font-semibold">${ssrInterpolate(product.value.name)}</h2><p><strong>Kode:</strong> ${ssrInterpolate(product.value.code)}</p><p><strong>Kategori:</strong> ${ssrInterpolate(((_a = product.value.category) == null ? void 0 : _a.name) || "Tidak ada")}</p><p><strong>Harga:</strong> ${ssrInterpolate(formatPrice(product.value.price))}</p><p><strong>Deskripsi:</strong></p><p class="whitespace-pre-line">${ssrInterpolate(product.value.description || "Tidak ada deskripsi")}</p><h3 class="mt-4 text-lg font-semibold">Stok per Tanggal Kadaluarsa</h3><table class="w-full mt-2 border"><thead><tr class="bg-gray-200"><th class="p-2 border">Tanggal Kadaluarsa</th><th class="p-2 border">Jumlah Stok</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(product.value.stocks, (stock) => {
          _push(`<tr><td class="p-2 text-center border">${ssrInterpolate(stock.exp_date)}</td><td class="p-2 text-center border">${ssrInterpolate(stock.stock)}</td></tr>`);
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
//# sourceMappingURL=_id_-B0QtH2Tx.mjs.map
