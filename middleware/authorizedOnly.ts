export default defineNuxtRouteMiddleware((to, from) => {
  const { data: authData } = useAuth();

  // must be authorized
  if (!authData.value) {
    // not authorized
    // redirect to login
    return navigateTo('/login');
  }
});
