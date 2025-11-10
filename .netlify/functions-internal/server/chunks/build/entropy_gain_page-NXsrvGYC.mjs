import { ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  setup() {
    const entropyValues = ref({});
    const gainValues = ref({});
    const products = ref({});
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const filteredProducts = computed(() => {
      return Object.entries(gainValues.value).filter(([id, gain]) => {
        var _a, _b, _c, _d, _e;
        const name = ((_a = products.value[id]) == null ? void 0 : _a.name) || "";
        const code = ((_b = products.value[id]) == null ? void 0 : _b.code) || "";
        const price = ((_d = (_c = products.value[id]) == null ? void 0 : _c.price) == null ? void 0 : _d.toString()) || "";
        const entropy = ((_e = entropyValues.value[id]) == null ? void 0 : _e.toFixed(4)) || "";
        const gainValue = (gain == null ? void 0 : gain.toFixed(4)) || "";
        const query = searchQuery.value.toLowerCase();
        return [name, code, price, entropy, gainValue].some(
          (field) => field.toLowerCase().includes(query)
        );
      });
    });
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return Object.fromEntries(
        filteredProducts.value.slice(start, start + itemsPerPage.value)
      );
    });
    const totalPages = computed(
      () => Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const generatePagination = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const pages = [];
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", total);
      } else if (current >= total - 3) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
      return pages;
    });
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value && page !== "...") {
        currentPage.value = page;
      }
    };
    watch(itemsPerPage, () => {
      currentPage.value = 1;
    });
    return {
      formatPrice,
      entropyValues,
      gainValues,
      products,
      searchQuery,
      itemsPerPageOptions,
      itemsPerPage,
      currentPage,
      filteredProducts,
      paginatedProducts,
      totalPages,
      generatePagination,
      changePage,
      isLoading
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-913b2f62><h1 class="mb-4 text-xl font-bold" data-v-913b2f62>Prediksi Produk Terlaris - Algoritma C4.5</h1><div class="mt-4" data-v-913b2f62><button class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700" data-v-913b2f62> Decision Tree </button></div><h2 class="mt-6 text-lg font-semibold" data-v-913b2f62>1. Perhitungan Entropy &amp; Gain</h2><div class="flex justify-between my-4" data-v-913b2f62><div class="overflow-x-auto whitespace-nowrap" data-v-913b2f62><label class="mr-2" data-v-913b2f62>Show</label><select id="itemsPerPage" data-v-913b2f62><!--[-->`);
  ssrRenderList($setup.itemsPerPageOptions, (option) => {
    _push(`<option${ssrRenderAttr("value", option)} data-v-913b2f62${ssrIncludeBooleanAttr(Array.isArray($setup.itemsPerPage) ? ssrLooseContain($setup.itemsPerPage, option) : ssrLooseEqual($setup.itemsPerPage, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
  });
  _push(`<!--]--></select><span class="ml-2" data-v-913b2f62>entries</span></div><input type="text"${ssrRenderAttr("value", $setup.searchQuery)} placeholder="Search" class="p-2 border rounded" data-v-913b2f62></div>`);
  if ($setup.isLoading) {
    _push(`<div class="flex items-center justify-center py-10" data-v-913b2f62><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-913b2f62></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$setup.isLoading) {
    _push(`<div data-v-913b2f62><table class="w-full mt-2 bg-white border border-collapse border-gray-300 table-auto" data-v-913b2f62><thead data-v-913b2f62><tr class="bg-gray-200" data-v-913b2f62><th class="p-2 border" data-v-913b2f62>Atribut (Produk)</th><th class="p-2 border" data-v-913b2f62>Kode Produk</th><th class="p-2 border" data-v-913b2f62>Harga Produk</th><th class="p-2 border" data-v-913b2f62>Entropy</th><th class="p-2 border" data-v-913b2f62>Gain</th></tr></thead><tbody data-v-913b2f62><!--[-->`);
    ssrRenderList($setup.paginatedProducts, (gain, id) => {
      var _a, _b, _c;
      _push(`<tr data-v-913b2f62><td class="p-2 border" data-v-913b2f62>${ssrInterpolate(((_a = $setup.products[id]) == null ? void 0 : _a.name) || "Unknown")}</td><td class="p-2 border" data-v-913b2f62>${ssrInterpolate(((_b = $setup.products[id]) == null ? void 0 : _b.code) || "Unknown")}</td><td class="p-2 border" data-v-913b2f62>${ssrInterpolate($setup.formatPrice(((_c = $setup.products[id]) == null ? void 0 : _c.price) || "Unknown"))}</td><td class="p-2 border" data-v-913b2f62>${ssrInterpolate($setup.entropyValues[id].toFixed(4))}</td><td class="p-2 border" data-v-913b2f62>${ssrInterpolate(gain.toFixed(4))}</td></tr>`);
    });
    _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-913b2f62><div data-v-913b2f62> Showing ${ssrInterpolate(($setup.currentPage - 1) * $setup.itemsPerPage + 1)} to ${ssrInterpolate(Math.min($setup.currentPage * $setup.itemsPerPage, $setup.filteredProducts.length))} of ${ssrInterpolate($setup.filteredProducts.length)} entries </div><div class="flex items-center space-x-2" data-v-913b2f62><button${ssrIncludeBooleanAttr($setup.currentPage === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-913b2f62> Prev </button><!--[-->`);
    ssrRenderList($setup.generatePagination, (page) => {
      _push(`<button class="${ssrRenderClass([{
        "bg-blue-500 text-white": $setup.currentPage === page,
        "bg-white text-blue-500 hover:bg-blue-100": $setup.currentPage !== page && page !== "..."
      }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-913b2f62>${ssrInterpolate(page)}</button>`);
    });
    _push(`<!--]--><button${ssrIncludeBooleanAttr($setup.currentPage === $setup.totalPages) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-913b2f62> Next </button></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analysis_pages/entropy_gain_page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const entropy_gain_page = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-913b2f62"]]);

export { entropy_gain_page as default };
//# sourceMappingURL=entropy_gain_page-NXsrvGYC.mjs.map
