<script setup>
import { computed } from "vue";
const props = defineProps(["track", "searchEl"]);
const removeTrack = async () => {
  try {
    // await emit("savedTrackRemove", props.trackID);
  } catch (e) {
    console.log(e);
  }
};
const computedTrack = computed(() => {
  if (props.track.track) {
    return props.track.track;
  } else return props.track;
});
</script>

<template>
  <div id="result-item-container" class="w-100">
    <div class="row align-itmes-center">
      <div class="col-8">
        <div>
          <h5>{{ searchEl ? computedTrack.title : computedTrack.name }}</h5>
        </div>
        <div class="pl-2 pr-1" style="text-align: left">
          <!-- <span
          class="pr-1 fs-6 row"
          v-for="(artist, index) in track.track.artists.slice(0, 2)"
          :key="artist.id"
        > -->
          <span>
            {{ searchEl ? computedTrack.artist : computedTrack.artists[0].name }}
            <!-- <template v-if="index !== track.track.artists.length - 1"> ,&nbsp; </template> -->
          </span>
        </div>
      </div>
      <div class="col-4 p-0 m-0 pr-2 right-0">
        <img
          class="rounded img-fluid width-100"
          :src="searchEl ? computedTrack.albumUrl : computedTrack.album.images[2].url"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#result-item-container {
  height: 90px;
  padding: 15px;
  border: 1px solid rgba(33, 33, 53, 0.125);
  background-color: #fff;
  border-radius: 20px;
  margin: 5px;
  margin-left: 0px;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
#result-item-container:hover {
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  background-color: rgba(0, 0, 0, 0.085);
  transform-origin: center !important;
  transform: scale(1.02);
  margin-top: 10px;
  margin-bottom: 10px;
}
.rad {
  border-radius: 100%;
}
.btn-primary-standard-n {
  border: none;
  color: rgba(3, 149, 165, 1) !important;
  background-color: transparent;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.btn-primary-standard-n:hover {
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  color: rgba(2, 87, 140, 1) !important;
  transform: scale(1.1);
}
.btn-gray {
  border: none;
  color: rgb(90, 90, 90) !important;
  background-color: transparent;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.btn-gray:hover {
  color: rgb(50, 50, 50) !important;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  transform: scale(1.1);
}
.bold-border-gray {
  stroke: rgba(90, 90, 90, 1) !important;
  stroke-width: 0.15px;
}
.bold-border-gray:hover {
  stroke: rgba(50, 50, 50, 1) !important;
}
.bold-border {
  stroke: rgba(3, 149, 165, 1) !important;
  stroke-width: 0.15px;
}
.bold-border:hover {
  stroke: rgba(2, 87, 140, 1) !important;
}
:deep(.card-body) {
  width: 100%;
  padding: 0px;
}
:deep(span, h5) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>