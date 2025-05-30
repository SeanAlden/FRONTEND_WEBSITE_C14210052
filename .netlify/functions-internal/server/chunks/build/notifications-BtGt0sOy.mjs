import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notifications",
  __ssrInlineRender: true,
  setup(__props) {
    const notifications2 = ref([]);
    const loading = ref(true);
    const formatDate = (datetime) => {
      const date = new Date(datetime);
      date.setHours(date.getHours() + 7);
      return date.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    };
    const badgeClass = (type) => {
      switch (type.toLowerCase()) {
        case "info":
          return "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold";
        case "warning":
          return "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold";
        case "error":
          return "bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold";
        case "success":
          return "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold";
        default:
          return "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl p-6 mx-auto" }, _attrs))} data-v-37a4cd7a><h1 class="flex items-center gap-2 mb-6 text-3xl font-bold text-gray-800" data-v-37a4cd7a><span class="inline-block p-2 text-blue-600 bg-blue-100 rounded-full" data-v-37a4cd7a> \u{1F514} </span> Notifikasi </h1>`);
      if (unref(loading)) {
        _push(`<div class="text-center text-gray-600" data-v-37a4cd7a>Memuat notifikasi...</div>`);
      } else if (unref(notifications2).length === 0) {
        _push(`<div class="text-center text-gray-500" data-v-37a4cd7a> Tidak ada notifikasi saat ini. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<ul${ssrRenderAttrs({
        name: "fade",
        class: "space-y-4"
      })} data-v-37a4cd7a>`);
      ssrRenderList(unref(notifications2), (notif) => {
        _push(`<li class="p-5 transition bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg" data-v-37a4cd7a><div class="flex items-start justify-between" data-v-37a4cd7a><p class="font-medium text-gray-900" data-v-37a4cd7a>${ssrInterpolate(notif.message)}</p><button class="text-sm text-red-500 hover:text-red-700" title="Hapus notifikasi" data-v-37a4cd7a> \u{1F5D1}\uFE0F </button></div><div class="flex items-center justify-between mt-2 text-sm text-gray-500" data-v-37a4cd7a><span data-v-37a4cd7a>${ssrInterpolate(formatDate(notif.notification_time))}</span><span class="${ssrRenderClass(badgeClass(notif.notification_type))}" data-v-37a4cd7a>${ssrInterpolate(notif.notification_type)}</span></div></li>`);
      });
      _push(`</ul></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const notifications = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-37a4cd7a"]]);

export { notifications as default };
//# sourceMappingURL=notifications-BtGt0sOy.mjs.map
