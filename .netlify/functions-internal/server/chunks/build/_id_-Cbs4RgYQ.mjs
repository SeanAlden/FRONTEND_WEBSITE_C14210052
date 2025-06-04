import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'consola/core';
import 'axios';

const fallbackImage = "/assets/images/photo_default.png";
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const employee = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))}><h1 class="mb-4 text-2xl font-bold text-center">Detail Karyawan</h1>`);
      if (employee.value) {
        _push(`<div class="p-6 bg-white rounded-lg shadow-md"><div class="flex flex-col items-center text-center md:flex-col md:text-left"><img${ssrRenderAttr(
          "src",
          employee.value.employee_photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${employee.value.employee_photo}`) : fallbackImage
        )} class="object-cover w-40 h-40 mb-4 rounded-lg"><div class="w-full"><p><strong>Kode:</strong> ${ssrInterpolate(employee.value.code)}</p><p><strong>Nama:</strong> ${ssrInterpolate(employee.value.employee_name)}</p><p><strong>Posisi:</strong> ${ssrInterpolate(employee.value.employee_position)}</p><p><strong>Kontak:</strong> ${ssrInterpolate(employee.value.employee_contact)}</p><p><strong>Tanggal Lahir:</strong> ${ssrInterpolate(employee.value.employee_birth)}</p><p><strong>Deskripsi:</strong></p><p class="whitespace-pre-line">${ssrInterpolate(employee.value.employee_description)}</p></div></div><div class="flex justify-center mt-4">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/employee_pages/employees",
          class: "px-4 py-2 text-white bg-gray-600 rounded"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Kembali `);
            } else {
              return [
                createTextVNode(" Kembali ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<p class="text-center text-red-500">Data karyawan tidak ditemukan.</p>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employee_pages/detail/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Cbs4RgYQ.mjs.map
