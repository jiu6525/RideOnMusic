import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import axios from "axios";
import store from "@/stores";
const { VITE_NODE_EXPRESS_URI } = import.meta.env;

export const useUserStore = defineStore(
  "user",
  () => {
    const profile = ref();
    const playlists = ref([]);
    const tokenStore = store.useTokenStore();
    const router = useRouter();

    const getUserProfile = async () => {
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/userprofile`, {
          accessToken: tokenStore.accessToken,
        })
        .then((res) => {
          profile.value = res.data;
          // console.log(res.data)
        })
        .then(() => {
          getUserPlaylists();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getUserPlaylists = async () => {
      console.log(profile.value.userId);
      axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/getUserPlaylists`, {
          accessToken: tokenStore.accessToken,
          id: profile.value.userId,
        })
        .then((res) => {
          playlists.value = res.data;
          // console.log(res.data);
          // router.push("/");
        })
        .catch((error) => {
          console.log(error);
          // router.push("/");
        });
    };
    const clearUserPlaylists = () => {
      playlists.value = null;
    };

    return {
      profile,
      playlists,
      getUserProfile,
      getUserPlaylists,
    };
  },
  {
    persist: true,
  }
);
