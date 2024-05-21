<script setup>
import { watch } from "vue";
import store from "@/stores";
import { storeToRefs } from 'pinia';

const trackStore = store.useTrackStore();
const playlistStore = store.usePlaylistStore();

const emit=defineEmits(["addTrack"])
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

const addTrack = () => {
  // playlistStore.addtracks(props.uri);
  // trackStore.addTrack(props.uri);
  emit.addTrack()
};

</script>
<template>
  <div class="track-addition">
    <button
      @click="addTrack"
      class="track-addition__button"
      title="Save to your library"
    >
      추가
      <!-- <icon name="plus" /> -->
    </button>

  </div>
</template>

<style></style>
