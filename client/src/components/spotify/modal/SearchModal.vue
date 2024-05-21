<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import axios from "axios";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import store from "@/stores";
import TrackSearchResult from "@/components/spotify/item/TrackSearchResultItem.vue";
const tokenStore = store.useTokenStore();
// const searchStore = store.useSearchStore();
const searchResults = ref([]);
const limit = 10;
const searchword = ref("");
let page = 1;
const noResult = ref(false);
const message = ref("");
// 노래 검색
const search = async ($state) => {
  // console.log("searchTracks"+page.value)
  if (!searchword.value.trim()) return;
  axios
    .post("http://localhost:5174/spotify/search", {
      accessToken: tokenStore.accessToken,
      keyword: searchword.value,
      offset: page * limit,
    })
    .then((res) => {
      if (res.data.tracks.items < 10) $state.complete();
      else {
        searchResults.value.push(
          ...res.data.tracks.items.map((track) => ({
            artist: track.artists[0].name,
            title: track.name,
            id: track.id,
            uri: track.uri,
            albumUrl: track.album.images.reduce((smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            }, track.album.images[0]).url,
          }))
        );
        // $state.loaded();
      }
      page++;
    })
    .catch((error) => {
      console.log(error);
      $state.error();
    });
};
watch(searchword, async (newSearch) => {
  if (newSearch) {
    try {
      searchResults.value = [];
      page = 0;
      search();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  } else {
    searchResults.value = [];
  }
});
onMounted(() => {});
</script>

<template>
  <!-- Button trigger modal -->
  <button
    size="md"
    id="btn-save"
    class="btn btn-outline-primary bg-light w-auto"
    data-bs-toggle="modal"
    data-bs-target="#searchModal"
  >
    노래 추가하기
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="searchModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <input
            class="form-control w-50"
            type="search"
            placeholder="Search Songs/Artists"
            v-model="searchword"
          />
          <!-- <h1 class="modal-title fs-5" id="exampleModalLabel">노래 검색</h1> -->
          <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
        </div>
        <div class="modal-body modalBody" v-if="searchword">
          <TrackSearchResult
            class="result"
            v-for="track in searchResults"
            :key="track.uri"
            :track="track"
          />
          <InfiniteLoading @infinite="search" />
        </div>
        <!-- <Player v-if="playingTrack" :accessToken="accessToken" :trackUri="playingTrack.uri" /> -->
        <div class="modal-footer">
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-success me-2" data-bs-dismiss="modal">
              그만 추가할래
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.modalBody {
  overflow-x: hidden;
  height: 88%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.result {
  display: flex;
  flex-direction: row;
  gap: 5px;
  font-weight: 300;
  width: 400px;
  padding: 10px;
  text-align: center;
  margin: 0 auto 10px auto;
  background: #eceef0;
  border-radius: 10px;
}
</style>