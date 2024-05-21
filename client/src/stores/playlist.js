import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import store from "@/stores";

// import api from "@/api";
const { VITE_NODE_EXPRESS_URI } = import.meta.env;
export const usePlaylistStore = defineStore(
  "playlist",
  () => {
    const tokenStore = store.useTokenStore();
    const trackStore = store.useTrackStore();
    const { savedTracks } = storeToRefs(trackStore);
    const playlist = ref(null);
    const hasPlaylist = ref(false);
    const planPlaylistId = ref(null);

    const createPlaylist = async (name, desc) => {
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/createPlaylist`, {
          accessToken: tokenStore.accessToken,
          name: name,
          description: desc,
        })
        .then((res) => {
          playlist.value = {
            playlistId: res.data.id,
            href: res.data.href,
            name: res.data.name,
            snapshot_id: res.data.snapshot_id,
            tracks: [],
            uri: res.data.uri,
            description: res.data.description,
          };
          planPlaylistId.value = res.data.id;
          savedTracks.value = [];
          hasPlaylist.value = true;
          // console.log(res.data);
          // router.push("/");
        })
        .catch((error) => {
          // router.push("/");
          console.log(error);
        });
    };

    const getPlaylist = async () => {
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/getPlaylist`, {
          accessToken: tokenStore.accessToken,
          // playlistId: "3cEYpjA9oz9GiPac4AsH4n",
          playlistId: planPlaylistId.value,
        })
        .then((res) => {
          // console.log(res.data);
          playlist.value = {
            playlistId: res.data.id,
            name: res.data.name,
            track: res.data.tracks.items.map((item) => ({
              artist: item.track.artists[0].name,
              title: item.track.name,
              id: item.track.id,
              uri: item.track.uri,
              albumUrl: item.track.album.images.reduce((smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest;
              }, item.track.album.images[0]).url,
            })),
          };
          savedTracks.value = playlist.value.track;
          hasPlaylist.value = true;
        })
        .catch((error) => {
          console.log(error);
          // router.push("/");
        });
    };
    const removetracks = async (traks) => {
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/removetrack`, {
          accessToken: tokenStore.accessToken,
          // playlistId: "3cEYpjA9oz9GiPac4AsH4n",
          track: [],
          playlistId: planPlaylistId.value,
        })
        .then((res) => {
          playlist.value = res.data;
          // console.log(res.data);

          // router.push("/");
        })
        .catch((error) => {
          console.log(error);
          // router.push("/");
        });
    };

    const addtracks = async (uris) => {
      // console.log(playlist.value.id);
      let arr = [];
      arr.push(uris);
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/addTracksToPlaylist`, {
          accessToken: tokenStore.accessToken,
          playlistId: planPlaylistId.value,
          tracks: arr,
        })
        .then((res) => {
          // console.log(res.data);
          // router.push("/");
          getPlaylist();
        })
        .catch((error) => {
          console.log(error);
          // router.push("/");
        });
    };
    const savePlaylist = async () => {
      // console.log(planPlaylistId.value);
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/UpdatePlaylistItems`, {
          accessToken: tokenStore.accessToken,
          playlistId: planPlaylistId.value,
          tracks: savedTracks.value.map((track) => track.uri).join(","),
        })
        .then((res) => {
          // console.log(res.data.snapshot_id);
          playlist.value.tracks = savedTracks.value;
          playlist.value.snapshot_id = res.data.snapshot_id;
        })
        .catch((error) => {
          console.log(error);
          playlist.value.snapshot_id = null;
          return null;
          // router.push("/");
        });
    };
    return {
      playlist,
      hasPlaylist,
      planPlaylistId,
      createPlaylist,
      getPlaylist,
      addtracks,
      removetracks,
      savePlaylist,
    };
  },
  {
    persist: true,
  }
);
