<script setup>
import "@/assets/css/board.css";
import { ref, onMounted, watch } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router"
const route = useRoute();
const router = useRouter();
const routeType = ref('')

const changeTitle = (boardType, boardRoute) => {
  // const routeUrl = route.path.split("/")[2]
  switch (boardRoute) {
    case 'list':
      routeType.value = boardType == 'qnaboard' ? 'Q & A' : '글목록'
      break;
    case 'detail':
      routeType.value = '글보기'
      break;
    case 'write':
      routeType.value = '글쓰기'
      break;
    case 'modify':
      routeType.value = '글수정'
      break;
    default:
      break;
  }
}
onMounted(() => {
  const boardType = route.path.split("/")[1]
  const boardRoute = route.path.split("/")[2]
  changeTitle(boardType, boardRoute)
})
onBeforeRouteUpdate((to, from, next) => {
  changeTitle(to.fullPath.split("/")[1], to.fullPath.split("/")[2])
  next();
});
</script>

<template>
  <div class="container" id="list-container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">{{ routeType }}</mark>
        </h2>
      </div>
      <div class="col-lg-8 col-md-10 col-sm-12">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>