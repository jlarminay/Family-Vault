import fetch from 'node-fetch';

export default {
  discord: async (opts: { video: any; user: any; report: string }) => {
    const env = useRuntimeConfig() as any;
    const { video, user, report } = opts;

    const url = new URL(env.webhook.discordUrl);

    let content = '';
    content += `Received report on "[${video.title}](${env.public.baseUrl}/video/${video.id})" from "${user.name}".`;
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
