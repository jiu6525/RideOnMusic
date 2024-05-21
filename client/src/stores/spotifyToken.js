import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import axios from "axios";
import store from "@/stores";
const { VITE_NODE_EXPRESS_URI } = import.meta.env;

export const useTokenStore = defineStore(
  "token",
  () => {
    const code = ref();
    const accessToken = ref("");
    const refreshToken = ref("");
    const expiresIn = ref(3600);
    const refreshInterval = ref(null); // 인터벌 ID를 저장할 변수

    const router = useRouter();
    const uesrStore = store.useUserStore();
    const playlistStore = store.usePlaylistStore();

    const login = async () => {
      await axios
        .post(`${VITE_NODE_EXPRESS_URI}/spotify/login`, { code: code.value })
        .then((res) => {
          // console.log(res.data)
          accessToken.value = res.data.accessToken;
          refreshToken.value = res.data.refreshToken;
          expiresIn.value = res.data.expiresIn;
          code.value = res.data.code;
          // console.log(accessToken.value, refreshToken.value, expiresIn.value)
        })
        .then(() => {
          //if (refreshToken.value) refresh()
          if (accessToken.value) {
            uesrStore.getUserProfile();
            playlistStore.getPlaylist();
          }
          router.push("/plan/regist");
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const refresh = () => {
      const router = useRouter();
      if (!refreshToken.value || !expiresIn.value) return;
      if (refreshInterval.value) {
        console.log("인터벌이 이미 설정되어 있습니다.");
        return;
      }
      refreshInterval.value = setInterval(async () => {
        console.log("refresh");
        console.log(refreshInterval.value);
        try {
          const res = await axios.post(`${VITE_NODE_EXPRESS_URI}/spotify/refresh`, {
            refreshToken: refreshToken,
          });
          accessToken.value = res.data.accessToken;
          expiresIn.value = res.data.expiresIn;
        } catch (error) {
          console.log(error);
          clearInterval(refreshInterval);
          refreshInterval.value = null;
        }
      }, (expiresIn.value - 60) * 10000);

      // // Cleanup interval on component unmount
      // $once('unmounted', () => {
      //   clearInterval(interval)
      // })
    };
    return {
      accessToken,
      refreshToken,
      expiresIn,
      code,
      login,
      refresh,
    };
  },
  {
    persist: true,
  }
);
