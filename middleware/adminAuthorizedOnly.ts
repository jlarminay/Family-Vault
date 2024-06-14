export default defineNuxtRouteMiddleware((to, from) => {
  const { data: authData } = useAuth();

  // must be authorized
  if (!authData.value || authData.value.role !== 'admin') {
    // not authorized or admin
    // redirect to login
    return navigateTo('/login');
  }
});
