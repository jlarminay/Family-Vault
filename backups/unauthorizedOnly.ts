export default defineNuxtRouteMiddleware((to, from) => {
  const { data } = useAuth();

  // must be unauthorized
  if (!!data.value) {
    // authorized
    // redirect to dashboard
    console.log('redirecting to dashboard');
    return navigateTo('/dashboard');
  }
});
