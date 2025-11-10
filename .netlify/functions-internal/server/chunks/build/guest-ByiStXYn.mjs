import { u as useSanctum } from './useSanctum-DOfAadcy.mjs';
import { e as defineNuxtRouteMiddleware, f as useSanctumOptions, n as navigateTo, g as createError } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
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
//# sourceMappingURL=guest-ByiStXYn.mjs.map
