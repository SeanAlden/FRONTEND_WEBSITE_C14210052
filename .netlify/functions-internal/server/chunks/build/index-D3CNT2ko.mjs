import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { mergeProps, unref, ref, useSSRContext } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { e as useCookie } from './server.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'consola/core';
import 'mitt';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';

const _imports_0 = publicAssetsURL("/assets/icons/income.png");
const _imports_1 = publicAssetsURL("/assets/icons/transaction.png");
const _imports_2 = publicAssetsURL("/assets/icons/product_data.png");
const _sfc_main = {
  setup() {
    const isLoading = ref(true);
    const totalRevenue = ref(0);
    const totalTransactions = ref(0);
    const totalProducts = ref(0);
    const topProducts = ref([]);
    const salesData = ref([]);
    const salesLabels = ref([]);
    const currentMonth = ref((/* @__PURE__ */ new Date()).toLocaleString("id-ID", { month: "long" }));
    const fallbackImage = "/assets/images/avatar.png";
    const onImageError = (event) => {
      event.target.src = fallbackImage;
    };
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
    const currentYear = ref((/* @__PURE__ */ new Date()).getFullYear());
    const years = ref((/* @__PURE__ */ new Date()).getFullYear());
    let chartInstance = null;
    const user = ref(null);
    const token = useCookie("my_auth_token");
    const fetchData = async () => {
      var _a;
      try {
        isLoading.value = true;
        const response = await axios.get(
          useApi(`/api/dashboard?month=${currentMonth.value}&year=${currentYear.value}`),
          {
            headers: {
              Authorization: `Bearer ${token.value}`
              // ✅ Pakai token untuk semua request
            }
          }
        );
        totalRevenue.value = response.data.total_revenue;
        totalTransactions.value = response.data.total_transactions;
        totalProducts.value = response.data.total_products;
        topProducts.value = response.data.top_products;
        salesData.value = response.data.sales_by_month.map((item) => item.revenue);
        salesLabels.value = response.data.sales_by_month.map((item) => item.month);
        renderChart();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (((_a = error.response) == null ? void 0 : _a.status) === 401) {
          alert("Autentikasi gagal, silakan login ulang.");
          (void 0).location.href = "/login";
        }
      } finally {
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      }
    };
    const renderChart = () => {
      const ctx = (void 0).getElementById("salesChart").getContext("2d");
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: salesLabels.value,
          datasets: [
            {
              label: "Total Pendapatan",
              data: salesData.value,
              borderColor: "#4A90E2",
              backgroundColor: "rgba(74, 144, 226, 0.2)",
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
          }
        }
      });
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    return {
      totalRevenue,
      totalTransactions,
      totalProducts,
      topProducts,
      salesLabels,
      salesData,
      currentMonth,
      months,
      currentYear,
      years,
      fetchData,
      formatPrice,
      user,
      // ✅ kembalikan jika ingin ditampilkan di template
      onImageError
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen p-6 bg-gray-100" }, _attrs))}><h1 class="text-2xl font-bold">Dashboard</h1><p class="text-gray-600">Hello, ${ssrInterpolate(((_a = $setup.user) == null ? void 0 : _a.name) || "Guest")}</p><div class="flex flex-wrap items-center mt-4 mb-4"><div class="flex items-center mb-2 mr-6"><label for="month" class="mr-2 text-sm font-medium text-gray-700"> Pilih Bulan: </label><select class="px-2 py-1 border border-gray-300 rounded-md"><!--[-->`);
  ssrRenderList($setup.months, (month) => {
    _push(`<option${ssrRenderAttr("value", month)}${ssrIncludeBooleanAttr(Array.isArray($setup.currentMonth) ? ssrLooseContain($setup.currentMonth, month) : ssrLooseEqual($setup.currentMonth, month)) ? " selected" : ""}>${ssrInterpolate(month)}</option>`);
  });
  _push(`<!--]--></select></div><div class="flex items-center mb-2"><label for="year" class="mr-2 text-sm font-medium text-gray-700"> Pilih Tahun: </label><input${ssrRenderAttr("value", $setup.currentYear)} type="number" class="px-2 py-1 border border-gray-300 rounded-md"></div></div><div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3"><div class="flex items-center p-4 bg-white rounded-lg shadow"><img${ssrRenderAttr("src", _imports_0)} class="w-10 h-10 mr-3"><div class="overflow-x-auto whitespace-nowrap"><p class="text-gray-500">Income Total (${ssrInterpolate($setup.currentMonth)})</p><p class="text-xl font-bold">${ssrInterpolate($setup.formatPrice($setup.totalRevenue))}</p></div></div><div class="flex items-center p-4 bg-white rounded-lg shadow"><img${ssrRenderAttr("src", _imports_1)} class="w-10 h-10 mr-3"><div class="overflow-x-auto whitespace-nowrap"><p class="text-gray-500">Transaction Total (${ssrInterpolate($setup.currentMonth)})</p><p class="text-xl font-bold">${ssrInterpolate($setup.totalTransactions)}</p></div></div><div class="flex items-center p-4 bg-white rounded-lg shadow"><img${ssrRenderAttr("src", _imports_2)} class="w-10 h-10 mr-3"><div class="overflow-x-auto whitespace-nowrap"><p class="text-gray-500">Product Total</p><p class="text-xl font-bold">${ssrInterpolate($setup.totalProducts)}</p></div></div></div><div class="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2"><div class="p-4 overflow-x-auto bg-white rounded-lg shadow whitespace-nowrap"><h2 class="text-lg font-bold">Top Products</h2><table class="w-full mt-3 border border-collapse border-gray-200"><thead><tr class="bg-gray-100"><th class="p-2 border">Photo</th><th class="p-2 border">Product</th><th class="p-2 border">Price</th><th class="p-2 border">Category</th><th class="p-2 border">Sold Total</th></tr></thead><tbody><!--[-->`);
  ssrRenderList($setup.topProducts, (product) => {
    _push(`<tr class="border"><td class="flex items-center p-2"><img${ssrRenderAttr(
      "src",
      product.photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${product.photo}`) : _ctx.fallbackImage
    )} class="w-10 h-10 mr-2"></td><td>${ssrInterpolate(product.name)}</td><td class="p-2">${ssrInterpolate($setup.formatPrice(product.price))}</td><td class="p-2">${ssrInterpolate(product.category_name)}</td><td class="p-2">${ssrInterpolate(product.total_sold)}</td></tr>`);
  });
  _push(`<!--]--></tbody></table></div><div class="p-4 overflow-x-auto bg-white rounded-lg shadow whitespace-nowrap"><h2 class="text-lg font-bold">Grafik Penjualan</h2><canvas id="salesChart"></canvas></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-D3CNT2ko.mjs.map
