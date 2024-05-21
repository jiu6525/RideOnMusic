<script setup>
import { ref, onMounted,watch} from "vue";  
import { useRoute, useRouter } from "vue-router"
import { registArticleApi,getArticleApi,modifyArticleApi } from "@/api/board";

const route = useRoute();
const router = useRouter();

const loginId = sessionStorage.getItem("loginId")
const { articleNo } = route.params;
const boardType=ref('')
const routeUrl=ref('')
const article=ref({
  articleNo:0,
  subject: "",
  content:"",
  memberId:"",
})

const subjectErrMsg = ref("")
const contentErrMsg = ref("")

watch(
  () => article.value.subject,
  (value) => {
    let len = value.length
    if (len == 0 || len > 30) {
      subjectErrMsg.value = "제목을 확인해 주세요!!!"
    } else subjectErrMsg.value = ""
  },
  { immediate: true }
)
watch(
  () => article.value.content,
  (value) => {
    let len = value.length
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해 주세요!!!"
    } else contentErrMsg.value = ""
  },
  { immediate: true }
)

const onSubmit=()=> {
  if (subjectErrMsg.value) {
    alert(subjectErrMsg.value)
  } else if (contentErrMsg.value) {
    alert(contentErrMsg.value)
  } else {
    routeUrl.value=== "write" ? writeArticle() : updateArticle()
  }
}

function writeArticle() {
  article.value.memberId = loginId
  console.log(loginId)
  registArticleApi(boardType.value,
    article.value,
    ({data}) => {
      let msg = "글등록 처리시 문제 발생했습니다."
      if (data.status == 'success') msg = "글등록이 완료되었습니다."
      alert(msg)
      moveList()
    },
    (error) => console.log(error)
  )
}

function updateArticle() {
  modifyArticleApi(boardType.value,
    article.value,
    ({data}) => {
      let msg = "글수정 처리시 문제 발생했습니다."
      if (data.status == 'success') msg = "글정보 수정이 완료되었습니다."
      alert(msg)
      router.push(`/${boardType.value}board/detail/${article.value.articleNo}`);
    },
    (error) => console.log(error)
  )
}
function moveList() {
  router.replace({ name: `${boardType.value}boardlist` })
}
onMounted(() => {
  boardType.value=route.fullPath.split("/")[1]=='qnaboard'?'qna':''
  routeUrl.value = route.path.split("/")[2]
  if (routeUrl.value === "modify") {
    getArticleApi(boardType.value,
      articleNo,
      ({ data }) => article.value = data.data.article,
      (error) => {
        console.log(error)
      }
    )
  }
})
</script>

<template>
  <form id="form-register" @submit.prevent="onSubmit">
    <input type="hidden" name="action" value="write">
    <div class="mb-3">
      <label for="subject" class="form-label">제목 : </label> <input
        type="text" class="form-control" id="subject" name="subject"
        placeholder="제목..." v-model="article.subject"/>
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">내용 : </label>
      <textarea class="form-control" id="content" name="content"
        rows="7"  v-model="article.content" ></textarea>
    </div>
    <div class="col-auto text-center">
      <button type="submit" class="btn mini btn-outline-success mb-3 ms-1" v-if="routeUrl === 'write'">
        글작성
      </button>
      <button type="submit" class="btn mini btn-outline-success mb-3 ms-1" v-else>글수정</button>
      <button type="button" class="btn mini btn-outline-primary mb-3"  @click="moveList">
        목록으로이동...
      </button>
      <button type="reset" class="btn btn-outline-danger mb-3">초기화</button>
    </div>
  </form>

</template>

<style scoped></style>
