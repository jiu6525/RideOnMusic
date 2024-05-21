<script setup>
import { ref, onMounted} from "vue";  
import { useRoute, useRouter, RouterLink } from "vue-router"
import { getArticleApi ,deleteArticleApi} from "@/api/board";
import { VCommentForm,VCommentList } from '@/components/board';
const route = useRoute();
const router = useRouter();

const { articleNo } = route.params;
const loginId=sessionStorage.getItem("loginId")

const boardType=ref('')
const commentFormRef=ref(null)
const article=ref({
  articleNo:articleNo,
  subject:"",
  memberId:"",
  registerTime:"",
  hit:1
})

const getArticle=()=>{
  getArticleApi(boardType.value,articleNo,
    ({ data }) => article.value = data.data.article,
    (error) => {
      console.log(error);
    }
  )
}

const deleteArticle = () => {
  if (confirm("글을 삭제하시겠습니까?")) {
    deleteArticleApi(boardType.value,articleNo,
    ({ data})=> {
        if(data.status == 'success')
        alert(data.message)
        router.replace({ name: 'board' })
      },
    (error) => {
      console.log(error);
    }
    )
  }
}

const addComment=(comment)=>{
  if(commentFormRef.value)commentFormRef.value.addCommentToPage(comment);
}

onMounted(() => {
  boardType.value=route.fullPath.split("/")[1]=='qnaboard'?'qna':''
  getArticle()
  
})
</script>
<template>
  <div class="row my-2">
    <h2 class="text-secondary px-5">{{article.subject}}</h2>
  </div>
  <div class="row">
    <div class="col-md-8">
      <div class="clearfix align-content-center">
        <img class="avatar me-2 float-md-start bg-light p-2"
          src="https://raw.githubusercontent.com/twbs/icons/main/icons/person-fill.svg" />
        <p>
          <span class="fw-bold">{{article.memberId}}</span> <br /> <span
            class="text-secondary fw-light"> {{article.registerTime}}
            조회 : {{article.hit}} </span>
        </p>
      </div>
    </div>
    <div class="divider mb-3"></div>
    <div class="text-secondary">{{article.content}}</div>
    <div class="divider mt-3 mb-3"></div>
    <div class="d-flex justify-content-end">
      <button type="button" id="btn-list"
        class="btn mini btn-outline-primary mb-3"  @click="router.push({name:`${boardType}boardlist`})">글목록</button>
      <!-- <div v-if="loginId ==article.memberId"> -->
        <button type="button" id="btn-mv-modify"  v-if="article.memberId==loginId"
          class="btn mini btn-outline-success mb-3 ms-1" @click="router.push({name:`${boardType}articlemodify`})">글수정</button>
        <button type="button" id="btn-delete"  v-if="article.memberId==loginId"
          class="btn mini btn-outline-danger mb-3 ms-1" @click="deleteArticle">글삭제</button>
      <!-- </div> -->
    </div>
  </div>
  <!-- //TODO - 댓글 목록 -->
  <VCommentList ref="commentFormRef"/>
  <!-- //TODO - 댓글 작성 폼 -->
  <VCommentForm  v-if="(boardType=='')||(boardType=='qna'&&article.memberId==loginId)" :articleNo="articleNo" parentId="-1" @add-comment="addComment"/>
</template>

<style scoped>
</style>