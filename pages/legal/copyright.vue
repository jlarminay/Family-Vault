<script setup lang="ts"></script>

<template>
  <Head>
    <title>Dashboard | Larminay Vault</title>
  </Head>

  <NuxtLayout name="legal">
    <template #default>
      <div class="markdown">
        <h1 id="copyright">Copyright</h1>

        <p>Copyright © 2024 Josh Larminay</p>

        <p>
          This website and its content are protected by Canadian copyright law. Except as otherwise
          provided for under Canadian copyright law, this website and its content may not be copied,
          published, distributed, downloaded or otherwise stored in a retrieval system, transmitted
          or converted, in any form or by any means, electronic or otherwise, without the prior
          written permission of the copyright owner.
        </p>
      </div>
    </template>
    <template #right-column>
      <a href="#copyright" class="link">Copyright</a>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
