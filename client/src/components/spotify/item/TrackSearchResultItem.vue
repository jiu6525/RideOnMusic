<script setup>
import { defineProps } from "vue";
import store from "@/stores";

import TrackAddition from "@/components/spotify/TrackAddition.vue";

const trackStore = store.useTrackStore();

const props = defineProps({
  track: Object,
  chooseTrack: Function,
});

const addTrack = () => {
  // playlistStore.addtracks(track);
  trackStore.addTrack(props.track);
};
</script>

<template>
  <div class="d-flex align-items-center" style="cursor: pointer; height: 200px">
    <img :src="track.albumUrl" style="height: 64px; width: 64px" class="col" />
    <div class="ml-3 col-8 textClass">
      <div>{{ track.title }}</div>
      <div class="text-muted textClass">{{ track.artist }}</div>
    </div>
    <TrackAddition @add-track="addTrack" class="col" />
  </div>
</template>

<style scoped>
.textClass {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
