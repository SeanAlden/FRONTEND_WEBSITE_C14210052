import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { u as useRouter, e as useCookie } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-BJjwR1_u.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import 'consola/core';
import 'axios';

const _imports_0$1 = publicAssetsURL("/assets/icons/Doorbell.png");
const _imports_1$1 = publicAssetsURL("/assets/icons/person.png");
const _imports_2$1 = publicAssetsURL("/assets/icons/password.png");
const _imports_3$1 = publicAssetsURL("/assets/icons/logout.png");
const fallbackImage = "/assets/images/photo_default.png";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const isDropdownOpen = ref(false);
    const isLogoutModalOpen = ref(false);
    ref(null);
    ref(null);
    useRouter();
    const user = ref({
      name: "",
      email: "",
      profile_image: "",
      usertype: ""
    });
    useCookie("my_auth_token");
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<div${ssrRenderAttrs(_attrs)}><header class="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gray-400 shadow"><h1 class="text-xl font-semibold"></h1><div class="relative flex align-items-xl-end"><div><div class="flex items-center gap-6"><button class="w-10 h-10 overflow-hidden rounded-full"><img${ssrRenderAttr("src", _imports_0$1)} alt="Notification" class="object-cover w-full h-full"></button><button class="w-10 h-10 overflow-hidden bg-gray-300 rounded-full focus:outline-none"><img${ssrRenderAttr(
        "src",
        user.value.profile_image ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/profile_images/${user.value.profile_image}`) : fallbackImage
      )} class="object-cover w-full h-full"></button></div></div>`);
      if (isDropdownOpen.value) {
        _push(`<div class="absolute right-0 z-50 w-56 mt-2 bg-white border rounded-lg shadow-lg"><div class="p-4 text-center border-b bg-gray-50"><img${ssrRenderAttr(
          "src",
          user.value.profile_image ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/public/storage/profile_images/${user.value.profile_image}`) : fallbackImage
        )} class="w-16 h-16 mx-auto border border-gray-300 rounded-full"><h3 class="mt-2 text-lg font-semibold text-gray-900">${ssrInterpolate(((_a = user.value) == null ? void 0 : _a.name) || "Guest")}</h3><p class="text-sm text-gray-600">${ssrInterpolate(((_b = user.value) == null ? void 0 : _b.email) || "-")}</p><p class="text-xs text-gray-500">${ssrInterpolate(((_c = user.value) == null ? void 0 : _c.usertype) || "-")}</p></div><div class="p-2"><button class="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"><img${ssrRenderAttr("src", _imports_1$1)} alt="Edit Profile" class="w-5 h-5 mr-3"> Edit Profile </button><button class="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"><img${ssrRenderAttr("src", _imports_2$1)} alt="Change Password" class="w-5 h-5 mr-3"> Change Password </button><button class="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-100"><img${ssrRenderAttr("src", _imports_3$1)} alt="Log Out" class="w-5 h-5 mr-3"> Log Out </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header>`);
      if (isLogoutModalOpen.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"><div class="p-6 text-center bg-white rounded-lg shadow-lg w-96"><img${ssrRenderAttr("src", _imports_3$1)} alt="Logout Icon" class="w-10 h-10 mx-auto mb-3"><h2 class="text-xl font-semibold text-gray-900">Log Out Account</h2><p class="mt-2 text-gray-700"> Are you sure you want to logout? <br> Once you logout you need to login again. Are you OK? </p><div class="flex justify-center mt-4 space-x-4"><button class="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"> Yes </button><button class="px-6 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"> No </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _imports_0 = publicAssetsURL("/assets/icons/menu-white.svg");
const _imports_1 = publicAssetsURL("/assets/icons/dashboard.png");
const _imports_2 = publicAssetsURL("/assets/icons/report.png");
const _imports_3 = publicAssetsURL("/assets/icons/category.png");
const _imports_4 = publicAssetsURL("/assets/icons/product.png");
const _imports_5 = publicAssetsURL("/assets/icons/transactions.png");
const _imports_6 = publicAssetsURL("/assets/icons/employee.png");
const _imports_7 = publicAssetsURL("/assets/icons/analysis.png");
const _sfc_main$1 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const isSidebarOpen = ref(true);
    const isProductsOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [isSidebarOpen.value ? "w-64" : "w-16", "fixed top-0 bottom-0 left-0 z-50 flex flex-col overflow-y-auto text-white transition-all duration-300 bg-gray-800"]
      }, _attrs))} data-v-d345b714><div class="flex items-center justify-between p-4" data-v-d345b714>`);
      if (isSidebarOpen.value) {
        _push(`<span class="text-lg font-bold text-red-400" data-v-d345b714> Asia Raya Cashier </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="p-2 rounded hover:bg-gray-700" data-v-d345b714><img${ssrRenderAttr("src", _imports_0)} alt="Toggle" class="w-6 h-6" data-v-d345b714></button></div><div class="flex-1 overflow-y-auto" data-v-d345b714><nav class="flex flex-col mt-4 space-y-2" data-v-d345b714>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center p-3 hover:bg-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_1)} class="w-6 h-6 mr-3" data-v-d345b714${_scopeId}>`);
            if (isSidebarOpen.value) {
              _push2(`<span data-v-d345b714${_scopeId}>Dashboard</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("img", {
                src: _imports_1,
                class: "w-6 h-6 mr-3"
              }),
              isSidebarOpen.value ? (openBlock(), createBlock("span", { key: 0 }, "Dashboard")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/sales_report_pages/sales_reports",
        class: "flex items-center p-3 hover:bg-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_2)} class="w-6 h-6 mr-3" data-v-d345b714${_scopeId}>`);
            if (isSidebarOpen.value) {
              _push2(`<span data-v-d345b714${_scopeId}>Sales Reports</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("img", {
                src: _imports_2,
                class: "w-6 h-6 mr-3"
              }),
              isSidebarOpen.value ? (openBlock(), createBlock("span", { key: 0 }, "Sales Reports")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category_pages/categories",
        class: "flex items-center p-3 hover:bg-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_3)} class="w-6 h-6 mr-3" data-v-d345b714${_scopeId}>`);
            if (isSidebarOpen.value) {
              _push2(`<span data-v-d345b714${_scopeId}>Categories</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("img", {
                src: _imports_3,
                class: "w-6 h-6 mr-3"
              }),
              isSidebarOpen.value ? (openBlock(), createBlock("span", { key: 0 }, "Categories")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div data-v-d345b714><div class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700" data-v-d345b714><div class="flex items-center" data-v-d345b714><img${ssrRenderAttr("src", _imports_4)} class="w-6 h-6 mr-3" data-v-d345b714>`);
      if (isSidebarOpen.value) {
        _push(`<span data-v-d345b714>Products</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (isSidebarOpen.value) {
        _push(`<img${ssrRenderAttr("src", isProductsOpen.value ? "/assets/icons/chevron_up.png" : "/assets/icons/chevron_down.png")} class="w-4 h-4 transition-transform duration-300" data-v-d345b714>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (isProductsOpen.value) {
        _push(`<div class="space-y-2 text-sm ml-9" data-v-d345b714>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/product_pages/products",
          class: "block p-2 hover:bg-gray-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Product List`);
            } else {
              return [
                createTextVNode("Product List")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/product_pages/deleted_products",
          class: "block p-2 hover:bg-gray-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Deleted Products`);
            } else {
              return [
                createTextVNode("Deleted Products")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/product_pages/deleted_products_history",
          class: "block p-2 hover:bg-gray-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Deleted Products History`);
            } else {
              return [
                createTextVNode("Deleted Products History")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/product_pages/entry_products",
          class: "block p-2 hover:bg-gray-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Entry Products`);
            } else {
              return [
                createTextVNode("Entry Products")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/product_pages/exit_products",
          class: "block p-2 hover:bg-gray-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Exit Products`);
            } else {
              return [
                createTextVNode("Exit Products")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/product_pages/product_stocks_report",
          class: "block p-2 hover:bg-gray-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Product Stocks Report`);
            } else {
              return [
                createTextVNode("Product Stocks Report")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/transaction_pages/transactions",
        class: "flex items-center p-3 hover:bg-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_5)} class="w-6 h-6 mr-3" data-v-d345b714${_scopeId}>`);
            if (isSidebarOpen.value) {
              _push2(`<span data-v-d345b714${_scopeId}>Transactions</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("img", {
                src: _imports_5,
                class: "w-6 h-6 mr-3"
              }),
              isSidebarOpen.value ? (openBlock(), createBlock("span", { key: 0 }, "Transactions")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/employee_pages/employees",
        class: "flex items-center p-3 hover:bg-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_6)} class="w-6 h-6 mr-3" data-v-d345b714${_scopeId}>`);
            if (isSidebarOpen.value) {
              _push2(`<span data-v-d345b714${_scopeId}>Employees</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("img", {
                src: _imports_6,
                class: "w-6 h-6 mr-3"
              }),
              isSidebarOpen.value ? (openBlock(), createBlock("span", { key: 0 }, "Employees")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/analysis_pages/sales_count_page",
        class: "flex items-center p-3 hover:bg-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_7)} class="w-6 h-6 mr-3" data-v-d345b714${_scopeId}>`);
            if (isSidebarOpen.value) {
              _push2(`<span data-v-d345b714${_scopeId}>Analisis C4.5</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("img", {
                src: _imports_7,
                class: "w-6 h-6 mr-3"
              }),
              isSidebarOpen.value ? (openBlock(), createBlock("span", { key: 0 }, "Analisis C4.5")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d345b714"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const isSidebarOpen = ref(true);
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = _sfc_main$2;
      const _component_Sidebar = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen bg-gray-100 text-gray-900" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(ssrRenderComponent(_component_Sidebar, {
        isSidebarOpen: unref(isSidebarOpen),
        onToggleSidebar: ($event) => isSidebarOpen.value = !unref(isSidebarOpen)
      }, null, _parent));
      _push(`<div class="${ssrRenderClass(["flex-1 transition-all duration-300", unref(isSidebarOpen) ? "ml-64" : "ml-16"])}"><div class="mt-16 p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-X2V6l1u4.mjs.map
