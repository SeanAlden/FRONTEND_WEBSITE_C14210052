import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { e as useCookie } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import 'consola/core';
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto bg-gray-100" }, _attrs))} data-v-aac2fa9a><h1 class="text-3xl font-bold text-center" data-v-aac2fa9a>Toko Obat Asia Raya</h1><h2 class="text-xl font-semibold text-center" data-v-aac2fa9a>Product Sales Report</h2><p class="text-center text-gray-500" data-v-aac2fa9a> Bulan ${ssrInterpolate(months[selectedMonth.value - 1])} Tahun ${ssrInterpolate(selectedYear.value)}</p><div class="flex justify-center mt-4 space-x-4" data-v-aac2fa9a><div data-v-aac2fa9a><label class="font-medium" data-v-aac2fa9a>Pilih Bulan:</label><select class="px-3 py-1 border rounded" data-v-aac2fa9a><!--[-->`);
      ssrRenderList(months, (month, index) => {
        _push(`<option${ssrRenderAttr("value", index + 1)} data-v-aac2fa9a${ssrIncludeBooleanAttr(Array.isArray(selectedMonth.value) ? ssrLooseContain(selectedMonth.value, index + 1) : ssrLooseEqual(selectedMonth.value, index + 1)) ? " selected" : ""}>${ssrInterpolate(month)}</option>`);
      });
      _push(`<!--]--></select></div><div data-v-aac2fa9a><label class="font-medium" data-v-aac2fa9a>Pilih Tahun:</label><input${ssrRenderAttr("value", selectedYear.value)} type="number" class="w-20 px-3 py-1 border rounded" data-v-aac2fa9a></div></div><div class="flex justify-end mt-4 space-x-4" data-v-aac2fa9a><button class="px-4 py-2 text-white bg-blue-500 rounded" data-v-aac2fa9a> Ekspor ke PDF </button><button class="px-4 py-2 text-white bg-green-500 rounded" data-v-aac2fa9a> Ekspor ke Excel </button></div><div class="flex justify-between my-4" data-v-aac2fa9a><div data-v-aac2fa9a><label class="mr-2" data-v-aac2fa9a>Show</label><select class="px-2 py-1 border rounded" data-v-aac2fa9a><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-aac2fa9a${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-aac2fa9a>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search products" class="px-3 py-1 border rounded" data-v-aac2fa9a></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-aac2fa9a><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-aac2fa9a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="p-4 mt-6 overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap" data-v-aac2fa9a><div id="sales-report-table" class="p-4 mt-6 overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap" data-v-aac2fa9a><table class="w-full border-collapse" data-v-aac2fa9a><thead class="bg-gray-200" data-v-aac2fa9a><tr data-v-aac2fa9a><th class="px-2 py-2 border" data-v-aac2fa9a>No</th><th class="px-2 py-2 border" data-v-aac2fa9a>Photo</th><th class="px-2 py-2 border" data-v-aac2fa9a>Name</th><th class="px-2 py-2 border" data-v-aac2fa9a>Harga</th><th class="px-2 py-2 border" data-v-aac2fa9a>Sold</th><th class="px-2 py-2 border" data-v-aac2fa9a>Kas Masuk</th><th class="px-2 py-2 border" data-v-aac2fa9a>Margin Penjualan</th></tr></thead><tbody data-v-aac2fa9a>`);
        if (isLoading.value) {
          _push(`<tr data-v-aac2fa9a><td colspan="7" class="py-4 text-center text-gray-500" data-v-aac2fa9a>Memuat data...</td></tr>`);
        } else if (error.value) {
          _push(`<tr data-v-aac2fa9a><td colspan="7" class="text-center text-red-500" data-v-aac2fa9a>${ssrInterpolate(error.value)}</td></tr>`);
        } else if (mergedTransactions.value.length === 0) {
          _push(`<tr data-v-aac2fa9a><td colspan="7" class="py-4 text-center text-gray-500" data-v-aac2fa9a> Tidak ada data untuk bulan ini </td></tr>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(paginatedTransactions.value, (product) => {
            _push(`<tr data-v-aac2fa9a><td class="px-4 py-2 border text-lg-center" data-v-aac2fa9a>${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + product.no)}</td><td class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2" data-v-aac2fa9a><img${ssrRenderAttr(
              "src",
              product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${product.photo}`) : fallbackImage
            )} class="w-20 h-20 object-fit" data-v-aac2fa9a></td><td class="px-2 py-2 text-blue-600 border cursor-pointer hover:underline" data-v-aac2fa9a>${ssrInterpolate(product.name)}</td><td class="px-2 py-2 text-center border" data-v-aac2fa9a>${ssrInterpolate(formatPrice(product.price))}</td><td class="px-2 py-2 text-center border" data-v-aac2fa9a>${ssrInterpolate(product.sold)}</td><td class="px-2 py-2 text-center border" data-v-aac2fa9a>${ssrInterpolate(formatPrice(product.totalIncome))}</td><td class="px-2 py-2 text-center border" data-v-aac2fa9a>${ssrInterpolate(formatPrice(product.margin))}</td></tr>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</tbody>`);
        if (!isLoading.value && !error.value && mergedTransactions.value.length > 0) {
          _push(`<tfoot data-v-aac2fa9a><tr class="font-semibold bg-gray-100" data-v-aac2fa9a><td colspan="4" class="px-2 py-2 text-right border" data-v-aac2fa9a> Total Keseluruhan: </td><td class="px-2 py-2 text-center border" data-v-aac2fa9a>${ssrInterpolate(grandTotal.value.sold)}</td><td class="px-2 py-2 text-center border" data-v-aac2fa9a>${ssrInterpolate(formatPrice(grandTotal.value.totalIncome))}</td><td class="px-2 py-2 text-center border" data-v-aac2fa9a>${ssrInterpolate(formatPrice(grandTotal.value.margin))}</td></tr></tfoot>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between mt-4" data-v-aac2fa9a><div data-v-aac2fa9a> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, mergedTransactions.value.length))} of ${ssrInterpolate(mergedTransactions.value.length)} entries </div><div class="flex items-center space-x-2" data-v-aac2fa9a><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-aac2fa9a> Prev </button><!--[-->`);
      ssrRenderList(generatePagination.value, (page) => {
        _push(`<button class="${ssrRenderClass([{
          "bg-blue-500 text-white": currentPage.value === page,
          "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
        }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-aac2fa9a>${ssrInterpolate(page)}</button>`);
      });
      _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-aac2fa9a> Next </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sales_report_pages/sales_reports.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sales_reports = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-aac2fa9a"]]);

export { sales_reports as default };
//# sourceMappingURL=sales_reports-ElkUsVOb.mjs.map
