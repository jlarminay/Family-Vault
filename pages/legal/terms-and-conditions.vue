<script setup lang="ts"></script>

<template>
  <Head>
    <Head>
      <title>Terms and Conditions | Legal | Larminay Vault</title>
    </Head>
  </Head>

  <NuxtLayout name="legal">
    <template #title>Terms and Conditions</template>
    <template #default>
      <div class="markdown">
        <div id="acceptance-of-terms">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this platform, you agree to comply with and be bound by these
            Terms and Conditions. If you do not agree to these terms, please do not use the service.
          </p>
        </div>

        <div id="invite-only-access">
          <h2>2. Invite-Only Access</h2>
          <p>
            This platform is invite-only. Access to the platform is restricted to users who have an
            accounts created by an admin. Sharing accounts with unauthorized users is prohibited and
            may result in the revocation of your access.
          </p>
        </div>

        <div id="login-access">
          <h2>3. Login Access</h2>
          <p>
            Access to the platform is only available through OAuth services such as Discord, Google,
            and GitHub. Users must log in using one of these OAuth providers. By logging in through
            one of these services, you agree to comply with their respective terms of service and
            privacy policies.
          </p>
        </div>

        <div id="user-conduct">
          <h2>4. User Conduct</h2>
          <p>
            You agree to use the platform in a manner that is lawful, relevant, and proper. You are
            responsible for all content you upload, share, or otherwise make available via the
            platform. Prohibited activities include, but are not limited to:
          </p>

          <ul>
            <li>
              Uploading content that is illegal, offensive, or infringes on the rights of others.
            </li>
            <li>Sharing your access credentials with unauthorized users.</li>
            <li>
              Using the platform for any form of commercial solicitation without prior permission.
            </li>
          </ul>
        </div>

        <div id="content-ownership">
          <h2>5. Content Ownership</h2>
          <p>
            You retain all ownership rights to the content you upload. By uploading content, you
            grant the platform a non-exclusive, royalty-free license to use, display, and distribute
            your content solely for the purposes of operating and providing the service.
          </p>
        </div>

        <div id="termination">
          <h2>6. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to the platform at any time,
            without prior notice, for any reason, including but not limited to a breach of these
            Terms and Conditions.
          </p>
        </div>

        <div id="content-deletion-requests">
          <h2>7. Content Deletion Requests</h2>
          <p>
            In accordance with Canadian law, users have the right to request the deletion of their
            personal content. If you wish to request the deletion of your content, please contact us
            at <a href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a> with the following
            information:
          </p>

          <ul>
            <li>Your full name</li>
            <li>Your email address</li>
            <li>A description of the content you wish to delete</li>
            <li>The reason for your deletion request</li>
          </ul>
        </div>

        <div id="disclaimers">
          <h2>8. Disclaimers</h2>
          <p>
            The platform is provided "as is" and "as available" without warranties of any kind,
            either express or implied. We do not warrant that the service will be uninterrupted,
            secure, or error-free.
          </p>
        </div>

        <div id="limitation-of-liability">
          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, the platform and its affiliates will
            not be liable for any indirect, incidental, special, consequential, or punitive damages,
            or any loss of profits or revenues, whether incurred directly or indirectly, or any loss
            of data, use, goodwill, or other intangible losses, resulting from your use of the
            platform.
          </p>
        </div>

        <div id="changes-to-terms">
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. We will provide
            notice of such changes by posting the updated terms on the platform. Your continued use
            of the platform after any such changes constitutes your acceptance of the new Terms and
            Conditions.
          </p>
        </div>

        <div id="contact-us">
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at
            <a href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a>.
          </p>
        </div>
      </div>
    </template>
    <template #right-column>
      <ul>
        <li
          v-for="(item, i) in [
            { label: 'Acceptance of Terms', key: 'acceptance-of-terms' },
            { label: 'Invite-Only Access', key: 'invite-only-access' },
            { label: 'Login Access', key: 'login-access' },
            { label: 'User Conduct', key: 'user-conduct' },
            { label: 'Content Ownership', key: 'content-ownership' },
            { label: 'Termination', key: 'termination' },
            { label: 'Content Deletion Requests', key: 'content-deletion-requests' },
            { label: 'Disclaimers', key: 'disclaimers' },
            { label: 'Limitation of Liability', key: 'limitation-of-liability' },
            { label: 'Changes to Terms', key: 'changes-to-terms' },
            { label: 'Contact Us', key: 'contact-us' },
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
