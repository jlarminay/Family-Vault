export default function () {
  return (
    useRuntimeConfig().public.environment === 'dev'
    // useRuntimeConfig().public.environment === 'testing'
  );
}
