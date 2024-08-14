<script setup lang="ts">
import dayjs from 'dayjs';
import parser from 'ua-parser-js';

definePageMeta({
  middleware: 'admin-authorized-only',
});

const adminStore = useAdminStore();
const allLogs = ref(await adminStore.systemLogsRead());

const cleanedLogs = computed(
  (): {
    id: number;
    createdAt: string;
    user: {
      id: number;
      name: string;
    } | null;
    ip: string;
    route: string;
    method: string;
    responseSize: number;
    requestBody: JSON;
    userAgent: {
      browser: string;
      os: string;
    };
  }[] => {
    return allLogs.value.map((log: any) => {
      const parsedUA = parser(log.userAgent);
      return {
        ...log,
        userAgent: {
          browser: `${parsedUA.browser.name} ${parsedUA.browser.version}`,
          os: `${parsedUA.os.name} ${parsedUA.os.version}`,
        },
      };
    });
  },
);
</script>

<template>
  <Head>
    <title>System Logs | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="System Logs" />

      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { label: 'Method', name: 'method', field: 'method', sortable: true, align: 'left' },
            { label: 'Route', name: 'route', field: 'route', sortable: true, align: 'left' },
            {
              label: 'User',
              name: 'user',
              field: 'user',
              sortable: true,
              align: 'left',
            },
            {
              label: 'DateTime',
              name: 'createdAt',
              field: 'createdAt',
              sortable: true,
              align: 'left',
            },
          ]"
          :rows="cleanedLogs"
          :wrap-cells="true"
          :rows-per-page-options="[25, 50, 100, 0]"
        >
          <template #header="props">
            <q-tr :props="props">
              <q-th auto-width />

              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  round
                  flat
                  dense
                  color="primary"
                  icon="expand_more"
                  class="tw_rotate-[-90deg] tw_transition-transform"
                  :class="{ '!tw_rotate-[0deg]': props.expand }"
                  @click="props.expand = !props.expand"
                />
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <!-- method -->
                <div v-if="col.name == 'method'">
                  <span
                    :class="{
                      'tw_text-red-500': col.value == 'DELETE',
                      'tw_text-blue-500': col.value == 'POST',
                    }"
                  >
                    {{ col.value }}
                  </span>
                </div>
                <div v-else-if="col.name == 'user'">
                  <span :class="{ 'tw_text-red': col.value == 'DELETE' }">
                    {{ col.value?.name || '-' }}
                  </span>
                </div>
                <div v-else-if="col.name == 'createdAt'">
                  <span :class="{ 'tw_text-red': col.value == 'DELETE' }">
                    {{ dayjs(col.value).format('YYYY-MM-DD HH:mm:ss.SSS') }}
                  </span>
                </div>
                <!-- else -->
                <div v-else>
                  {{ col.value }}
                </div>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="tw_flex tw_gap-4 tw_px-5 tw_py-2">
                  <div class="tw_min-w-[300px]">
                    <ul>
                      <li><b>Event ID</b>: {{ props.row.id }}</li>
                      <li><b>Method</b>: {{ props.row.method }}</li>
                      <li><b>Route</b>: {{ props.row.route }}</li>
                      <hr class="tw_my-2" />
                      <li><b>IP</b>: {{ props.row.ip }}</li>
                      <li><b>User ID</b>: {{ props.row.user?.id || '-' }}</li>
                      <li><b>User</b>: {{ props.row.user?.name || '-' }}</li>
                      <li><b>Browser</b>: {{ props.row.userAgent.browser }}</li>
                      <li><b>OS</b>: {{ props.row.userAgent.os }}</li>
                      <hr class="tw_my-2" />
                      <li><b>Created At</b>: {{ props.row.createdAt }}</li>
                    </ul>
                  </div>
                  <div class="tw_grow">
                    <b>Request Body</b>
                    <pre
                      class="tw_w-full tw_whitespace-pre-wrap tw_box-border tw_overflow-auto tw_mb-6 tw_mt-2 tw_rounded tw_border tw_bg-white tw_p-6 tw_px-4 tw_py-2"
                      >{{ props.row.requestBody }}</pre
                    >
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>

          <template #no-data>
            <p class="tw_w-full tw_p-6 tw_text-center">No Data Found</p>
          </template>
        </q-table>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
