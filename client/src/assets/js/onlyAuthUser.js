import { useMemberStore } from "@/stores/memberStore.js";
import { storeToRefs } from "pinia";

const onlyAuthUser = async (to, from, next) => {
  const memberStore = useMemberStore();
  const { userInfo, isValidToken } = storeToRefs(memberStore);
  const { getUserInfo } = memberStore;

  let token = sessionStorage.getItem("accessToken");
  // userInfo.value != null &&
  if ( token) {
    await getUserInfo(token);

  }
  if (!isValidToken.value && userInfo.value === null) {
    alert("로그인 해주세요!");
    next({ name: "home" });
  } else {
    next();
  }
};

export default onlyAuthUser;
