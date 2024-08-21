<script setup lang="ts"></script>

<template>
  <Head>
    <title>Dashboard | Larminay Vault</title>
  </Head>

  <NuxtLayout name="legal">
    <template #default>
      <div class="markdown">
        <h1>Privacy Policy</h1>

        <div id="introduction">
          <h2>Introduction</h2>
          <p>
            We are committed to protecting your privacy and ensuring that your personal information
            is handled in a safe and responsible manner. This Privacy Policy outlines how we
            collect, use, and protect your information.
          </p>
        </div>

        <div id="information-we-collect">
          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>
            When your account is created by an admin, we may collect the following personal
            information: - Full name - Email address - OAuth provider ID (e.g., Discord, Google,
            GitHub)
          </p>

          <h3>Usage Data</h3>
          <p>
            We may collect information on how you access and use the platform, including: - IP
            address - Browser type and version - Pages visited - Time and date of visits - Time
            spent on pages
          </p>
        </div>

        <div id="how-we-use-your-information">
          <h2>How We Use Your Information</h2>
          <p>
            We use your information to: - Provide and maintain our platform - Notify you about
            changes to our platform - Provide customer support - Monitor the usage of the platform -
            Detect, prevent, and address technical issues
          </p>
        </div>

        <div id="sharing-your-information">
          <h2>Sharing Your Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside
            parties except to trusted third parties who assist us in operating our platform,
            conducting our business, or servicing you, so long as those parties agree to keep this
            information confidential.
          </p>
        </div>

        <div id="security-of-your-information">
          <h2>Security of Your Information</h2>
          <p>
            We take reasonable steps to protect your personal information from unauthorized access,
            use, or disclosure. However, no method of transmission over the Internet, or method of
            electronic storage, is 100% secure. Therefore, we cannot guarantee its absolute
            security.
          </p>
        </div>

        <div id="your-data-protection-rights">
          <h2>Your Data Protection Rights</h2>
          <p>Under Canadian law, you have the right to:</p>
          <ul>
            <li>Access: You can request copies of your personal data.</li>
            <li>
              Rectification: You can request that we correct any information you believe is
              inaccurate or complete information you believe is incomplete.
            </li>
            <li>
              Deletion: You can request that we delete your personal data, under certain conditions.
            </li>
            <li>
              Restriction of Processing: You can request that we restrict the processing of your
              personal data, under certain conditions.
            </li>
            <li>
              Objection to Processing: You can object to our processing of your personal data, under
              certain conditions.
            </li>
            <li>
              Data Portability: You can request that we transfer the data that we have collected to
              another organization, or directly to you, under certain conditions.
            </li>
          </ul>

          <p>
            If you make a request, we have one month to respond to you. If you would like to
            exercise any of these rights, please contact us at our email:
            <a href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a>.
          </p>
        </div>

        <div id="cookies-and-tracking-technologies">
          <h2>Cookies and Tracking Technologies</h2>
          <p>
            Our platform uses cookies and similar tracking technologies to track the activity on our
            platform and hold certain information. You can instruct your browser to refuse all
            cookies or to indicate when a cookie is being sent. However, if you do not accept
            cookies, you may not be able to use some portions of our platform.
          </p>
        </div>

        <div id="changes-to-this-privacy-policy">
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page.
          </p>
        </div>
      </div>
    </template>
    <template #right-column>
      <ul>
        <li
          v-for="(item, i) in [
            { label: 'Introduction', key: 'introduction' },
            { label: 'Information We Collect', key: 'information-we-collect' },
            { label: 'How We Use Your Information', key: 'how-we-use-your-information' },
            { label: 'Sharing Your Information', key: 'sharing-your-information' },
            { label: 'Security of Your Information', key: 'security-of-your-information' },
            { label: 'Your Data Protection Rights', key: 'your-data-protection-rights' },
            {
              label: 'Cookies and Tracking Technologies',
              key: 'cookies-and-tracking-technologies',
            },
            { label: 'Changes to This Privacy Policy', key: 'changes-to-this-privacy-policy' },
          ]"
          :key="i"
        >
          <a :href="`#${item.key}`" class="link tw_inline-block tw_mb-2 tw_leading-tight">
            {{ item.label }}
          </a>
        </li>
      </ul>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
