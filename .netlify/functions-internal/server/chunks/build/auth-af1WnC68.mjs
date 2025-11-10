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
//# sourceMappingURL=auth-af1WnC68.mjs.map
