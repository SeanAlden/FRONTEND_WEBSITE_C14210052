import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useCookie } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'node:util';
import 'node:process';
import 'node:tty';
import 'mitt';
import 'axios';

const fallbackImage = "/assets/images/avatar.png";
const _sfc_main = {
  __name: "sales_reports",
  __ssrInlineRender: true,
  setup(__props) {
    const transactions = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const selectedMonth = ref((/* @__PURE__ */ new Date()).getMonth() + 1);
    const selectedYear = ref((/* @__PURE__ */ new Date()).getFullYear());
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const searchQuery = ref("");
    useCookie("my_auth_token");
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const filteredTransactions = computed(() => {
      return transactions.value.map((transaction) => {
        const [year, month, day] = transaction.transaction_date.split("-");
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          // Bulan dikurangi 1 karena JS Date month 0-based
          parseInt(day)
        );
        if (date.getMonth() + 1 !== selectedMonth.value || date.getFullYear() !== selectedYear.value) {
          return null;
        }
        const query = searchQuery.value.toLowerCase();
        const matchedDetails = transaction.details.filter((detail) => {
          const productName = detail.product_name.toLowerCase();
          const productPrice = detail.product_price.toString();
          const productSold = detail.quantity.toString();
          const totalIncome = (detail.product_price * detail.quantity).toString();
          const margin = (totalIncome * 0.25).toString();
          return productName.includes(query) || productPrice.includes(query) || productSold.includes(query) || totalIncome.includes(query) || margin.includes(query);
        });
        return matchedDetails.length > 0 ? { ...transaction, details: matchedDetails } : null;
      }).filter((transaction) => transaction !== null);
    });
    const mergedTransactions = computed(() => {
      const productMap = /* @__PURE__ */ new Map();
      filteredTransactions.value.forEach((transaction) => {
        transaction.details.forEach((detail) => {
          const key = `${detail.product_name}-${detail.product_price}`;
          if (!productMap.has(key)) {
            productMap.set(key, {
              no: 0,
              photo: detail.product.photo || "/assets/images/avatar.png",
              name: detail.product_name,
              price: detail.product_price,
              sold: 0,
              totalIncome: 0,
              margin: 0
            });
          }
          const existingProduct = productMap.get(key);
          const quantity = detail.quantity;
          const totalPrice = detail.product_price * quantity;
          existingProduct.sold += parseInt(quantity, 10);
          existingProduct.totalIncome += totalPrice;
          existingProduct.margin += totalPrice * 0.25;
        });
      });
      return Array.from(productMap.values()).sort((a, b) => b.sold - a.sold).map((product, index) => ({
        ...product,
        no: index + 1
      }));
    });
    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return mergedTransactions.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(
      () => Math.ceil(mergedTransactions.value.length / itemsPerPage.value)
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
    const grandTotal = computed(() => {
      return mergedTransactions.value.reduce(
        (totals, product) => {
          totals.sold += product.sold;
          totals.totalIncome += product.totalIncome;
          totals.margin += product.margin;
          return totals;
        },
        { sold: 0, totalIncome: 0, margin: 0 }
      );
    });
    watch(itemsPerPage, () => {
      currentPage.value = 1;
    });
    watch([selectedMonth, selectedYear], () => {
      currentPage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto bg-gray-100" }, _attrs))} data-v-d5215a92><h1 class="text-3xl font-bold text-center" data-v-d5215a92>Toko Obat Asia Raya</h1><h2 class="text-xl font-semibold text-center" data-v-d5215a92>Product Sales Report</h2><p class="text-center text-gray-500" data-v-d5215a92> Bulan ${ssrInterpolate(months[selectedMonth.value - 1])} Tahun ${ssrInterpolate(selectedYear.value)}</p><div class="flex justify-center mt-4 space-x-4" data-v-d5215a92><div data-v-d5215a92><label class="font-medium" data-v-d5215a92>Pilih Bulan:</label><select class="px-3 py-1 border rounded" data-v-d5215a92><!--[-->`);
      ssrRenderList(months, (month, index) => {
        _push(`<option${ssrRenderAttr("value", index + 1)} data-v-d5215a92${ssrIncludeBooleanAttr(Array.isArray(selectedMonth.value) ? ssrLooseContain(selectedMonth.value, index + 1) : ssrLooseEqual(selectedMonth.value, index + 1)) ? " selected" : ""}>${ssrInterpolate(month)}</option>`);
      });
      _push(`<!--]--></select></div><div data-v-d5215a92><label class="font-medium" data-v-d5215a92>Pilih Tahun:</label><input${ssrRenderAttr("value", selectedYear.value)} type="number" class="w-20 px-3 py-1 border rounded" data-v-d5215a92></div></div><div class="flex justify-end mt-4 space-x-4" data-v-d5215a92><button class="px-4 py-2 text-white bg-blue-500 rounded" data-v-d5215a92> Ekspor ke PDF </button><button class="px-4 py-2 text-white bg-green-500 rounded" data-v-d5215a92> Ekspor ke Excel </button></div><div class="flex justify-between my-4" data-v-d5215a92><div data-v-d5215a92><label class="mr-2" data-v-d5215a92>Show</label><select class="px-2 py-1 border rounded" data-v-d5215a92><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-d5215a92${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-d5215a92>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search products" class="px-3 py-1 border rounded" data-v-d5215a92></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-d5215a92><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-d5215a92></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="p-4 mt-6 overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap" data-v-d5215a92><div id="sales-report-table" class="p-4 mt-6 overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap" data-v-d5215a92><table class="w-full border-collapse" data-v-d5215a92><thead class="bg-gray-200" data-v-d5215a92><tr data-v-d5215a92><th class="px-2 py-2 border" data-v-d5215a92>No</th><th class="px-2 py-2 border" data-v-d5215a92>Photo</th><th class="px-2 py-2 border" data-v-d5215a92>Name</th><th class="px-2 py-2 border" data-v-d5215a92>Harga</th><th class="px-2 py-2 border" data-v-d5215a92>Sold</th><th class="px-2 py-2 border" data-v-d5215a92>Kas Masuk</th><th class="px-2 py-2 border" data-v-d5215a92>Margin Penjualan</th></tr></thead><tbody data-v-d5215a92>`);
        if (isLoading.value) {
          _push(`<tr data-v-d5215a92><td colspan="7" class="py-4 text-center text-gray-500" data-v-d5215a92>Memuat data...</td></tr>`);
        } else if (error.value) {
          _push(`<tr data-v-d5215a92><td colspan="7" class="text-center text-red-500" data-v-d5215a92>${ssrInterpolate(error.value)}</td></tr>`);
        } else if (mergedTransactions.value.length === 0) {
          _push(`<tr data-v-d5215a92><td colspan="7" class="py-4 text-center text-gray-500" data-v-d5215a92> Tidak ada data untuk bulan ini </td></tr>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(paginatedTransactions.value, (product) => {
            _push(`<tr data-v-d5215a92><td class="px-4 py-2 border text-lg-center" data-v-d5215a92>${ssrInterpolate(product.no)}</td><td class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2" data-v-d5215a92><img${ssrRenderAttr(
              "src",
              product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/${product.photo}`) : fallbackImage
            )} class="w-20 h-20 object-fit" data-v-d5215a92></td><td class="px-2 py-2 text-blue-600 border cursor-pointer hover:underline" data-v-d5215a92>${ssrInterpolate(product.name)}</td><td class="px-2 py-2 text-center border" data-v-d5215a92>${ssrInterpolate(formatPrice(product.price))}</td><td class="px-2 py-2 text-center border" data-v-d5215a92>${ssrInterpolate(product.sold)}</td><td class="px-2 py-2 text-center border" data-v-d5215a92>${ssrInterpolate(formatPrice(product.totalIncome))}</td><td class="px-2 py-2 text-center border" data-v-d5215a92>${ssrInterpolate(formatPrice(product.margin))}</td></tr>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</tbody>`);
        if (!isLoading.value && !error.value && mergedTransactions.value.length > 0) {
          _push(`<tfoot data-v-d5215a92><tr class="font-semibold bg-gray-100" data-v-d5215a92><td colspan="4" class="px-2 py-2 text-right border" data-v-d5215a92> Total Keseluruhan: </td><td class="px-2 py-2 text-center border" data-v-d5215a92>${ssrInterpolate(grandTotal.value.sold)}</td><td class="px-2 py-2 text-center border" data-v-d5215a92>${ssrInterpolate(formatPrice(grandTotal.value.totalIncome))}</td><td class="px-2 py-2 text-center border" data-v-d5215a92>${ssrInterpolate(formatPrice(grandTotal.value.margin))}</td></tr></tfoot>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between mt-4" data-v-d5215a92><div data-v-d5215a92> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, mergedTransactions.value.length))} of ${ssrInterpolate(mergedTransactions.value.length)} entries </div><div class="flex items-center space-x-2" data-v-d5215a92><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-d5215a92> Prev </button><!--[-->`);
      ssrRenderList(generatePagination.value, (page) => {
        _push(`<button class="${ssrRenderClass([{
          "bg-blue-500 text-white": currentPage.value === page,
          "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
        }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-d5215a92>${ssrInterpolate(page)}</button>`);
      });
      _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-d5215a92> Next </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sales_report_pages/sales_reports.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sales_reports = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d5215a92"]]);

export { sales_reports as default };
//# sourceMappingURL=sales_reports-BMZUSJu-.mjs.map
