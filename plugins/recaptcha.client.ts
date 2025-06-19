// plugins/recaptcha.client.ts
import { VueReCaptcha } from 'vue-recaptcha-v3';

export default defineNuxtPlugin((nuxtApp) => {
  // Ensure the runtime config is typed correctly
  const config = useRuntimeConfig();

  // Add a type assertion to tell TypeScript that recaptchaSiteKey will be a string.
  // This is safe because you are controlling the value in nuxt.config.ts.
  const siteKey = config.public.recaptchaSiteKey as string;

  // Check if siteKey is actually provided to prevent issues in case of misconfiguration
  if (!siteKey) {
    console.error("reCAPTCHA siteKey is not configured in runtimeConfig.public.recaptchaSiteKey.");
    return; // Do not proceed if site key is missing
  }

  // Pass the options directly to VueReCaptcha.
  // The 'siteKey' and 'loaderOptions' are expected as direct properties of the options object.
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: siteKey, // Use the typed siteKey
    loaderOptions: {
      autoHideBadge: true, // Set to true to hide the reCAPTCHA badge, but remember to disclose usage
    },
  });
});

