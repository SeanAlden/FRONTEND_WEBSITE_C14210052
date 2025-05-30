import { c as useRuntimeConfig } from './server.mjs';

const useApi = (endpoint) => {
  const config = useRuntimeConfig();
  return `${config.public.apiBase}${endpoint}`;
};

export { useApi as u };
//# sourceMappingURL=useApi-Dqh0F_3-.mjs.map
