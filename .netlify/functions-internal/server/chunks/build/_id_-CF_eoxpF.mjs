import { ref, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const categories = ref([]);
    const productImage = ref(null);
    const expStockList = ref([]);
    const errorMessage = ref("");
    ref(null);
    const product = reactive({
      name: "",
      code: "",
      category_id: "",
      price: "",
      description: "",
      photo: null
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6" }, _attrs))}><h1 class="mb-4 text-2xl font-bold">Edit Produk</h1><form enctype="multipart/form-data"><label>Nama Produk:</label><textarea required class="w-full p-2 overflow-hidden border resize-none" rows="1">${ssrInterpolate(product.name)}</textarea><label>Kode Produk:</label><textarea required class="w-full p-2 overflow-hidden border resize-none" rows="1">${ssrInterpolate(product.code)}</textarea><label>Kategori:</label><select required class="w-full p-2 border"><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", String(cat.id))}${ssrIncludeBooleanAttr(Array.isArray(product.category_id) ? ssrLooseContain(product.category_id, String(cat.id)) : ssrLooseEqual(product.category_id, String(cat.id))) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><label>Harga:</label><input${ssrRenderAttr("value", product.price)} type="number" required class="w-full p-2 border"><div><label>Tanggal Expired &amp; Stoknya:</label><!--[-->`);
      ssrRenderList(expStockList.value, (item, index) => {
        _push(`<div class="flex items-center gap-2 mb-2"><input${ssrRenderAttr("value", item.exp_date)} type="date" required class="p-2 border"><span class="inline-block w-24 p-2 border select-none">${ssrInterpolate(item.stock)}</span></div>`);
      });
      _push(`<!--]--></div><label>Deskripsi:</label><textarea placeholder="Deskripsi" class="w-full p-2 border" rows="3" style="${ssrRenderStyle({ "resize": "none", "overflow-y": "hidden" })}" required>${ssrInterpolate(product.description)}</textarea><label>Foto Produk:</label>`);
      if (productImage.value) {
        _push(`<div class="mb-2"><img${ssrRenderAttr("src", productImage.value)} alt="Foto Produk" class="object-cover w-40 h-40 border rounded"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input type="file" class="w-full p-2 border">`);
      if (errorMessage.value) {
        _push(`<p class="p-2 mt-2 text-red-500 bg-red-100 border border-red-400 rounded">${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-start"><button type="button" class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"> Kembali </button><button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"> Simpan Perubahan </button></div></form></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/edit/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CF_eoxpF.mjs.map
