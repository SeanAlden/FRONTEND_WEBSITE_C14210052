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

const auth = defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("my_auth_token");
  if (!token.value) {
    return navigateTo("/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-YZHYmu_7.mjs.map
