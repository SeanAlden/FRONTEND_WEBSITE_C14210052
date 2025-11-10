import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useRouter } from 'vue-router';

const _sfc_main = {
  __name: "add_category",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const name = ref("");
    const code = ref("");
    const description = ref("");
    ref(null);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 mx-auto" }, _attrs))}><h1 class="mb-4 text-2xl font-bold">Tambah Kategori</h1><form><div class="relative"><textarea placeholder="Nama" class="w-full p-2 mb-2 overflow-hidden border resize-none" rows="1">${ssrInterpolate(name.value)}</textarea></div><div class="relative"><textarea placeholder="Kode" class="w-full p-2 mb-2 overflow-hidden border resize-none" rows="1">${ssrInterpolate(code.value)}</textarea></div><div class="relative"><textarea placeholder="Deskripsi" class="w-full p-2 mb-2 overflow-hidden border resize-none" rows="10">${ssrInterpolate(description.value)}</textarea></div><button class="px-4 py-2 mb-4 mr-2 text-white bg-gray-500 rounded">Kembali</button><button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded">Tambah Kategori</button></form></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category_pages/add_category.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add_category-CCbLWcD3.mjs.map
