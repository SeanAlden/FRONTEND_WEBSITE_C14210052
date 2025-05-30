import { computed } from 'vue';
import { a as useNuxtApp, g as useSanctumOptions, l as useCurrentUser, m as useTokenStorage, o as useRoute, n as navigateTo, p as extractNestedValue, q as getAuthUser, j as createLogger, k as createFetchService } from './server.mjs';

const useSanctumFetch = (request, options) => {
  const { logLevel } = useSanctumOptions();
  const logger = createLogger(logLevel);
  const { onRequest, onResponseError, ...otherOptions } = options || {};
  const fetchServiceOptions = {
    ...onRequest ? { onRequest } : {},
    ...onResponseError ? { onResponseError } : {}
  };
  const fetchService = createFetchService(fetchServiceOptions, logger);
  return fetchService(request, otherOptions);
};
const useSanctum = () => {
  const nuxtApp = useNuxtApp();
  const options = useSanctumOptions();
  const user = useCurrentUser();
  const isLoggedIn = computed(() => {
    return user.value !== null;
  });
  async function refreshUser() {
    try {
      user.value = await getAuthUser(useNuxtApp().$sanctumFetch);
    } catch (error) {
      user.value = null;
      console.debug(error);
    }
  }
  async function login(credentials, clientOptions = {}, callback) {
    const { redirect, authMode, sanctumEndpoints } = options;
    const currentRoute = useRoute();
    if (isLoggedIn.value) {
      if (!redirect.redirectToAfterLogin || redirect.redirectToAfterLogin === currentRoute.path) {
        return;
      }
      return await navigateTo(redirect.redirectToAfterLogin);
    }
    const fetchResponse = await useSanctumFetch(
      sanctumEndpoints.login,
      {
        method: "post",
        body: credentials,
        ...clientOptions
      }
    );
    if (authMode === "token") {
      const { token } = options;
      const tokenValue = extractNestedValue(
        fetchResponse,
        token.responseKey
      );
      await useTokenStorage(nuxtApp).set(tokenValue);
    }
    await refreshUser();
    if (callback) {
      return callback(fetchResponse, user.value);
    }
    if (redirect.enableIntendedRedirect) {
      const requestedRoute = currentRoute.query.redirect;
      if (requestedRoute && requestedRoute !== currentRoute.path) {
        return await navigateTo(requestedRoute);
      }
    }
    if (!redirect.redirectToAfterLogin || currentRoute.path === redirect.redirectToAfterLogin) {
      return;
    }
    return await navigateTo(redirect.redirectToAfterLogin);
  }
  async function logout(callback) {
    if (!isLoggedIn.value) {
      return;
    }
    await useSanctumFetch(options.sanctumEndpoints.logout, { method: "post" });
    user.value = null;
    if (options.authMode === "token") {
      await useTokenStorage(nuxtApp).set(void 0);
    }
    if (callback) {
      return callback();
    }
    const currentPath = useRoute().path;
    if (!options.redirect.redirectToAfterLogout || currentPath === options.redirect.redirectToAfterLogout) {
      return;
    }
    await navigateTo(options.redirect.redirectToAfterLogout);
  }
  return {
    options,
    user,
    isLoggedIn,
    refreshUser,
    login,
    logout
  };
};

export { useSanctum as u };
//# sourceMappingURL=useSanctum-B_WYBasA.mjs.map
