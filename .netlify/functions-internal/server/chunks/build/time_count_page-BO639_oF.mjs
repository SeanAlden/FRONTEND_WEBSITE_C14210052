import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { ref, computed, watch, useSSRContext } from 'vue';
import { useRouter } from 'vue-router';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "time_count_page",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    ref({});
    const productNames = ref({});
    const productCodes = ref({});
    const firstTransactionDates = ref({});
    const lastTransactionDates = ref({});
    const productDateDifferences = ref({});
    const productTimeWeights = ref({});
    const searchQuery = ref("");
    const currentPage = ref(1);
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const isLoading = ref(true);
    const productIds = computed(() => Object.keys(productTimeWeights.value));
    const filteredProductIds = computed(() => {
      return productIds.value.filter((productId) => {
        const name = productNames.value[productId] || "";
        const code = productCodes.value[productId] || "";
        const query = searchQuery.value.toLowerCase();
        return [name, code].some((field) => field.toLowerCase().includes(query));
      });
    });
    const totalPages = computed(
      () => Math.ceil(filteredProductIds.value.length / itemsPerPage.value)
    );
    const paginatedProductIds = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredProductIds.value.slice(start, start + itemsPerPage.value);
    });
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
    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    }
    function formatDayHour(diffInDays) {
      const days = Math.floor(diffInDays);
      const hours = Math.round((diffInDays - days) * 24);
      return `${days} Hari, ${hours} Jam`;
    }
    watch(itemsPerPage, () => {
      currentPage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-cc6b4756><h1 class="text-2xl font-bold" data-v-cc6b4756> Proses Analisis - Menghitung Bobot Waktu &amp; Total Penjualan Berbobot </h1><button class="px-4 py-2 mt-4 text-white bg-blue-500 rounded" data-v-cc6b4756> Weight Count </button><h2 class="mt-4 text-lg font-semibold" data-v-cc6b4756>1. Perhitungan Bobot Waktu</h2><div class="flex justify-between my-4" data-v-cc6b4756><div data-v-cc6b4756><label class="mr-2" data-v-cc6b4756>Show</label><select id="itemsPerPage" data-v-cc6b4756><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-cc6b4756${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-cc6b4756>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-cc6b4756></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-cc6b4756><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-cc6b4756></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-cc6b4756><table class="w-full mt-2 bg-white border" data-v-cc6b4756><thead data-v-cc6b4756><tr class="bg-gray-200" data-v-cc6b4756><th class="p-2 border" data-v-cc6b4756>Product Code</th><th class="p-2 border" data-v-cc6b4756>Product Name</th><th class="p-2 border" data-v-cc6b4756>First Date Transaction</th><th class="p-2 border" data-v-cc6b4756>Last Date Transaction</th><th class="p-2 border" data-v-cc6b4756>Selisih Hari</th><th class="p-2 border" data-v-cc6b4756>Bobot Waktu</th></tr></thead><tbody data-v-cc6b4756><!--[-->`);
        ssrRenderList(paginatedProductIds.value, (productId) => {
          _push(`<tr data-v-cc6b4756><td class="p-2 border" data-v-cc6b4756>${ssrInterpolate(productCodes.value[productId])}</td><td class="p-2 border" data-v-cc6b4756>${ssrInterpolate(productNames.value[productId])}</td><td class="p-2 border" data-v-cc6b4756>${ssrInterpolate(formatDate(firstTransactionDates.value[productId]))}</td><td class="p-2 border" data-v-cc6b4756>${ssrInterpolate(formatDate(lastTransactionDates.value[productId]))}</td><td class="p-2 border" data-v-cc6b4756>${ssrInterpolate(formatDayHour(productDateDifferences.value[productId]))}</td><td class="p-2 border" data-v-cc6b4756>${ssrInterpolate(productTimeWeights.value[productId])}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between mt-4" data-v-cc6b4756><div data-v-cc6b4756> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredProductIds.value.length))} of ${ssrInterpolate(filteredProductIds.value.length)} entries </div><div class="flex items-center space-x-2" data-v-cc6b4756><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-cc6b4756> Prev </button><!--[-->`);
      ssrRenderList(generatePagination.value, (page) => {
        _push(`<button class="${ssrRenderClass([{
          "bg-blue-500 text-white": currentPage.value === page,
          "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
        }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-cc6b4756>${ssrInterpolate(page)}</button>`);
      });
      _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-cc6b4756> Next </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analysis_pages/time_count_page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const time_count_page = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cc6b4756"]]);

export { time_count_page as default };
//# sourceMappingURL=time_count_page-BO639_oF.mjs.map
