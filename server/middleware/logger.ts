export default defineEventHandler(async (event) => {
  const session = event.context; // Adjust based on your session management
  console.log('session', session);
  const user = session?.user || 'unknown';
  console.log('user', user);

  const ip = event.node.req.headers['x-forwarded-for'] || event.node.req.connection.remoteAddress;
  const method = event.node.req.method;
  const url = getRequestURL(event).pathname;
  const body = method === 'POST' || method === 'PUT' ? await readBody(event) : null;

  // ignore all auth requests
  if (url.includes('/api/auth')) {
    return;
  }

  // ignore all GET requests
  // if (method === 'GET') {
  //   return;
  // }

  console.log('-------------------------------');
  console.log({
    ip,
    method,
    url,
    body,
    user,
  });
});
