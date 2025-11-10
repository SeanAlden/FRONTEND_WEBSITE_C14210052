import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useCookie, a as useRouter } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'node:util';
import 'node:process';
import 'node:tty';
import 'mitt';
import 'axios';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    useCookie("my_auth_token");
    useRouter();
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center min-h-screen bg-gray-100" }, _attrs))}><div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md"><h2 class="mb-6 text-2xl font-semibold text-center text-gray-800">Login</h2><form>`);
      if (errorMessage.value) {
        _push(`<div class="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (successMessage.value) {
        _push(`<div class="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg">${ssrInterpolate(successMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4"><label class="block mb-1 text-gray-700" for="email">Email</label><input${ssrRenderAttr("value", email.value)} type="email" id="email" placeholder="Enter your email" class="${ssrRenderClass([{ "border-red-500": emailError.value }, "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"])}" required>`);
      if (emailError.value) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(emailError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-4"><label class="block mb-1 text-gray-700" for="password">Password</label><input${ssrRenderAttr("value", password.value)} type="password" id="password" placeholder="Enter your password" class="${ssrRenderClass([{ "border-red-500": passwordError.value }, "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"])}" required>`);
      if (passwordError.value) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(passwordError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-4"></div><button type="submit" class="w-full rounded-lg bg-[#0004FF] px-4 py-2 font-semibold text-white transition duration-300 hover:bg-blue-800"> Login </button></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DU5TPFAR.mjs.map
