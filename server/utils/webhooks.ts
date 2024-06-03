import fetch from 'node-fetch';

export default {
  discord: async (opts: { video: any; user: any; report: string }) => {
    const env = useRuntimeConfig() as any;
    const { video, user, report } = opts;

    const urlProtocol = env.public.environment === 'dev' ? 'http://' : 'https://';
    const videoUrl = `${urlProtocol}${env.public.baseUrl}/video/${video.id}`;

    let content = '';
    content += `Received report on "[${video.title}](${videoUrl})" from "${user.name}".`;
    content += `\n> ${report.trim().split('\n').join('\n> ')} `;

    try {
      await fetch(env.webhook.discordUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Larminay Vault | Report Bot',
          // avatar_url: `${env.public.baseUrl}/_nuxt/logo/logo.png`,
          content: content,
        }),
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};
