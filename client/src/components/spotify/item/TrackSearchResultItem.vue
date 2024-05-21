<script setup>
import { defineProps } from "vue";
import store from "@/stores";

// import TrackAddition from "@/components/TrackAddition.vue";
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
  <div class="d-flex m-2 align-items-center" style="cursor: pointer">
    <img :src="track.albumUrl" style="height: 64px; width: 64px" />
    <div class="ml-3">
      <div>{{ track.title }}</div>
      <div class="text-muted">{{ track.artist }}</div>
    </div>
    <!-- <TrackAddition :trackID="track.id" :uri="track.uri" /> -->
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