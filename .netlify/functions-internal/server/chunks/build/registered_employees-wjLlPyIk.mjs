import { ref, computed, watch, resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "registered_employees",
  __ssrInlineRender: true,
  setup(__props) {
    const cashiers = ref([]);
    const searchQuery = ref("");
    const itemsPerPage = ref(5);
    const itemsPerPageOptions = [5, 10, 20, 50];
    const currentPage = ref(1);
    const isLoading = ref(true);
    const filteredCashiers = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return cashiers.value.filter((user) => {
        return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.phone.toLowerCase().includes(query);
      });
    });
    const paginatedCashiers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredCashiers.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredCashiers.value.length / itemsPerPage.value);
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
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-a5897838><div class="flex items-center justify-between mb-4" data-v-a5897838><h1 class="mb-4 text-2xl font-bold" data-v-a5897838>Daftar Akun Karyawan</h1>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/employee_pages/employees",
        class: "inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Kembali ke Daftar Karyawan `);
          } else {
            return [
              createTextVNode(" Kembali ke Daftar Karyawan ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center justify-between mb-4" data-v-a5897838><div data-v-a5897838><label class="mr-2" data-v-a5897838>Show</label><select class="p-1 border rounded" data-v-a5897838><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-a5897838${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-a5897838>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-a5897838></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-a5897838><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-a5897838></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-a5897838><table class="w-full bg-white border-collapse border-gray-500" data-v-a5897838><thead data-v-a5897838><tr class="bg-gray-200" data-v-a5897838><th class="p-2 border" data-v-a5897838>#</th><th class="p-0 px-0 border" data-v-a5897838>Foto</th><th class="p-2 border" data-v-a5897838>Nama</th><th class="p-2 border" data-v-a5897838>Email</th><th class="p-2 border" data-v-a5897838>Kontak</th></tr></thead><tbody data-v-a5897838><!--[-->`);
        ssrRenderList(paginatedCashiers.value, (user, index) => {
          _push(`<tr data-v-a5897838><td class="p-2 border" data-v-a5897838>${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + index + 1)}</td><td class="flex items-center justify-center p-2 px-0 border" data-v-a5897838><img${ssrRenderAttr(
            "src",
            user.profile_image ? `http://localhost:8000/storage/profile_images/${user.profile_image}` : "/assets/images/photo_default.png"
          )} class="object-cover w-20 h-20" data-v-a5897838></td><td class="p-2 border" data-v-a5897838>${ssrInterpolate(user.name)}</td><td class="p-2 border" data-v-a5897838>${ssrInterpolate(user.email)}</td><td class="p-2 border" data-v-a5897838>${ssrInterpolate(user.phone)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-a5897838><div data-v-a5897838> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, filteredCashiers.value.length))} of ${ssrInterpolate(filteredCashiers.value.length)} entries </div><div class="flex items-center space-x-2" data-v-a5897838><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-a5897838> Prev </button><!--[-->`);
        ssrRenderList(generatePagination.value, (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-a5897838>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-a5897838> Next </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employee_pages/registered_employees.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const registered_employees = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a5897838"]]);

export { registered_employees as default };
//# sourceMappingURL=registered_employees-wjLlPyIk.mjs.map
