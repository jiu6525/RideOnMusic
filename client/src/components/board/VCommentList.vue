<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCommentListApi } from '@/api/comment';
import {VCommentItem} from "@/components/board"

const route = useRoute();
const router = useRouter();
const { articleNo } = route.params;

const loginId=sessionStorage.getItem("loginId")
const commentList = ref([])
const boardType=ref('')

const getCommentList=()=>{
  getCommentListApi(boardType.value,articleNo,
    ({data}) => commentList.value = data.data.commentList
    ,(error) => {
      console.log(error);
    }
  )
}

// 새로운 댓글을 댓글 배열에 추가하는 함수
const addCommentToPage = (comment) => {
  console.log("list "+comment)
  commentList.value.push(comment);

};

//댓글 리스트에서 삭제하는 함수
const deleteCommentToPage=(commentId)=>{
  // console.log("삭제")
  // let idx=commentList.value.findIndex(c=>c.commentId===commentId)
  // if(idx>-1)commentList.value.splice(idx,1)
  getCommentList()
}

onMounted(() => {
  boardType.value=route.fullPath.split("/")[1]=='qnaboard'?'qna':''
  getCommentList()
})
defineExpose({
  addCommentToPage
  });
</script>

<template>
  <div id="comment-list">
    <div v-for="(comment) in commentList" :key="comment.commentId">
      <VCommentItem :comment="comment" @add-comment="addCommentToPage" @delete-comment="deleteCommentToPage"/>
    </div>
  </div>
</template>

<style scoped>

</style>