import { ref, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRouter } from 'vue-router';

const _sfc_main = {
  __name: "add_product",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const categories = ref([]);
    ref([]);
    const form = reactive({
      name: "",
      code: "",
      category_id: "",
      price: "",
      description: "",
      photo: null,
      stocks: [{ stock: "", exp_date: "" }]
      // Awal dengan satu input stok
    });
    ref(null);
    ref(null);
    const codeError = ref("");
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6" }, _attrs))}><h1 class="mb-4 text-2xl font-bold">Tambah Produk</h1><form><label>Nama Produk:</label><textarea rows="1" required class="w-full p-2 overflow-hidden border resize-none">${ssrInterpolate(form.name)}</textarea><label>Kode Produk:</label><textarea rows="1" required class="w-full p-2 overflow-hidden border resize-none">${ssrInterpolate(form.code)}</textarea>`);
      if (codeError.value) {
        _push(`<p class="text-red-500">${ssrInterpolate(codeError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label>Kategori:</label><select required class="w-full p-2 border"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.category_id) ? ssrLooseContain(form.category_id, "") : ssrLooseEqual(form.category_id, "")) ? " selected" : ""}>Pilih Kategori</option><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(form.category_id) ? ssrLooseContain(form.category_id, cat.id) : ssrLooseEqual(form.category_id, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><label>Harga:</label><input${ssrRenderAttr("value", form.price)} type="number" required class="w-full p-2 border"><label>Stok &amp; Tanggal Kadaluarsa:</label><!--[-->`);
      ssrRenderList(form.stocks, (stock, index) => {
        _push(`<div class="flex gap-2 mb-2"><input${ssrRenderAttr("value", stock.stock)} type="number" placeholder="Jumlah Stok" required class="w-1/2 p-2 border"><input${ssrRenderAttr("value", stock.exp_date)} type="date" required class="w-1/2 p-2 border">`);
        if (form.stocks.length > 1) {
          _push(`<button type="button" class="p-2 text-white bg-red-500 rounded"> \u2715 </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--><button type="button" class="p-2 mb-4 text-white bg-blue-500 rounded"> + Tambah Stok </button><label>Deskripsi:</label><textarea required class="w-full p-2 overflow-hidden border resize-none">${ssrInterpolate(form.description)}</textarea><label>Foto Produk:</label><input type="file" class="w-full p-2 border">`);
      if (errorMessage.value) {
        _push(`<p class="p-2 mt-2 text-red-500 bg-red-100 border border-red-400 rounded">${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-start mb-4"><button type="button" class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"> Kembali </button><button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"> Tambah Produk </button></div></form></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/add_product.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add_product-Cgyh3D8t.mjs.map
