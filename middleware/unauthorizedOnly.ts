export default defineNuxtRouteMiddleware((to, from) => {
  const { data } = useAuth();

  // must be unauthorized
  if (!!data.value) {
    // authorized
    // redirect to dashboard
    return navigateTo('/dashboard');
  }
});
