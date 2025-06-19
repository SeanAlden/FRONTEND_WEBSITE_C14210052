import { u as useSanctum } from './useSanctum-BSQTs61w.mjs';
import { f as defineNuxtRouteMiddleware, g as useSanctumOptions, n as navigateTo, h as createError } from './server.mjs';
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

const auth = defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useSanctum();
  if (isLoggedIn.value) {
    return;
  }
  const options = useSanctumOptions();
  const loginPath = options.redirect.loginPath;
  if (!isLoggedIn.value && loginPath) {
    const redirect = { path: loginPath };
    if (options.redirect.enableIntendedRedirect) {
      redirect.query = { redirect: to.fullPath };
    }
    return navigateTo(redirect, { replace: true });
  }
  throw createError({ statusCode: 403 });
});

export { auth as default };
//# sourceMappingURL=auth-BN0DVmkv.mjs.map
