import { f as defineNuxtRouteMiddleware, e as useCookie, n as navigateTo } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'requrl';
import 'consola/core';
import 'mitt';
import 'vue/server-renderer';
import 'axios';

const guest = defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("my_auth_token");
  if (token.value) {
    return navigateTo("/");
  }
});

export { guest as default };
//# sourceMappingURL=guest-Cch3DRyu.mjs.map
