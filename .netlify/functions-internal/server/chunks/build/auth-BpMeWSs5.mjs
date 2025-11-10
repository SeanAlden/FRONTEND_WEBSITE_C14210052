import { e as defineNuxtRouteMiddleware, u as useCookie, n as navigateTo } from './server.mjs';
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

const auth = defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("my_auth_token");
  if (!token.value) {
    return navigateTo("/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-BpMeWSs5.mjs.map
