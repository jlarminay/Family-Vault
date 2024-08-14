export default defineEventHandler(async (event) => {
  return;

  // const ip = event.node.req.headers['x-forwarded-for'] || event.node.req.connection.remoteAddress;
  // const method = event.node.req.method;
  // const url = getRequestURL(event).pathname;
  // const body = method === 'POST' || method === 'PUT' ? await readBody(event) : null;

  // // get user
  // const cookies = event.node.req.headers['cookie']?.split(';').map((c) => c.trim()) || [];
  // const token = cookies.find((c) => c.includes('csrf-token'))?.split('=')[1];

  // // ignore all auth requests
  // if (url.includes('/api/auth')) {
  //   return;
  // }

  // // ignore all GET requests
  // // if (method === 'GET') {
  // //   return;
  // // }

  // console.log('-------------------------------');

  // console.log('token', token);

  // console.log({
  //   ip,
  //   method,
  //   url,
  //   body,
  // });
});
