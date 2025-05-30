import { ref, watch, nextTick, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const name = ref("");
    const code = ref("");
    const description = ref("");
    const isLoading = ref(true);
    const nameInputRef = ref(null);
    const codeInputRef = ref(null);
    const descTextarea = ref(null);
    const adjustNameHeight = () => {
      nextTick(() => {
        if (nameInputRef.value) {
          nameInputRef.value.style.height = "auto";
          nameInputRef.value.style.height = `${nameInputRef.value.scrollHeight}px`;
        }
      });
    };
    const adjustCodeHeight = () => {
      nextTick(() => {
        if (codeInputRef.value) {
          codeInputRef.value.style.height = "auto";
          codeInputRef.value.style.height = `${codeInputRef.value.scrollHeight}px`;
        }
      });
    };
    const adjustTextareaHeight = () => {
      if (descTextarea.value) {
        descTextarea.value.style.height = "auto";
        descTextarea.value.style.height = descTextarea.value.scrollHeight + "px";
      }
    };
    watch([name, code, description], () => {
      nextTick(() => {
        adjustTextareaHeight();
        adjustNameHeight();
        adjustCodeHeight();
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto p-6" }, _attrs))}><h1 class="mb-4 text-2xl font-bold">Edit Kategori</h1>`);
      if (isLoading.value) {
        _push(`<div class="text-center text-gray-500">Loading...</div>`);
      } else {
        _push(`<form><label class="mb-1 block">Nama Kategori:</label><textarea class="mb-2 w-full resize-none overflow-hidden border p-2" rows="1" required>${ssrInterpolate(name.value)}</textarea><label class="mb-1 block">Kode Kategori:</label><textarea class="mb-2 w-full resize-none overflow-hidden border p-2" rows="1" required>${ssrInterpolate(code.value)}</textarea><label class="mb-1 block">Deskripsi:</label><textarea class="mb-2 w-full resize-none overflow-hidden border p-2" rows="10">${ssrInterpolate(description.value)}</textarea><button class="mb-4 mr-2 rounded bg-gray-500 px-4 py-2 text-white"> Kembali </button><button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white"> Simpan Perubahan </button></form>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category_pages/edit/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BcpDxNIb.mjs.map
