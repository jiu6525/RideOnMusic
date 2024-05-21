<script setup>
const { VITE_AUTH_URL } = import.meta.env;
const { VITE_NODE_EXPRESS_URI } = import.meta.env.VITE_NODE_EXPRESS_URI

</script>

<template>
  <div>
    {{ VITE_NODE_EXPRESS_URI }}
    <a :href="VITE_AUTH_URL" >Login</a>
  </div>
</template>
<style scoped>

</style>