<script setup>
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import store from "@/stores";
// import playlists from "@/api/spotify/playlists";
const name = ref("");
const description = ref("");
const playlistStore = store.usePlaylistStore();
const clearForm = () => {
  name.value = "";
  description.value = "";
};
// const validate = () => {
//   let valid = true;
//   if (!name.value) {
//     store.addNotification({
//       type: "error",
//       message: "You must give your playlist a name.",
//       duration: 3000,
//     });
//     return false;
//   }
//   return valid;
// };
const makePlaylist = () => {
  //TODO - spotify랑 연결
  //TODO - back서버와 연결해서 plan의 playlist id 저장
};
const create = async () => {
  // if (validate()) {
  try {
    const response = await playlistStore.createPlaylist(name.value, description.value);
    clearForm();
  } catch (e) {
    console.log(e);
  }
  // }
};
onMounted(() => {});
</script>

<template>
  <div>
    <button
      size="md"
      id="btn-save"
      class="btn btn-outline-primary bg-light"
      data-bs-toggle="modal"
      data-bs-target="#creatPLModal"
    >
      기깔난 플리 만들기
    </button>

    <template class="modal fade" id="creatPLModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-dark">
          <div class="modal-body">
            <a class="nav-link active" aria-current="page" href="#">해쉬태그 정하기</a>

            <form class="form-floating mb-3">
              <input
                type="name"
                class="form-control"
                id="floatingInput"
                placeholder="playlist Name"
                v-model="name"
                required
              />
              <label for="playlistName">playlist name</label>

              <div class="form-floating">
                <textarea
                  class="form-control"
                  placeholder="Leave a comment here"
                  id="playlist Description"
                  v-model="description"
                ></textarea>
                <label for="playlistDescription">playlist description</label>
              </div>
            </form>
            <div class="modal-footer mt-3">
              <div class="d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-outline-success me-2"
                  data-bs-dismiss="modal"
                  @click="create"
                  id="LOGIN"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style></style>