<script setup lang="ts">
import dayjs from 'dayjs';

const props = defineProps<{ initialState?: string }>();
const currentDisplay = ref('Privacy Policy');

watch(
  () => props.initialState,
  (value) => {
    checkInitialState();
  },
  { immediate: true },
);

function checkInitialState() {
  if (props.initialState) {
    currentDisplay.value = props.initialState;
  }
}
</script>

<template>
  <Modal ref="modal" class="tw_w-full" @beforeShow="checkInitialState">
    <template #title>{{ currentDisplay }}</template>
    <template #body>
      <div>
        <q-chip
          label="Privacy Policy"
          clickable
          @click="currentDisplay = 'Privacy Policy'"
          class="tw_transition tw_duration-300"
          :class="{ 'tw_bg-primary tw_text-white': currentDisplay === 'Privacy Policy' }"
        />
        <q-chip
          label="Terms and Conditions"
          clickable
          @click="currentDisplay = 'Terms and Conditions'"
          class="tw_transition tw_duration-300"
          :class="{ 'tw_bg-primary tw_text-white': currentDisplay === 'Terms and Conditions' }"
        />
        <q-chip
          label="Copyright"
          clickable
          @click="currentDisplay = 'Copyright'"
          class="tw_transition tw_duration-300"
          :class="{ 'tw_bg-primary tw_text-white': currentDisplay === 'Copyright' }"
        />
      </div>

      <div v-auto-animate>
        <!-- Privacy Policy -->
        <div v-if="currentDisplay === 'Privacy Policy'" class="markdown">
          <div>
            <h2 class="!tw_mt-4">Introduction</h2>
            <p>
              We are committed to protecting your privacy and ensuring that your personal
              information is handled in a safe and responsible manner. This Privacy Policy outlines
              how we collect, use, and protect your information.
            </p>
          </div>

          <div>
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

          <div>
            <h2>How We Use Your Information</h2>
            <p>
              We use your information to: - Provide and maintain our platform - Notify you about
              changes to our platform - Provide customer support - Monitor the usage of the platform
              - Detect, prevent, and address technical issues
            </p>
          </div>

          <div>
            <h2>Sharing Your Information</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside
              parties except to trusted third parties who assist us in operating our platform,
              conducting our business, or servicing you, so long as those parties agree to keep this
              information confidential.
            </p>
          </div>

          <div>
            <h2>Security of Your Information</h2>
            <p>
              We take reasonable steps to protect your personal information from unauthorized
              access, use, or disclosure. However, no method of transmission over the Internet, or
              method of electronic storage, is 100% secure. Therefore, we cannot guarantee its
              absolute security.
            </p>
          </div>

          <div>
            <h2>Your Data Protection Rights</h2>
            <p>Under Canadian law, you have the right to:</p>
            <ul>
              <li>Access: You can request copies of your personal data.</li>
              <li>
                Rectification: You can request that we correct any information you believe is
                inaccurate or complete information you believe is incomplete.
              </li>
              <li>
                Deletion: You can request that we delete your personal data, under certain
                conditions.
              </li>
              <li>
                Restriction of Processing: You can request that we restrict the processing of your
                personal data, under certain conditions.
              </li>
              <li>
                Objection to Processing: You can object to our processing of your personal data,
                under certain conditions.
              </li>
              <li>
                Data Portability: You can request that we transfer the data that we have collected
                to another organization, or directly to you, under certain conditions.
              </li>
            </ul>

            <p>
              If you make a request, we have one month to respond to you. If you would like to
              exercise any of these rights, please contact us at our email:
              <a href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a>.
            </p>
          </div>

          <div>
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              Our platform uses cookies and similar tracking technologies to track the activity on
              our platform and hold certain information. You can instruct your browser to refuse all
              cookies or to indicate when a cookie is being sent. However, if you do not accept
              cookies, you may not be able to use some portions of our platform.
            </p>
          </div>

          <div>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page.
            </p>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div v-if="currentDisplay === 'Terms and Conditions'" class="markdown">
          <div>
            <h2 class="!tw_mt-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this platform, you agree to comply with and be bound by these
              Terms and Conditions. If you do not agree to these terms, please do not use the
              service.
            </p>
          </div>

          <div>
            <h2>2. Invite-Only Access</h2>
            <p>
              This platform is invite-only. Access to the platform is restricted to users who have
              an accounts created by an admin. Sharing accounts with unauthorized users is
              prohibited and may result in the revocation of your access.
            </p>
          </div>

          <div>
            <h2>3. Login Access</h2>
            <p>
              Access to the platform is only available through OAuth services such as Discord,
              Google, and GitHub. Users must log in using one of these OAuth providers. By logging
              in through one of these services, you agree to comply with their respective terms of
              service and privacy policies.
            </p>
          </div>

          <div>
            <h2>4. User Conduct</h2>
            <p>
              You agree to use the platform in a manner that is lawful, relevant, and proper. You
              are responsible for all content you upload, share, or otherwise make available via the
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

          <div>
            <h2>5. Content Ownership</h2>
            <p>
              You retain all ownership rights to the content you upload. By uploading content, you
              grant the platform a non-exclusive, royalty-free license to use, display, and
              distribute your content solely for the purposes of operating and providing the
              service.
            </p>
          </div>

          <div>
            <h2>6. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the platform at any time,
              without prior notice, for any reason, including but not limited to a breach of these
              Terms and Conditions.
            </p>
          </div>

          <div>
            <h2>7. Content Deletion Requests</h2>
            <p>
              In accordance with Canadian law, users have the right to request the deletion of their
              personal content. If you wish to request the deletion of your content, please contact
              us at
              <a href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a> with the following
              information:
            </p>

            <ul>
              <li>Your full name</li>
              <li>Your email address</li>
              <li>A description of the content you wish to delete</li>
              <li>The reason for your deletion request</li>
            </ul>
          </div>

          <div>
            <h2>8. Disclaimers</h2>
            <p>
              The platform is provided "as is" and "as available" without warranties of any kind,
              either express or implied. We do not warrant that the service will be uninterrupted,
              secure, or error-free.
            </p>
          </div>

          <div>
            <h2>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, the platform and its affiliates
              will not be liable for any indirect, incidental, special, consequential, or punitive
              damages, or any loss of profits or revenues, whether incurred directly or indirectly,
              or any loss of data, use, goodwill, or other intangible losses, resulting from your
              use of the platform.
            </p>
          </div>

          <div>
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. We will provide
              notice of such changes by posting the updated terms on the platform. Your continued
              use of the platform after any such changes constitutes your acceptance of the new
              Terms and Conditions.
            </p>
          </div>

          <div>
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at
              <a href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a>.
            </p>
          </div>
        </div>

        <!-- Copyright -->
        <div v-if="currentDisplay === 'Copyright'" class="markdown">
          <p class="tw_mt-4">
            © 2023-{{ dayjs().format('YYYY') }} Josh Larminay. All Rights Reserved.
          </p>
          <p>
            This website and its content are protected by Canadian copyright law. Except as
            otherwise provided for under Canadian copyright law, this website and its content may
            not be copied, published, distributed, downloaded or otherwise stored in a retrieval
            system, transmitted or converted, in any form or by any means, electronic or otherwise,
            without the prior written permission of the copyright owner.
          </p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
