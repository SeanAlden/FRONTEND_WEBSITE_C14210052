export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('my_auth_token')
  if (token.value) {
    // Jika sudah login, arahkan ke halaman utama/dashboard
    return navigateTo('/')
  }
})