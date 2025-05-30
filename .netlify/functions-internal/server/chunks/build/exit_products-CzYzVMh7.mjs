import { ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const BASE_URL = "http://localhost:8000";
const _sfc_main = {
  __name: "exit_products",
  __ssrInlineRender: true,
  setup(__props) {
    const exitProducts = ref([]);
    const products = ref([]);
    const expDates = ref([]);
    const showModal = ref(false);
    ref(null);
    const formData = ref({ product_id: "", exp_date: "", removed_stock: 0 });
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchExits = async () => {
      isLoading.value = true;
      try {
        const response = await fetch(`${BASE_URL}/api/exit-products`);
        const data = await response.json();
        exitProducts.value = data.data;
      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
      } finally {
        isLoading.value = false;
      }
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
    const filteredExit = computed(() => {
      return exitProducts.value.filter((exit) => {
        const query = searchQuery.value.toLowerCase();
        return exit.product.name.toLowerCase().includes(query) || exit.product.code.toLowerCase().includes(query) || exit.product.price.toString().includes(query) || exit.exp_date.toString().includes(query) || exit.removed_stock.toString().includes(query) || exit.previous_stock.toString().includes(query) || exit.current_stock.toString().includes(query) || exit.created_at.toString().includes(query);
      });
    });
    const paginatedExit = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredExit.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredExit.value.length / itemsPerPage.value);
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
    watch(itemsPerPage, () => {
      currentPage.value = 1;
      fetchExits();
    });
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-c5283df5><div class="flex items-center justify-between mb-4" data-v-c5283df5><h1 class="text-2xl font-bold" data-v-c5283df5>Barang Keluar</h1><button class="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700" data-v-c5283df5> + Tambah </button></div><div class="flex items-center justify-between mb-4" data-v-c5283df5><div data-v-c5283df5><label class="mr-2" data-v-c5283df5>Show</label><select id="itemsPerPage" data-v-c5283df5><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-c5283df5${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-c5283df5>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-c5283df5></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-c5283df5><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-c5283df5></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-c5283df5><table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md" data-v-c5283df5><thead class="bg-gray-100 border-b" data-v-c5283df5><tr data-v-c5283df5><th class="p-3 text-center border" data-v-c5283df5>#</th><th class="p-3 text-center border" data-v-c5283df5>Foto</th><th class="p-3 text-left border" data-v-c5283df5>Nama</th><th class="p-3 text-center border" data-v-c5283df5>Harga</th><th class="p-3 text-center border" data-v-c5283df5>Tanggal Expired</th><th class="p-3 text-center border" data-v-c5283df5>Sebelum</th><th class="p-3 text-center border" data-v-c5283df5>Jumlah</th><th class="p-3 text-center border" data-v-c5283df5>Sesudah</th><th class="p-3 text-center border" data-v-c5283df5>Waktu Pengurangan</th><th class="p-3 text-center border" data-v-c5283df5>Opsi</th></tr></thead><tbody data-v-c5283df5><!--[-->`);
        ssrRenderList(unref(paginatedExit), (exit) => {
          _push(`<tr class="border-b hover:bg-gray-50" data-v-c5283df5><td class="p-3 border" data-v-c5283df5>${ssrInterpolate(exit.product.code)}</td><td class="flex justify-center items-center p-2 border min-w-[120px] min-h-[120px]" data-v-c5283df5><img${ssrRenderAttr(
            "src",
            exit.product.photo ? `http://localhost:8000/storage/${exit.product.photo}` : "/assets/images/avatar.png"
          )} class="w-20 h-20 object-fit" data-v-c5283df5></td><td class="p-3 border" data-v-c5283df5>${ssrInterpolate(exit.product.name)}</td><td class="p-3 text-center border" data-v-c5283df5>${ssrInterpolate(formatPrice(exit.product.price))}</td><td class="p-3 text-center border" data-v-c5283df5>${ssrInterpolate(exit.exp_date)}</td><td class="p-3 font-bold text-center border" data-v-c5283df5>${ssrInterpolate(exit.previous_stock)}</td><td class="p-3 font-bold text-center text-red-500 border" data-v-c5283df5> - ${ssrInterpolate(exit.removed_stock)}</td><td class="p-3 font-bold text-center border" data-v-c5283df5>${ssrInterpolate(exit.current_stock)}</td><td class="p-3 text-center border" data-v-c5283df5>${ssrInterpolate(formatDate(exit.created_at))}</td><td class="p-3 text-center border" data-v-c5283df5><button class="px-3 py-1 text-white bg-yellow-500 rounded" data-v-c5283df5> Edit </button><button class="px-3 py-1 ml-2 text-white bg-red-500 rounded" data-v-c5283df5> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-c5283df5><div data-v-c5283df5> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, unref(filteredExit).length))} of ${ssrInterpolate(unref(filteredExit).length)} entries </div><div class="flex items-center space-x-2" data-v-c5283df5><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-c5283df5> Prev </button><!--[-->`);
        ssrRenderList(unref(generatePagination), (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-c5283df5>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === unref(totalPages)) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-c5283df5> Next </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showModal.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50" data-v-c5283df5><div class="w-1/3 p-6 bg-white rounded shadow-lg" data-v-c5283df5><h2 class="mb-4 text-xl font-bold" data-v-c5283df5>Pilih Barang Keluar</h2><label class="block mb-2 text-gray-700" data-v-c5283df5>Pilih Produk:</label><select class="w-full p-2 mb-4 border" data-v-c5283df5><!--[-->`);
        ssrRenderList(products.value, (product) => {
          _push(`<option${ssrRenderAttr("value", product.id)} data-v-c5283df5${ssrIncludeBooleanAttr(Array.isArray(formData.value.product_id) ? ssrLooseContain(formData.value.product_id, product.id) : ssrLooseEqual(formData.value.product_id, product.id)) ? " selected" : ""}>${ssrInterpolate(product.name)} (${ssrInterpolate(product.code)}) - Rp ${ssrInterpolate(product.price.toLocaleString())}</option>`);
        });
        _push(`<!--]--></select><label class="block mb-2 text-gray-700" data-v-c5283df5>Tanggal Expired:</label><select class="w-full p-2 mb-4 border" data-v-c5283df5><!--[-->`);
        ssrRenderList(expDates.value, (exp) => {
          _push(`<option${ssrRenderAttr("value", exp)} data-v-c5283df5${ssrIncludeBooleanAttr(Array.isArray(formData.value.exp_date) ? ssrLooseContain(formData.value.exp_date, exp) : ssrLooseEqual(formData.value.exp_date, exp)) ? " selected" : ""}>${ssrInterpolate(exp)}</option>`);
        });
        _push(`<!--]--></select><label class="block mb-2 text-gray-700" data-v-c5283df5>Jumlah Stok:</label><input type="number"${ssrRenderAttr("value", formData.value.removed_stock)} class="w-full p-2 mb-4 border" min="1" data-v-c5283df5><div class="flex justify-end" data-v-c5283df5><button class="px-4 py-2 mr-2 text-white bg-gray-400 rounded" data-v-c5283df5> Batal </button><button class="px-4 py-2 text-white bg-blue-600 rounded" data-v-c5283df5> Simpan </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product_pages/exit_products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const exit_products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c5283df5"]]);

export { exit_products as default };
//# sourceMappingURL=exit_products-CzYzVMh7.mjs.map
