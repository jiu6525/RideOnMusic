import { ref } from "vue";
import { defineStore } from "pinia";
import SpotifyWebApi from "spotify-web-api-node";
import store from "@/stores";
import axios from "axios";
const { VITE_NODE_EXPRESS_URI } = import.meta.env;

export const useSearchStore = defineStore(
  "search",
  () => {
    const searchQuery = ref("");
    const searchResults = ref([]);
    const nextPageUrl = ref(null);
    const playingTrack = ref(null);
    const tokenStore = store.useTokenStore();
    const limit = 10;

    const searchTracks = async (query, offset) => {
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/search`, {
          accessToken: tokenStore.accessToken,
          keyword: query,
          offset: offset,
        })
        .then((res) => {
          // console.log(res.data);
          searchResults.value = res.data.tracks.items.map((track) => ({
            artist: track.artists[0].name,
            title: track.name,
            id: track.id,
            uri: track.uri,
            albumUrl: track.album.images.reduce((smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            }, track.album.images[0]).url,
          }));
          // nextPageUrl.value = response.body.tracks.next;
          // console.log(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      searchQuery,
      searchResults,
      nextPageUrl,
      playingTrack,
      searchTracks,
    };
  },
  {
    persist: true,
  }
);