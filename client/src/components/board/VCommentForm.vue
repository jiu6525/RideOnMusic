<script setup>
import { onMounted, ref,defineEmits } from "vue";
import { useRoute } from "vue-router"

import { registCommentApi } from "@/api/comment";
const route = useRoute();

const  props= defineProps(['articleNo','parentId','parentMemberId']);
const title=ref("댓글")
const boardType=ref('')

const emit=defineEmits(['addComment'])
const loginId=sessionStorage.getItem("loginId");
const comment = ref({
  articleNo: props.articleNo,
  content: "",
  parentId: props.parentId==-1?null:props.parentId,
  memberId: loginId,
  isDeleted:false,
})

const onSubmit = () => {
  //console.log(comment.value)
  registCommentApi(boardType.value,comment.value,
  ({ data})=> {
        if(data.status != 'success') alert(data.message)
        else{
          //화면에 댓글 추가
          emit('addComment',data.data.comment)
          comment.value.content=''
        }
      },
    (error) => {
      console.log(error);
    }
  )
}


onMounted(() => {
  boardType.value=route.fullPath.split("/")[1]=='qnaboard'?'qna':''

  if(props.parentId!=-1)title.value=`${props.parentMemberId}에게 답글 쓰기` 
})

</script>

<template>
  <div class="comment-write">
    <label for="comment" class="form-label">{{title}}</label>
    <form id="comment-form" class="d-flex flex-column align-items-end" @submit.prevent="onSubmit">
      <textarea class="form-control" id="comment" name="comment"
        placeholder="댓글을 입력하세요. 글자수는 3000자를 넘지 않아야 합니다." rows="4"
        maxlength="3000" v-model="comment.content"></textarea>
      <div class="d-flex justify-content-between align-items-center">
        <button type="submit" class="btn green mini">등록</button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>