import { f as defineNuxtRouteMiddleware, e as useCookie, n as navigateTo } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue/server-renderer';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import 'consola/core';
import 'axios';

const guest = defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("my_auth_token");
  if (token.value) {
    return navigateTo("/");
  }
});

export { guest as default };
//# sourceMappingURL=guest-BBK5-Lhc.mjs.map
