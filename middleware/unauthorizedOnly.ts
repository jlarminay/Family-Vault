export default defineNuxtRouteMiddleware((to, from) => {
  const { data: authData } = useAuth();

  // must be unauthorized
  if (!!authData.value) {
    // authorized
    // redirect to dashboard
    return navigateTo('/dashboard');
  }
});
