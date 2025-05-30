import axios from 'axios';
import { ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  setup() {
    const weightedSales = ref({});
    const productNames = ref({});
    const productPrices = ref({});
    const productCodes = ref({});
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/analysis/countAttributes"
        );
        const data = response.data;
        weightedSales.value = data.weightedSales;
        data.transactions.forEach((transaction) => {
          transaction.details.forEach((detail) => {
            productNames.value[detail.product.id] = detail.product.name;
            productPrices.value[detail.product.id] = detail.product.price;
            productCodes.value[detail.product.id] = detail.product.code;
          });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const filteredProducts = computed(() => {
      return Object.entries(weightedSales.value).filter(([productId, sales]) => {
        var _a;
        const name = productNames.value[productId] || "";
        const code = productCodes.value[productId] || "";
        const price = ((_a = productPrices.value[productId]) == null ? void 0 : _a.toString()) || "";
        const raw = sales.raw.toString();
        const weighted = sales.weighted.toFixed(2);
        const query = searchQuery.value.toLowerCase();
        return [name, code, price, raw, weighted].some(
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
      fetchData();
    });
    return {
      formatPrice,
      weightedSales,
      productNames,
      productPrices,
      productCodes,
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
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-b8be37b8><h1 class="text-2xl font-bold" data-v-b8be37b8> Proses Analisis - Menghitung Bobot Waktu &amp; Total Penjualan Berbobot </h1><button class="px-4 py-2 mt-4 text-white bg-blue-500 rounded" data-v-b8be37b8> Entropy &amp; Gain </button><h2 class="mt-6 text-lg font-semibold" data-v-b8be37b8>2. Perhitungan Total Penjualan Berbobot</h2><div class="flex justify-between my-4" data-v-b8be37b8><div data-v-b8be37b8><label class="mr-2" data-v-b8be37b8>Show</label><select id="itemsPerPage" data-v-b8be37b8><!--[-->`);
  ssrRenderList($setup.itemsPerPageOptions, (option) => {
    _push(`<option${ssrRenderAttr("value", option)} data-v-b8be37b8${ssrIncludeBooleanAttr(Array.isArray($setup.itemsPerPage) ? ssrLooseContain($setup.itemsPerPage, option) : ssrLooseEqual($setup.itemsPerPage, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
  });
  _push(`<!--]--></select><span class="ml-2" data-v-b8be37b8>entries</span></div><input type="text"${ssrRenderAttr("value", $setup.searchQuery)} placeholder="Search" class="p-2 border rounded" data-v-b8be37b8></div>`);
  if ($setup.isLoading) {
    _push(`<div class="flex items-center justify-center py-10" data-v-b8be37b8><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-b8be37b8></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$setup.isLoading) {
    _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-b8be37b8><table class="w-full mt-2 bg-white border" data-v-b8be37b8><thead data-v-b8be37b8><tr class="bg-gray-200" data-v-b8be37b8><th class="p-2 border" data-v-b8be37b8>Product Name</th><th class="p-2 border" data-v-b8be37b8>Product Code</th><th class="p-2 border" data-v-b8be37b8>Product Price</th><th class="p-2 border" data-v-b8be37b8>Raw Sales</th><th class="p-2 border" data-v-b8be37b8>Weighted Sales</th></tr></thead><tbody data-v-b8be37b8><!--[-->`);
    ssrRenderList($setup.paginatedProducts, (sales, productId) => {
      _push(`<tr data-v-b8be37b8><td class="p-2 border" data-v-b8be37b8>${ssrInterpolate($setup.productNames[productId])}</td><td class="p-2 border" data-v-b8be37b8>${ssrInterpolate($setup.productCodes[productId])}</td><td class="p-2 border" data-v-b8be37b8>${ssrInterpolate($setup.formatPrice($setup.productPrices[productId]))}</td><td class="p-2 border" data-v-b8be37b8>${ssrInterpolate(sales.raw)}</td><td class="p-2 border" data-v-b8be37b8>${ssrInterpolate(sales.weighted.toFixed(2))}</td></tr>`);
    });
    _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-b8be37b8><div data-v-b8be37b8> Showing ${ssrInterpolate(($setup.currentPage - 1) * $setup.itemsPerPage + 1)} to ${ssrInterpolate(Math.min($setup.currentPage * $setup.itemsPerPage, $setup.filteredProducts.length))} of ${ssrInterpolate($setup.filteredProducts.length)} entries </div><div class="flex items-center space-x-2" data-v-b8be37b8><button${ssrIncludeBooleanAttr($setup.currentPage === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-b8be37b8> Prev </button><!--[-->`);
    ssrRenderList($setup.generatePagination, (page) => {
      _push(`<button class="${ssrRenderClass([{
        "bg-blue-500 text-white": $setup.currentPage === page,
        "bg-white text-blue-500 hover:bg-blue-100": $setup.currentPage !== page && page !== "..."
      }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-b8be37b8>${ssrInterpolate(page)}</button>`);
    });
    _push(`<!--]--><button${ssrIncludeBooleanAttr($setup.currentPage === $setup.totalPages) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-b8be37b8> Next </button></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analysis_pages/weight_count_page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const weight_count_page = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-b8be37b8"]]);

export { weight_count_page as default };
//# sourceMappingURL=weight_count_page-C7iqOkgn.mjs.map
