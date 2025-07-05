export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('my_auth_token')
  if (!token.value) {
    return navigateTo('/login')
  }
})
