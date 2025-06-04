import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, computed, watch, resolveComponent, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './server.mjs';
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

const fallbackImage = "/assets/images/photo_default.png";
const _sfc_main = {
  __name: "employees",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const employees2 = ref([]);
    const searchQuery = ref("");
    const itemsPerPageOptions = [5, 10, 20, 50];
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const isLoading = ref(true);
    const fetchEmployees = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(useApi("/api/employees"));
        employees2.value = response.data.data;
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const filteredProducts = computed(() => {
      return employees2.value.filter((employee) => {
        const query = searchQuery.value.toLowerCase();
        return employee.code.toLowerCase().includes(query) || // Pencarian berdasarkan kode
        employee.employee_name.toLowerCase().includes(query) || // Pencarian berdasarkan kode
        employee.employee_position.toLowerCase().includes(query) || // Pencarian berdasarkan kode
        employee.employee_contact.toLowerCase().includes(query);
      });
    });
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredProducts.value.slice(start, start + itemsPerPage.value);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
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
      fetchEmployees();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container p-6 mx-auto" }, _attrs))} data-v-e572663b><h1 class="mb-4 text-2xl font-bold" data-v-e572663b>Daftar Karyawan Diterima</h1><div class="flex items-center justify-start mb-4" data-v-e572663b>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/employee_pages/add_employee",
        class: "inline-block px-4 py-2 mb-4 mr-4 text-white bg-blue-500 rounded"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Tambah Karyawan `);
          } else {
            return [
              createTextVNode(" Tambah Karyawan ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/employee_pages/registered_employees",
        class: "inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Daftar Akun Karyawan `);
          } else {
            return [
              createTextVNode(" Daftar Akun Karyawan ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center justify-between mb-4" data-v-e572663b><div data-v-e572663b><label class="mr-2" data-v-e572663b>Show</label><select id="itemsPerPage" data-v-e572663b><!--[-->`);
      ssrRenderList(itemsPerPageOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-e572663b${ssrIncludeBooleanAttr(Array.isArray(itemsPerPage.value) ? ssrLooseContain(itemsPerPage.value, option) : ssrLooseEqual(itemsPerPage.value, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select><span class="ml-2" data-v-e572663b>entries</span></div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search" class="p-2 border rounded" data-v-e572663b></div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-10" data-v-e572663b><div class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader" data-v-e572663b></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLoading.value) {
        _push(`<div class="overflow-x-auto whitespace-nowrap" data-v-e572663b><table class="w-full bg-white border-collapse border-gray-500" data-v-e572663b><thead data-v-e572663b><tr class="bg-gray-200" data-v-e572663b><th class="p-2 border" data-v-e572663b>#</th><th class="p-0 px-0 border" data-v-e572663b>Foto</th><th class="p-2 border" data-v-e572663b>Nama</th><th class="p-2 border" data-v-e572663b>Posisi</th><th class="p-2 border" data-v-e572663b>Kontak</th><th class="p-2 border" data-v-e572663b>Aksi</th></tr></thead><tbody data-v-e572663b><!--[-->`);
        ssrRenderList(unref(paginatedProducts), (employee) => {
          _push(`<tr data-v-e572663b><td class="p-2 border" data-v-e572663b>${ssrInterpolate(employee.code)}</td><td class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2" data-v-e572663b><img${ssrRenderAttr(
            "src",
            employee.employee_photo ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/${employee.employee_photo}`) : fallbackImage
          )} class="w-20 h-20 object-fit" data-v-e572663b></td><td class="p-2 text-blue-500 underline border cursor-pointer" data-v-e572663b>${ssrInterpolate(employee.employee_name)}</td><td class="p-2 border" data-v-e572663b>${ssrInterpolate(employee.employee_position)}</td><td class="p-2 border" data-v-e572663b>${ssrInterpolate(employee.employee_contact)}</td><td class="p-2 border" data-v-e572663b>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: `/employee_pages/edit/${employee.id}`,
            class: "px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Edit`);
              } else {
                return [
                  createTextVNode("Edit")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button class="px-2 py-1 text-white bg-red-500 rounded" data-v-e572663b> Hapus </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-between mt-4" data-v-e572663b><div data-v-e572663b> Showing ${ssrInterpolate((currentPage.value - 1) * itemsPerPage.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * itemsPerPage.value, unref(filteredProducts).length))} of ${ssrInterpolate(unref(filteredProducts).length)} entries </div><div class="flex items-center space-x-2" data-v-e572663b><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-e572663b> Prev </button><!--[-->`);
        ssrRenderList(unref(generatePagination), (page) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-blue-500 text-white": currentPage.value === page,
            "bg-white text-blue-500 hover:bg-blue-100": currentPage.value !== page && page !== "..."
          }, "px-3 py-1 transition-all duration-200 border rounded"])}" data-v-e572663b>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === unref(totalPages)) ? " disabled" : ""} class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50" data-v-e572663b> Next </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/employee_pages/employees.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const employees = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e572663b"]]);

export { employees as default };
//# sourceMappingURL=employees-XuKzJ78M.mjs.map
