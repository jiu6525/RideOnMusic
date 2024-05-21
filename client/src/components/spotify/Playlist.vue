<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";

import TrackItem from "@/components/spotify/item/PlaylistTrackItem.vue";
import store from "@/stores";

const trackStore = store.useTrackStore();
const playlistStore = store.usePlaylistStore();
const {savedTracks}=storeToRefs(trackStore)
// const props = defineProps(["tracks"]);

// const tracksUris = computed(() => {
//   return props.tracks ? props.tracks.map((el) => el.uri) : [];
// });


onMounted(() => {
});
</script>

<template>
  <div
    id="play-list-container"
    class="play-list-container d-flex flex-column" 
  >        
    <div class="card" >
      <draggable
        class="dragArea list-group"
        :list="savedTracks"
        :group="{ name: 'tracks', put: true, pull: true }"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="list-group-item">
            <TrackItem
                    :key="element.id"
                    :track="element"
                    searchEl="true"
                  />
          </div>
        </template>
      </draggable>          
    </div>
  </div>
</template>

<style scoped>

</style>