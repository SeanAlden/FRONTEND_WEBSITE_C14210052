export const useApi = (endpoint: string) => {
  const config = useRuntimeConfig();
  return `${config.public.apiBase}${endpoint}`;
};
