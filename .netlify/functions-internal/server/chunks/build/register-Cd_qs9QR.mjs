import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as useRouter, e as useCookie } from './server.mjs';
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

const _sfc_main = {
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const name = ref("");
    const email = ref("");
    const phone = ref("");
    const password = ref("");
    const confirm_password = ref("");
    useCookie("my_auth_token");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center min-h-screen bg-gray-100" }, _attrs))}><div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md"><h2 class="mb-6 text-2xl font-semibold text-center text-gray-800"> Register Your Account </h2><form>`);
      if (_ctx.errorMessage) {
        _push(`<div class="mb-4 text-sm text-red-500">${ssrInterpolate(_ctx.errorMessage)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.successMessage) {
        _push(`<div class="mb-4 text-sm text-green-500">${ssrInterpolate(_ctx.successMessage)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4"><label class="block mb-1 text-gray-700" for="name">Name</label><input${ssrRenderAttr("value", unref(name))} type="text" id="name" placeholder="Enter your name" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required></div><div class="mb-4"><label class="block mb-1 text-gray-700" for="email">Email</label><input${ssrRenderAttr("value", unref(email))} type="email" id="email" placeholder="Enter your email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required></div><div class="mb-4"><label class="block mb-1 text-gray-700" for="phone">Phone</label><input${ssrRenderAttr("value", unref(phone))} type="text" id="phone" placeholder="Enter your phone" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required></div><div class="mb-4"><label class="block mb-1 text-gray-700" for="password">Password</label><input${ssrRenderAttr("value", unref(password))} type="password" id="password" placeholder="Enter your password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required></div><div class="mb-6"><label class="block mb-1 text-gray-700" for="password_confirmation">Confirm Password</label><input${ssrRenderAttr("value", unref(confirm_password))} type="password" id="confirm_password" placeholder="Confirm your password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required></div><button type="submit" class="bg-[#0004FF] hover:bg-blue-800 px-4 py-2 rounded-lg w-full font-semibold text-white transition duration-300"> Register </button></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-Cd_qs9QR.mjs.map
