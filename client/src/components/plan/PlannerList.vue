<script setup>
import "@/assets/css/board.css";
import "@/assets/css/plan_list.css";
import { ref, onMounted, watch } from "vue";
import { Axios } from '@/util/http-commons.js';
import PlannerListItem from "@/components/plan/item/PlannerListItem.vue";


const http = Axios();
const loaded = ref(false);
const planners = ref([]);

onMounted(() => {
    getPlannerList();
})

const getPlannerList = async () => {
    http.get("/plan/list")
        .then((response) => {
            planners.value = response.data.data;
        })
        .catch()
}

watch(planners, (newValue, oldValue) => {
    if (newValue.length > 0) {
        loaded.value = true;
    }
})

</script>

<template>
    <div>
        <div v-if="loaded">
            <PlannerListItem :planners="planners" />
        </div>
    </div>
</template>

<style scoped></style>