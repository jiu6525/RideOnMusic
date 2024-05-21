<script setup>
import { watch } from "vue";
import store from "@/stores";
import { storeToRefs } from "pinia";
const emit = defineEmits(["add-track"]);
const props = defineProps({
  trackID: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    default: "",
  },
});
const addTracke = () => {
  emit("add-track");
};
</script>
<template>
  <div class="track-addition" style="width: 40px">
    <i
      class="bi bi-plus-circle"
      style="font-size: 2rem"
      @click="addTracke"
      title="Save to your library"
    ></i>
  </div>
</template>

<style></style>