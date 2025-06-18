import { ref, resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useRouter, e as useCookie, a as useNuxtApp } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const email = ref("");
    const password = ref("");
    useCookie("my_auth_token");
    const errorMessage = ref("");
    const successMessage = ref("");
    const { vueApp } = useNuxtApp();
    const captchaToken = ref(null);
    const recaptchaAvailable = ref(false);
    const onCaptchaVerified = (response) => {
      console.log("reCAPTCHA verified:", response);
      captchaToken.value = response;
      errorMessage.value = "";
    };
    const onCaptchaError = (error) => {
      console.error("reCAPTCHA error:", error);
      errorMessage.value = "Terjadi kesalahan pada verifikasi reCAPTCHA.";
      captchaToken.value = null;
    };
    const onCaptchaExpired = () => {
      console.log("reCAPTCHA token expired");
      captchaToken.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtRecaptcha = resolveComponent("NuxtRecaptcha");
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
      _push(`<div class="mb-4"><label class="block mb-1 text-gray-700" for="email">Email</label><input${ssrRenderAttr("value", email.value)} type="email" id="email" placeholder="Enter your email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required></div><div class="mb-4"><label class="block mb-1 text-gray-700" for="password">Password</label><input${ssrRenderAttr("value", password.value)} type="password" id="password" placeholder="Enter your password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required></div><div class="mb-4">`);
      if (recaptchaAvailable.value) {
        _push(ssrRenderComponent(_component_NuxtRecaptcha, {
          onSuccess: onCaptchaVerified,
          onError: onCaptchaError,
          onExpired: onCaptchaExpired
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit" class="bg-[#0004FF] hover:bg-blue-800 px-4 py-2 rounded-lg w-full font-semibold text-white transition duration-300"> Login </button></form></div></div>`);
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
//# sourceMappingURL=login-CoQQFA37.mjs.map
