import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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
import 'consola/core';
import 'mitt';
import 'axios';

const fallbackImage = "/assets/images/avatar.png";
const _sfc_main = {
  __name: "transactions",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const transactions2 = ref([]);
    const filterDate = ref("");
    const filterStartDate = ref("");
    const filterEndDate = ref("");
    const filterMonthYear = ref("");
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    ref(null);
    const isLoading = ref(true);
    useCookie("my_auth_token");
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      date.setHours(date.getHours());
      return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    };
    const filteredTransactions = computed(() => {
      return transactions2.value.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_date);
        const adjustedDate = new Date(transactionDate.getTime() + 7 * 60 * 60 * 1e3);
        const formattedDate = adjustedDate.toISOString().split("T")[0];
        const formattedMonthYear = adjustedDate.toISOString().slice(0, 7);
        const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
        const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
        }
        if (startDate && adjustedDate < startDate) {
          return false;
        }
        if (endDate && adjustedDate > endDate) {
          return false;
        }
        if (filterDate.value && formattedDate !== filterDate.value) {
          return false;
        }
        if (filterMonthYear.value && formattedMonthYear !== filterMonthYear.value) {
          return false;
        }
        if (searchQuery.value && !transaction.mergedDetails.some(
          (detail) => detail.price.toString().includes(searchQuery.value.toLowerCase()) || transaction.transaction_code.toLowerCase().includes(searchQuery.value.toLowerCase()) || detail.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || detail.code.toLowerCase().includes(searchQuery.value.toLowerCase()) || detail.quantity.toString().includes(searchQuery.value.toLowerCase()) || transaction.gross_amount.toString().includes(searchQuery.value.toLowerCase()) || transaction.status.toLowerCase().includes(searchQuery.value.toLowerCase())
        )) {
          return false;
        }
        return true;
      }).sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    });
    const getStatusClass = (status) => {
      switch (status) {
        case "Pesanan selesai":
        case "Pembatalan berhasil":
          return "text-green-500";
        // Hijau
        case "Pembayaran lunas":
        case "Pesanan sampai":
        case "Pesanan selesai dikemas":
          return "text-blue-500";
        // Biru
        case "Belum bayar":
        case "Dalam perjalanan":
        case "Dalam pengemasan":
        case "Proses pembatalan":
          return "text-orange-500";
        // Oranye
        case "Pembayaran gagal":
        case "Dibatalkan":
        case "Pengiriman gagal":
          return "text-red-500";
        // Merah
        default:
          return "text-black";
      }
    };
    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredTransactions.value.slice(start, start + itemsPerPage.value);
    });
    const totalFilteredTransactions = computed(() => {
      return Math.ceil(filteredTransactions.value.length / itemsPerPage.value);
    });
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    const generatePagination = computed(() => {
      const total = totalFilteredTransactions.value;
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-0ab6c889><h1 class="mb-4 text-2xl font-bold text-gray-800" data-v-0ab6c889>Data Transaksi</h1><div class="flex justify-end mb-4" data-v-0ab6c889><button class="px-4 py-2 mr-2 text-white bg-blue-500 rounded" data-v-0ab6c889> Ekspor ke PDF </button><button class="px-4 py-2 text-white bg-green-500 rounded" data-v-0ab6c889> Ekspor ke Excel </button></div><div class="flex flex-col gap-4 mb-4 lg:flex-row lg:items-end lg:justify-between" data-v-0ab6c889><div class="flex flex-col" data-v-0ab6c889><div class="flex items-center" data-v-0ab6c889><label class="mr-2" data-v-0ab6c889>Show</label><select id="itemsPerPage" data-v-0ab6c889><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-0ab6c889${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-0ab6c889>entries</span></div></div><div class="flex flex-col gap-4 sm:flex-row lg:mx-auto" data-v-0ab6c889><div data-v-0ab6c889><label class="block text-sm font-medium text-gray-700" data-v-0ab6c889>Tanggal Pertama:</label><input type="date"${ssrRenderAttr("value", filterStartDate.value)} class="p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" data-v-0ab6c889></div><div data-v-0ab6c889><label class="block text-sm font-medium text-gray-700" data-v-0ab6c889>Tanggal Terakhir:</label><input type="date"${ssrRenderAttr("value", filterEndDate.value)} class="p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" data-v-0ab6c889></div><div data-v-0ab6c889><label class="block text-sm font-medium text-gray-700" data-v-0ab6c889>Filter Bulan-Tahun:</label><input type="month"${ssrRenderAttr("value", filterMonthYear.value)} class="p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" data-v-0ab6c889></div></div><div class="flex flex-col" data-v-0ab6c889><label class="block text-sm font-medium text-gray-700" data-v-0ab6c889>Search:</label><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" data-v-0ab6c889></div></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-0ab6c889><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-0ab6c889></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap" data-v-0ab6c889><table class="min-w-full bg-white border border-collapse border-black" data-v-0ab6c889><thead class="text-white bg-gray-800" data-v-0ab6c889><tr data-v-0ab6c889><th class="px-4 py-3 text-left border border-black" data-v-0ab6c889>Kode Transaksi</th><th class="px-4 py-3 text-left border border-black" data-v-0ab6c889>Foto</th><th class="px-4 py-3 text-left border border-black" data-v-0ab6c889>Nama</th><th class="px-4 py-3 text-left border border-black" data-v-0ab6c889>Total Transaksi</th><th class="px-4 py-3 text-left border border-black" data-v-0ab6c889>Waktu</th><th class="px-4 py-3 text-left border border-black" data-v-0ab6c889>Status</th></tr></thead><tbody class="bg-white" data-v-0ab6c889><!--[-->`);
        ssrRenderList(paginatedTransactions.value, (transaction) => {
          _push(`<tr data-v-0ab6c889><td class="px-4 py-3 border border-black" data-v-0ab6c889>${ssrInterpolate(transaction.transaction_code)}</td><td class="px-4 py-3 transition duration-200 border border-black cursor-pointer hover:bg-gray-200" data-v-0ab6c889><img${ssrRenderAttr(
            "src",
            transaction.mergedDetails[0].photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${transaction.mergedDetails[0].photo}`) : fallbackImage
          )} alt="Foto Produk" class="w-12 h-12 rounded-md" data-v-0ab6c889></td><td class="px-4 py-3 transition duration-200 border border-black cursor-pointer hover:bg-gray-200" data-v-0ab6c889>${ssrInterpolate(transaction.mergedDetails[0].name)} `);
          if (transaction.mergedDetails.length > 1) {
            _push(`<div class="text-xs text-blue-500 hover:underline" data-v-0ab6c889> Klik untuk lihat +${ssrInterpolate(transaction.mergedDetails.length - 1)} produk lainnya </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-4 py-3 transition duration-200 border border-black cursor-pointer hover:bg-gray-200" data-v-0ab6c889>${ssrInterpolate(formatPrice(transaction.total_payment))}</td><td class="px-4 py-3 transition duration-200 border border-black cursor-pointer hover:bg-gray-200" data-v-0ab6c889>${ssrInterpolate(formatDate(transaction.transaction_date))}</td><td class="px-4 py-3 transition duration-200 border border-black cursor-pointer hover:bg-gray-200" data-v-0ab6c889><span class="${ssrRenderClass(["font-bold", getStatusClass(transaction.status)])}" data-v-0ab6c889>${ssrInterpolate(transaction.status)}</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between mt-4" data-v-0ab6c889><div data-v-0ab6c889> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredTransactions.value.length))} of ${ssrInterpolate(filteredTransactions.value.length)} entries </div><div class="flex items-center space-x-2" data-v-0ab6c889><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-0ab6c889> Prev </button><!--[-->`);
      ssrRenderList(generatePagination.value, (page) => {
        _push(`<button class="${ssrRenderClass([{
          "bg-blue-500 text-white": currentPage.value === page,
          "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
        }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-0ab6c889>${ssrInterpolate(page)}</button>`);
      });
      _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === _ctx.totalPages) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-0ab6c889> Next </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/transaction_pages/transactions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const transactions = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0ab6c889"]]);

export { transactions as default };
//# sourceMappingURL=transactions-Cw5Mrtb6.mjs.map
