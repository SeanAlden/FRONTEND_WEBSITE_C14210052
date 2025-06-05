import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    route.params.id;
    const transaction = ref(null);
    const products = ref([]);
    const statusHistories = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const showStatusModal = ref(false);
    useCookie("my_auth_token");
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      date.setHours(date.getHours());
      return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(price);
    };
    computed(
      () => props.products.filter((product) => product.quantity > 0)
    );
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
    const latestStatus = () => {
      if (statusHistories.value.length) {
        return statusHistories.value[statusHistories.value.length - 1].status;
      }
      return "-";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl p-6 mx-auto" }, _attrs))} data-v-f52289c1><button class="flex items-center px-6 py-2 mb-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600" data-v-f52289c1> Kembali </button>`);
      if (isLoading.value) {
        _push(`<div class="text-center text-gray-500" data-v-f52289c1>Memuat...</div>`);
      } else if (error.value) {
        _push(`<div class="text-center text-red-500" data-v-f52289c1>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<div data-v-f52289c1><h1 class="mb-8 text-3xl font-bold" data-v-f52289c1> Detail Transaksi (${ssrInterpolate(transaction.value.transaction_code)}) </h1><div class="flex justify-end mb-4" data-v-f52289c1><button class="px-4 py-2 mr-2 text-white bg-blue-500 rounded" data-v-f52289c1> Ekspor ke PDF </button><button class="px-4 py-2 text-white bg-green-500 rounded" data-v-f52289c1> Ekspor ke Excel </button></div><div class="p-6 mb-10 bg-white rounded-lg shadow-md" data-v-f52289c1><div class="gap-4" data-v-f52289c1><div data-v-f52289c1><strong data-v-f52289c1>Kode Transaksi:</strong> ${ssrInterpolate(transaction.value.transaction_code)}</div><div data-v-f52289c1><strong data-v-f52289c1>Waktu Transaksi:</strong> ${ssrInterpolate(formatDate(transaction.value.transaction_date))}</div><div data-v-f52289c1><strong data-v-f52289c1>Karyawan:</strong> ${ssrInterpolate(transaction.value.user_name)}</div></div></div><div class="p-6 mb-10 bg-white rounded-lg shadow-md" data-v-f52289c1><div class="flex items-center justify-between mb-4" data-v-f52289c1><h2 class="text-2xl font-semibold" data-v-f52289c1><span class="font-bold" data-v-f52289c1>Riwayat Status: </span><span class="${ssrRenderClass(getStatusClass(latestStatus()))}" data-v-f52289c1>${ssrInterpolate(latestStatus())}</span></h2><button class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600" data-v-f52289c1> Lihat Detail </button></div></div><h5 class="mb-8 text-3xl font-bold" data-v-f52289c1>Produk</h5><div class="p-6 mb-10 bg-white rounded-lg shadow-md" data-v-f52289c1>`);
        if (products.value.length) {
          _push(`<div data-v-f52289c1><div class="overflow-x-auto" data-v-f52289c1><table class="min-w-full text-left border" data-v-f52289c1><thead class="bg-gray-100" data-v-f52289c1><tr data-v-f52289c1><th class="px-4 py-3 border" data-v-f52289c1>Foto</th><th class="px-4 py-3 border" data-v-f52289c1>Nama Produk</th><th class="px-4 py-3 border" data-v-f52289c1>Kode Produk</th><th class="px-4 py-3 border" data-v-f52289c1>Harga</th><th class="px-4 py-3 border" data-v-f52289c1>Expired Date</th><th class="px-4 py-3 border" data-v-f52289c1>Jumlah</th><th class="px-4 py-3 border" data-v-f52289c1>Stock Sebelum</th><th class="px-4 py-3 border" data-v-f52289c1>Stock Setelah</th><th class="px-4 py-3 border" data-v-f52289c1>Total</th></tr></thead><tbody data-v-f52289c1><!--[-->`);
          ssrRenderList(products.value.filter((p) => p.quantity > 0), (product) => {
            _push(`<tr class="hover:bg-gray-50" data-v-f52289c1><td class="px-4 py-3 border" data-v-f52289c1><img${ssrRenderAttr(
              "src",
              product.product_photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${product.product_photo}`) : fallbackImage
            )} alt="Foto Produk" class="object-cover w-16 h-16 rounded" data-v-f52289c1></td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(product.product_name)}</td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(product.product_code)}</td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(formatPrice(product.product_price))}</td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(product.exp_date)}</td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(product.quantity)}</td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(product.stock_before)}</td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(product.stock_after)}</td><td class="px-4 py-3 border" data-v-f52289c1>${ssrInterpolate(formatPrice(product.quantity * product.product_price))}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div></div>`);
        } else {
          _push(`<div data-v-f52289c1><p data-v-f52289c1>Produk tidak ditemukan.</p></div>`);
        }
        _push(`</div><h3 class="mb-8 text-3xl font-bold" data-v-f52289c1>Metode Pengiriman</h3><div class="p-6 mb-10 bg-white rounded-lg shadow-md" data-v-f52289c1><div class="flex items-center justify-between mb-4" data-v-f52289c1><h2 class="text-2xl font-semibold" data-v-f52289c1>${ssrInterpolate(transaction.value.shipping_method)}</h2></div><p class="text-gray-500" data-v-f52289c1>${ssrInterpolate(transaction.value.shipping_time)}</p></div><h3 class="mb-8 text-3xl font-bold" data-v-f52289c1>Rincian Belanja</h3><div class="p-6 mb-10 bg-white rounded-lg shadow-md" data-v-f52289c1><div class="gap-4" data-v-f52289c1><div data-v-f52289c1><strong data-v-f52289c1>Metode Pembayaran:</strong> ${ssrInterpolate(transaction.value.payment_method)}</div><br data-v-f52289c1><div data-v-f52289c1><strong data-v-f52289c1>Daftar Biaya</strong></div> Total Biaya Produk : ${ssrInterpolate(formatPrice(transaction.value.gross_amount))} <div data-v-f52289c1>Biaya Pengiriman : ${ssrInterpolate(formatPrice(transaction.value.shipping_cost))}</div><div data-v-f52289c1><div data-v-f52289c1>--------------------------------------- +</div><strong data-v-f52289c1>Total Pembayaran :</strong> ${ssrInterpolate(formatPrice(transaction.value.total_payment))}</div></div></div>`);
        if (showStatusModal.value) {
          _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" data-v-f52289c1><div class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg" data-v-f52289c1><button class="absolute text-2xl text-gray-500 right-4 top-4 hover:text-black" data-v-f52289c1> \xD7 </button><h3 class="mb-6 text-xl font-semibold" data-v-f52289c1>Timeline Riwayat Status</h3>`);
          if (statusHistories.value.length) {
            _push(`<div class="sticky top-0 z-10 px-4 py-3 mb-8 text-blue-800 bg-blue-100 rounded-lg" data-v-f52289c1><p class="text-sm" data-v-f52289c1>Status Terakhir:</p><p class="${ssrRenderClass([getStatusClass(statusHistories.value[statusHistories.value.length - 1].status), "text-lg font-bold"])}" data-v-f52289c1>${ssrInterpolate(statusHistories.value[statusHistories.value.length - 1].status)}</p><p class="text-xs text-gray-500" data-v-f52289c1>${ssrInterpolate(formatDate(statusHistories.value[statusHistories.value.length - 1].changed_at))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="relative ml-4" data-v-f52289c1><div class="absolute left-2 top-0 h-full w-0.5 border-l-2 border-dashed border-blue-400" data-v-f52289c1></div><!--[-->`);
          ssrRenderList([...statusHistories.value].reverse(), (history, index) => {
            _push(`<div class="relative pl-8 mb-10" data-v-f52289c1><div class="absolute top-0 w-4 h-4 bg-blue-500 rounded-full -left-0" data-v-f52289c1></div><p class="text-lg font-semibold" data-v-f52289c1>${ssrInterpolate(history.status)}</p><p class="text-sm text-gray-500" data-v-f52289c1>${ssrInterpolate(formatDate(history.changed_at))}</p></div>`);
          });
          _push(`<!--]--></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/transaction_pages/detail/[id].vue");
  return _sfc_setup ? _sfc_setup(props2, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f52289c1"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-rmsqr3w3.mjs.map
