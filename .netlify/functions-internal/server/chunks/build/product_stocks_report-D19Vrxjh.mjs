import { ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const fallbackImage = "/assets/images/avatar.png";
const _sfc_main = {
  __name: "product_stocks_report",
  __ssrInlineRender: true,
  setup(__props) {
    const productStocks = ref([]);
    const selectedDate = ref("");
    const selectedMonthYear = ref("");
    const searchQuery = ref("");
    const currentPage = ref(1);
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const isLoading = ref(true);
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      date.setHours(date.getHours() + 7);
      return date.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    };
    const filteredStocks = computed(() => {
      return productStocks.value.filter((item) => {
        const itemDate = new Date(item.timestamp);
        itemDate.setHours(itemDate.getHours() + 7);
        const itemFormattedDate = itemDate.toISOString().split("T")[0];
        const itemFormattedMonthYear = itemDate.toISOString().slice(0, 7);
        if (selectedDate.value && itemFormattedDate !== selectedDate.value) {
          return false;
        }
        if (selectedMonthYear.value && itemFormattedMonthYear !== selectedMonthYear.value) {
          return false;
        }
        return true;
      });
    });
    const filteredStocksBySearch = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return filteredStocks.value.filter(
        (item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query) || item.price.toString().includes(query) || item.exp_date.toString().includes(query) || item.previous_stock.toString().includes(query) || item.quantity.toString().includes(query) || item.current_stock.toString().includes(query) || item.condition.toLowerCase().includes(query) || item.timestamp.toLowerCase().includes(query)
      );
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredStocksBySearch.value.length / itemsPerPage.value);
    });
    const paginatedStocks = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredStocksBySearch.value.slice(start, start + itemsPerPage.value);
    });
    const groupedStocks = computed(() => {
      return paginatedStocks.value.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = [];
        }
        acc[item.name].push(item);
        return acc;
      }, {});
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
    watch(itemsPerPage, () => {
      currentPage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-12047ea1><h1 class="mb-6 text-2xl font-bold text-center" data-v-12047ea1>Laporan Barang Masuk-Keluar</h1><div class="flex flex-wrap items-center justify-center gap-4 mb-6" data-v-12047ea1><div data-v-12047ea1><label class="font-semibold" data-v-12047ea1>Filter Tanggal:</label><input type="date"${ssrRenderAttr("value", selectedDate.value)} class="px-4 py-2 border rounded-md" data-v-12047ea1></div><div data-v-12047ea1><label class="font-semibold" data-v-12047ea1>Filter Bulan &amp; Tahun:</label><input type="month"${ssrRenderAttr("value", selectedMonthYear.value)} class="px-4 py-2 border rounded-md" data-v-12047ea1></div><button class="px-4 py-2 text-white bg-gray-500 rounded-md" data-v-12047ea1> Reset Filter </button></div><div class="flex items-center justify-between mb-4" data-v-12047ea1><div data-v-12047ea1><label class="mr-2" data-v-12047ea1>Show</label><select id="itemsPerPage" data-v-12047ea1><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-12047ea1${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-12047ea1>entries</span></div><div data-v-12047ea1><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-12047ea1></div></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-12047ea1><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-12047ea1></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap" data-v-12047ea1><!--[-->`);
        ssrRenderList(groupedStocks.value, (group, productName) => {
          _push(`<div class="mb-4" data-v-12047ea1><h2 class="text-lg font-bold" data-v-12047ea1>${ssrInterpolate(productName)}</h2><table class="min-w-full border border-gray-300" data-v-12047ea1><thead class="text-gray-700 bg-gray-200" data-v-12047ea1><tr data-v-12047ea1><th class="px-4 py-2 border" data-v-12047ea1>Kode</th><th class="px-4 py-2 border" data-v-12047ea1>Foto</th><th class="px-4 py-2 border" data-v-12047ea1>Harga</th><th class="px-4 py-2 border" data-v-12047ea1>Tanggal Expired</th><th class="px-4 py-2 border" data-v-12047ea1>Sebelum</th><th class="px-4 py-2 border" data-v-12047ea1>Jumlah</th><th class="px-4 py-2 border" data-v-12047ea1>Sesudah</th><th class="px-4 py-2 border" data-v-12047ea1>Waktu Masuk / Keluar</th><th class="px-4 py-2 border" data-v-12047ea1>Kondisi</th></tr></thead><tbody data-v-12047ea1><!--[-->`);
          ssrRenderList(group, (item, index) => {
            _push(`<tr class="hover:bg-gray-100" data-v-12047ea1>`);
            if (index === 0) {
              _push(`<td class="px-4 py-2 border" data-v-12047ea1>${ssrInterpolate(item.code)}</td>`);
            } else {
              _push(`<!---->`);
            }
            if (index !== 0) {
              _push(`<td class="px-4 py-2 border" data-v-12047ea1></td>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<td class="flex items-center justify-center px-4 py-2 border" data-v-12047ea1><img${ssrRenderAttr("src", item.photo ? item.photo : fallbackImage)} alt="Foto Produk" class="object-cover w-12 h-12 rounded" data-v-12047ea1></td><td class="px-4 py-2 text-center border" data-v-12047ea1>${ssrInterpolate(formatPrice(item.price))}</td><td class="px-4 py-2 text-center border" data-v-12047ea1>${ssrInterpolate(item.exp_date)}</td><td class="px-4 py-2 font-bold text-center border" data-v-12047ea1>${ssrInterpolate(item.previous_stock)}</td><td class="px-4 py-2 font-bold text-center border" data-v-12047ea1><span class="${ssrRenderClass(
              item.condition === "Masuk" ? "text-green-600" : "text-red-600"
            )}" data-v-12047ea1>${ssrInterpolate(item.condition === "Masuk" ? "+" : "-")}${ssrInterpolate(item.quantity)}</span></td><td class="px-4 py-2 font-bold text-center border" data-v-12047ea1>${ssrInterpolate(item.current_stock)}</td><td class="px-4 py-2 text-center border" data-v-12047ea1>${ssrInterpolate(formatDate(item.timestamp))}</td><td class="px-4 py-2 text-center border" data-v-12047ea1><span class="${ssrRenderClass(
              item.condition === "Masuk" ? "text-green-600 font-bold" : "text-red-600 font-bold"
            )}" data-v-12047ea1>${ssrInterpolate(item.condition)}</span></td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between mt-4" data-v-12047ea1><div data-v-12047ea1> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredStocks.value.length))} of ${ssrInterpolate(filteredStocks.value.length)} entries </div><div class="flex items-center space-x-2" data-v-12047ea1><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-12047ea1> Prev </button><!--[-->`);
      ssrRenderList(generatePagination.value, (page) => {
        _push(`<button class="${ssrRenderClass([{
          "bg-blue-500 text-white": currentPage.value === page,
          "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
        }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-12047ea1>${ssrInterpolate(page)}</button>`);
      });
      _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-12047ea1> Next </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/product_stocks_report.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const product_stocks_report = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-12047ea1"]]);

export { product_stocks_report as default };
//# sourceMappingURL=product_stocks_report-D19Vrxjh.mjs.map
