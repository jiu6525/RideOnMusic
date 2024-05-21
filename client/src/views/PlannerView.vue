<script setup>
import { ref, onMounted } from "vue";
import { Axios } from "@/util/http-commons";
import { useRouter } from "vue-router";
const router = useRouter();
const http = Axios();

</script>

<template>
    <div>
        <!-- <router-vue></router-vue> -->
        <RouterView />
    </div>
</template>

<style scoped></style>