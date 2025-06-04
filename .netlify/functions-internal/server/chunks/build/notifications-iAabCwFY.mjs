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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl p-6" }, _attrs))} data-v-80fdfdea><h1 class="mb-6 flex items-center gap-2 text-3xl font-bold text-gray-800" data-v-80fdfdea><span class="inline-block rounded-full bg-blue-100 p-2 text-blue-600" data-v-80fdfdea> \u{1F514} </span> Notifikasi </h1>`);
      if (unref(loading)) {
        _push(`<div class="text-center text-gray-600" data-v-80fdfdea>Memuat notifikasi...</div>`);
      } else if (unref(notifications2).length === 0) {
        _push(`<div class="text-center text-gray-500" data-v-80fdfdea> Tidak ada notifikasi saat ini. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<ul${ssrRenderAttrs({
        name: "fade",
        class: "space-y-4"
      })} data-v-80fdfdea>`);
      ssrRenderList(unref(notifications2), (notif) => {
        _push(`<li class="rounded-lg border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg" data-v-80fdfdea><div class="flex items-start justify-between" data-v-80fdfdea><p class="font-medium text-gray-900" data-v-80fdfdea>${ssrInterpolate(notif.message)}</p><button class="text-sm text-red-500 hover:text-red-700" title="Hapus notifikasi" data-v-80fdfdea> \u{1F5D1}\uFE0F </button></div><div class="mt-2 flex items-center justify-between text-sm text-gray-500" data-v-80fdfdea><span data-v-80fdfdea>${ssrInterpolate(formatDate(notif.notification_time))}</span><span class="${ssrRenderClass(badgeClass(notif.notification_type))}" data-v-80fdfdea>${ssrInterpolate(notif.notification_type)}</span></div></li>`);
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
const notifications = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-80fdfdea"]]);

export { notifications as default };
//# sourceMappingURL=notifications-iAabCwFY.mjs.map
