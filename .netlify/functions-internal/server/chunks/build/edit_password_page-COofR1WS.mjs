import { u as useApi } from './useApi-Dqh0F_3-.mjs';
import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useCookie } from './server.mjs';
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

const fallbackImage = "/assets/images/photo_default.png";
const _sfc_main = {
  __name: "edit_password_page",
  __ssrInlineRender: true,
  setup(__props) {
    const user = ref({
      name: "",
      email: "",
      profile_image: ""
    });
    const password = ref({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    });
    ref("/assets/images/photo_default.png");
    const isEditing = ref(false);
    useCookie("my_auth_token");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex w-full h-full p-6 bg-white rounded-lg shadow-lg max-w-8xl max-h-8xl" }, _attrs))}><div class="w-1/2 p-6 border-r"><h2 class="mb-4 text-2xl font-bold">Set Your Password</h2><div class="p-6 bg-gray-100 rounded-lg"><div class="flex items-center mb-4"><img${ssrRenderAttr(
        "src",
        user.value.profile_image ? ("useApi" in _ctx ? _ctx.useApi : unref(useApi))(`/storage/profile_images/${user.value.profile_image}`) : fallbackImage
      )} class="w-20 h-20 rounded-full"><h3 class="ml-4 text-xl font-bold">${ssrInterpolate(user.value.name)}</h3></div><div class="text-left"><p class="text-sm font-bold text-gray-600">NAME</p><p class="mb-2 text-gray-800">${ssrInterpolate(user.value.name)}</p><p class="text-sm font-bold text-gray-600">EMAIL</p><p class="mb-2 text-gray-800">${ssrInterpolate(user.value.email)}</p><p class="text-sm font-bold text-gray-600">PHONE</p><p class="mb-2 text-gray-800">${ssrInterpolate(user.value.phone)}</p><p class="text-sm font-bold text-gray-600">USERTYPE</p><p class="text-gray-800">${ssrInterpolate(user.value.usertype)}</p></div></div></div><div class="w-1/2 p-6"><h2 class="mb-4 text-xl font-bold">CHANGE PASSWORD</h2><form><label class="block mb-2 text-sm font-bold text-gray-700">Old Password</label><input type="password" class="${ssrRenderClass([{ "bg-gray-100 cursor-not-allowed": !isEditing.value }, "w-full p-2 border rounded"])}"${ssrRenderAttr("value", password.value.oldPassword)}${ssrIncludeBooleanAttr(!isEditing.value) ? " disabled" : ""}><label class="block mt-4 mb-2 text-sm font-bold text-gray-700">New Password</label><input type="password" class="${ssrRenderClass([{ "bg-gray-100 cursor-not-allowed": !isEditing.value }, "w-full p-2 border rounded"])}"${ssrRenderAttr("value", password.value.newPassword)}${ssrIncludeBooleanAttr(!isEditing.value) ? " disabled" : ""}><label class="block mt-4 mb-2 text-sm font-bold text-gray-700">Confirm New Password</label><input type="password" class="${ssrRenderClass([{ "bg-gray-100 cursor-not-allowed": !isEditing.value }, "w-full p-2 border rounded"])}"${ssrRenderAttr("value", password.value.confirmNewPassword)}${ssrIncludeBooleanAttr(!isEditing.value) ? " disabled" : ""}><div class="flex mt-4 space-x-3"><button type="button" class="${ssrRenderClass([
        isEditing.value ? "bg-gray-600 hover:bg-gray-700" : "bg-yellow-500 hover:bg-yellow-600",
        "w-1/2 py-2 text-white rounded"
      ])}">${ssrInterpolate(isEditing.value ? "Cancel" : "Edit")}</button><button type="submit" class="${ssrRenderClass([
        isEditing.value ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed",
        "w-1/2 py-2 text-white rounded"
      ])}"${ssrIncludeBooleanAttr(!isEditing.value) ? " disabled" : ""}> Save Changes </button></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile_pages/edit_password_page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit_password_page-COofR1WS.mjs.map
