import { ref } from "vue";
import { defineStore } from "pinia";
const { VITE_NODE_EXPRESS_URI } = import.meta.env
export const useTrackStore = defineStore(
  "track",
  () => {
    const lastSavedTrack = ref("");
    const lastRemovedTrack = ref("");
    const savedTracks = ref([]);

    const addTrack = (track) => {
      lastSavedTrack.value = track;
      lastRemovedTrack.value = "";
      savedTracks.value.push(track); //id
      console.log("Added track")
      console.log(savedTracks.value);
    };
    const removeTrack = (track) => {
      lastRemovedTrack.value = track;
      lastSavedTrack.value = "";
    };
    return {
      lastSavedTrack,
      lastRemovedTrack,
      savedTracks,
      addTrack,
      removeTrack,
    };
  },
  {
    persist: true,
  }
);
