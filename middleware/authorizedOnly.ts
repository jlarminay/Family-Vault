export default defineNuxtRouteMiddleware((to, from) => {
  const { data } = useAuth();

  // must be authorized
  if (!data.value) {
    // not authorized
    // redirect to login
    return navigateTo('/login');
  }
});
