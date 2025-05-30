import { ref, watch, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const BASE_URL = "http://localhost:8000";
const _sfc_main = {
  __name: "entry_products",
  __ssrInlineRender: true,
  setup(__props) {
    const entryProducts = ref([]);
    const products = ref([]);
    const expDates = ref([]);
    const showModal = ref(false);
    ref(null);
    const formData = ref({ product_id: "", exp_date: "", added_stock: 0 });
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchEntries = async () => {
      const response = await fetch(`${BASE_URL}/api/entry-products`);
      const data = await response.json();
      entryProducts.value = data.data;
    };
    const fetchExpDates = async () => {
      if (!formData.value.product_id) return;
      const response = await fetch(
        `${BASE_URL}/api/products/product/${formData.value.product_id}/exp-dates`
      );
      const data = await response.json();
      expDates.value = data.data;
    };
    watch(() => formData.value.product_id, fetchExpDates);
    const filteredEntry = computed(() => {
      return entryProducts.value.filter((entry) => {
        const query = searchQuery.value.toLowerCase();
        return entry.product.name.toLowerCase().includes(query) || entry.product.code.toLowerCase().includes(query) || entry.product.price.toString().includes(query) || entry.exp_date.toString().includes(query) || entry.added_stock.toString().includes(query) || entry.previous_stock.toString().includes(query) || entry.current_stock.toString().includes(query) || entry.created_at.toString().includes(query);
      });
    });
    const paginatedEntry = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredEntry.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredEntry.value.length / itemsPerPage.value);
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
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    watch(itemsPerPage, () => {
      currentPage.value = 1;
      fetchEntries();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-fd39e18c><div class="flex items-center justify-between mb-4" data-v-fd39e18c><h1 class="text-2xl font-bold" data-v-fd39e18c>Barang Masuk</h1><button class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700" data-v-fd39e18c> + Tambah </button></div><div class="flex items-center justify-between mb-4" data-v-fd39e18c><div data-v-fd39e18c><label class="mr-2" data-v-fd39e18c>Show</label><select id="itemsPerPage" data-v-fd39e18c><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-fd39e18c${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-fd39e18c>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-fd39e18c></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-fd39e18c><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-fd39e18c></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-fd39e18c><table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md" data-v-fd39e18c><thead class="bg-gray-100 border-b" data-v-fd39e18c><tr class="bg-gray-200" data-v-fd39e18c><th class="p-3 text-left border" data-v-fd39e18c>#</th><th class="p-3 text-center border" data-v-fd39e18c>Foto</th><th class="p-3 text-left border" data-v-fd39e18c>Nama</th><th class="p-3 text-center border" data-v-fd39e18c>Harga</th><th class="p-3 text-center border" data-v-fd39e18c>Tanggal Expired</th><th class="p-3 text-center border" data-v-fd39e18c>Sebelum</th><th class="p-3 text-center border" data-v-fd39e18c>Jumlah</th><th class="p-3 text-center border" data-v-fd39e18c>Sesudah</th><th class="p-3 text-center border" data-v-fd39e18c>Waktu Penambahan</th><th class="p-3 text-center border" data-v-fd39e18c>Opsi</th></tr></thead><tbody data-v-fd39e18c><!--[-->`);
        ssrRenderList(paginatedEntry.value, (entry) => {
          _push(`<tr class="border-b hover:bg-gray-50" data-v-fd39e18c><td class="p-3 border" data-v-fd39e18c>${ssrInterpolate(entry.product.code)}</td><td class="flex justify-center items-center p-2 border min-w-[120px] min-h-[120px]" data-v-fd39e18c><img${ssrRenderAttr(
            "src",
            entry.product.photo ? `http://localhost:8000/storage/${entry.product.photo}` : "/assets/images/avatar.png"
          )} class="w-20 h-20 object-fit" data-v-fd39e18c></td><td class="p-3 border" data-v-fd39e18c>${ssrInterpolate(entry.product.name)}</td><td class="p-3 text-center border" data-v-fd39e18c>${ssrInterpolate(formatPrice(entry.product.price))}</td><td class="p-3 text-center border" data-v-fd39e18c>${ssrInterpolate(entry.exp_date)}</td><td class="p-3 font-bold text-center border" data-v-fd39e18c>${ssrInterpolate(entry.previous_stock)}</td><td class="p-3 font-bold text-center text-blue-500 border" data-v-fd39e18c> + ${ssrInterpolate(entry.added_stock)}</td><td class="p-3 font-bold text-center border" data-v-fd39e18c>${ssrInterpolate(entry.current_stock)}</td><td class="p-3 text-center border" data-v-fd39e18c>${ssrInterpolate(formatDate(entry.created_at))}</td><td class="p-3 text-center border" data-v-fd39e18c><button class="px-3 py-1 text-white bg-yellow-500 rounded" data-v-fd39e18c> Edit </button><button class="px-3 py-1 ml-2 text-white bg-red-500 rounded" data-v-fd39e18c> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-fd39e18c><div data-v-fd39e18c> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredEntry.value.length))} of ${ssrInterpolate(filteredEntry.value.length)} entries </div><div class="flex items-center space-x-2" data-v-fd39e18c><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-fd39e18c> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-fd39e18c>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-fd39e18c> Next </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showModal.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50" data-v-fd39e18c><div class="w-1/3 p-6 bg-white rounded shadow-lg" data-v-fd39e18c><h2 class="mb-4 text-xl font-bold" data-v-fd39e18c>Pilih Barang Masuk</h2><label class="block mb-2 text-gray-700" data-v-fd39e18c>Pilih Produk:</label><select class="w-full p-2 mb-4 border" data-v-fd39e18c><!--[-->`);
        ssrRenderList(products.value, (product) => {
          _push(`<option${ssrRenderAttr("value", product.id)} data-v-fd39e18c${ssrIncludeBooleanAttr(Array.isArray(formData.value.product_id) ? ssrLooseContain(formData.value.product_id, product.id) : ssrLooseEqual(formData.value.product_id, product.id)) ? " selected" : ""}>${ssrInterpolate(product.name)} (${ssrInterpolate(product.code)}) - Rp ${ssrInterpolate(product.price.toLocaleString())}</option>`);
        });
        _push(`<!--]--></select><label class="block mb-2 text-gray-700" data-v-fd39e18c>Tanggal Expired:</label><select class="w-full p-2 mb-4 border" data-v-fd39e18c><!--[-->`);
        ssrRenderList(expDates.value, (exp) => {
          _push(`<option${ssrRenderAttr("value", exp)} data-v-fd39e18c${ssrIncludeBooleanAttr(Array.isArray(formData.value.exp_date) ? ssrLooseContain(formData.value.exp_date, exp) : ssrLooseEqual(formData.value.exp_date, exp)) ? " selected" : ""}>${ssrInterpolate(exp)}</option>`);
        });
        _push(`<!--]--></select><label class="block mb-2 text-gray-700" data-v-fd39e18c>Jumlah Stok:</label><input type="number"${ssrRenderAttr("value", formData.value.added_stock)} class="w-full p-2 mb-4 border" min="1" data-v-fd39e18c><div class="flex justify-end" data-v-fd39e18c><button class="px-4 py-2 mr-2 text-white bg-gray-400 rounded" data-v-fd39e18c> Batal </button><button class="px-4 py-2 text-white bg-blue-600 rounded" data-v-fd39e18c> Simpan </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/entry_products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const entry_products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fd39e18c"]]);

export { entry_products as default };
//# sourceMappingURL=entry_products-S02YSd2N.mjs.map
