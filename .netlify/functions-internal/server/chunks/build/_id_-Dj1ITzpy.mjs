import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
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

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    route.params.id;
    const code = ref("");
    const employee_name = ref("");
    const employee_photo = ref(null);
    const employee_position = ref("");
    const employee_birth = ref("");
    const employee_contact = ref("");
    const employee_description = ref("");
    ref(null);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))}><h1 class="mb-4 text-2xl font-bold">Edit Karyawan</h1><form class="space-y-4"><div><label class="block text-gray-600">Foto</label><img${ssrRenderAttr(
        "src",
        employee_photo.value ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${employee_photo.value}`) : "/assets/images/photo_default.png"
      )} class="w-20 h-20 object-fit"><input type="file" class="w-full p-2 border rounded"></div><div><label class="block text-gray-600">Nama</label><textarea placeholder="Nama Karyawan" class="w-full p-2 overflow-hidden border rounded resize-none" rows="3" required>${ssrInterpolate(employee_name.value)}</textarea></div><div><label class="block text-gray-600">Kode</label><input${ssrRenderAttr("value", code.value)} type="text" placeholder="Kode Karyawan" class="w-full p-2 border rounded" required></div><div><label class="block text-gray-600">Posisi</label><input${ssrRenderAttr("value", employee_position.value)} type="text" placeholder="Jabatan / Posisi" class="w-full p-2 border rounded" required></div><div><label class="block text-gray-600">Tanggal Lahir</label><input${ssrRenderAttr("value", employee_birth.value)} type="date" class="w-full p-2 border rounded" required></div><div><label class="block text-gray-600">Kontak</label><input${ssrRenderAttr("value", employee_contact.value)} type="text" placeholder="Nomor Telepon" class="w-full p-2 border rounded" required></div><div><label class="block text-gray-600">Deskripsi</label><textarea placeholder="Deskripsi Karyawan" class="w-full p-2 overflow-hidden border rounded resize-none" rows="3" required>${ssrInterpolate(employee_description.value)}</textarea></div><div class="flex justify-start"><button type="button" class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"> Kembali </button><button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"> Simpan Perubahan </button></div></form></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employee_pages/edit/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Dj1ITzpy.mjs.map
