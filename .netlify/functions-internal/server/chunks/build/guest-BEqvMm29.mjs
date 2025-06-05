import { u as useSanctum } from './useSanctum-B_WYBasA.mjs';
import { f as defineNuxtRouteMiddleware, g as useSanctumOptions, n as navigateTo, h as createError } from './server.mjs';
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
import 'mitt';
import 'axios';

const guest = defineNuxtRouteMiddleware(async (to, _from) => {
  const { isLoggedIn } = useSanctum();
  const { redirect } = useSanctumOptions();
  if (!isLoggedIn.value) return;
  const { enableIntendedRedirect, guestOnlyRedirect } = redirect;
  if (enableIntendedRedirect) {
    const currentPath = to.path;
    const requestedRoute = to.query.redirect;
    if (requestedRoute && requestedRoute !== currentPath) {
      return navigateTo(requestedRoute);
    }
  }
  if (guestOnlyRedirect) {
    return navigateTo(guestOnlyRedirect, { replace: true });
  }
  throw createError({ statusCode: 403 });
});

export { guest as default };
//# sourceMappingURL=guest-BEqvMm29.mjs.map
