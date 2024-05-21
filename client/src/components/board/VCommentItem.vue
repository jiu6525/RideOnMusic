<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"

import { deleteCommentApi, getCommentListApi, modifyCommentApi } from "@/api/comment";
import { VCommentForm } from '@/components/board';
const route = useRoute();

const loginId = sessionStorage.getItem("loginId")
const  props= defineProps(['comment']);
const emit=defineEmits(['addComment','deleteComment'])
const boardType=ref('')

const isShowReplyForm=ref(false)
// const comment = ref({
//   articleNo: 0,
//   content: "",
//   // parentId: 0,
//   memberId: 1,
//   isDeleted: false,
//   commentId:0,
// })


// 삭제 함수
const deleteComment = () => {
  if (confirm("글을 삭제하시겠습니까?")) {
    deleteCommentApi(boardType.value,props.comment.commentId,
    ({ data})=> {
        if(data.status == 'success')
        alert(data.message)
        // router.replace({ name: 'board' })
        emit('deleteComment',props.comment.commentId)
      },
    (error) => {
      console.log(error);
    }
    )
  }};

// 수정 함수
const editComment = () => {
  

};

// 답글 폼을 표시하는 함수
const showReplyForm = () => {
  //console.log(props.comment)
  isShowReplyForm.value=!isShowReplyForm.value;
};

const addComment=(comment)=>{
  showReplyForm()
  emit('addComment',comment)
}
onMounted(()=>{
  boardType.value=route.fullPath.split("/")[1]=='qnaboard'?'qna':''
})
</script>

<template>

  <div class="comment" style="margin-left:20px;">
    <div class="d-flex justify-content-between">
      <div class="comment-body">
        <div class="comment-date" v-if="comment.parentId">@{{ comment.parentMemberId }}</div>
        <div class="comment-author">{{ comment.memberId }}</div>
        <div class="comment-text">{{ comment.content }}</div>
        <div class="comment-date">{{ comment.modifyTime }}</div>
      </div>
      <div class="dropdown btn-group dropstart" v-show="!comment.isDeleted&&comment.memberId==loginId">
        <button class="btn dropdown-toggle" type="button"
          :id="'dropdownMenuButton' + comment.commentId"
          data-bs-toggle="dropdown" aria-expanded="false"
          style="border: none;"></button>
        <ul class="dropdown-menu" style="border: none;"
            :aria-labelledby="'dropdownMenuButton' + comment.commentId">
          <!-- <li><button class="dropdown-item" href="#" @click="editComment">수정</button></li> -->
          <li><button class="dropdown-item" href="#" @click="deleteComment">삭제</button></li>
        </ul>
      </div>
    </div>
    <button type="button" class="btn-reply btn mini yellow mb-3 ms-1"
      @click="showReplyForm" v-if="(!comment.isDeleted)&&(boardType=='')">답글</button>
  </div>
  <VCommentForm v-if="isShowReplyForm" :articleNo="comment.articleNo" :parentId="comment.commentId"  :parentMemberId="comment.memberId"  @add-comment="addComment"/>
</template>

<style scoped>
.btn-reply {
	margin-left: auto; /* 부모 요소의 오른쪽 끝으로 이동 */
}

.btn.mini {
	margin: 9px;
	padding: 4px 12px;
	font-size: 12px;
}

.btn.green {
	color: white;
	background-color: #9abf7f;
	box-shadow: 0px 4px 0px #87a86f;
}

.btn.green:active {
	box-shadow: 0 0 #87a86f;
	background-color: #87a86f;
}

.btn.yellow {
	background-color: #f0d264;
	box-shadow: 0px 4px 0px #D1B757;
}

.btn.yellow:active {
	box-shadow: 0 0 #87a86f;
	background-color: #f0d264;
}

.color.yellow {
	background: #f0d264;
}

.btn.yellow:active {
	box-shadow: 0 0 #ff4c4b;
}

/* 댓글 영역 */
.comment-item {
	margin-bottom: 10px;
	padding: 10px;
}

.comment-meta {
	font-size: 0.875rem;
	color: #666;
	margin-bottom: 5px;
}

.comment-author {
	font-weight: bold;
}

.comment-reply-to {
	color: #007bff;
	margin-left: 5px;
}

.comment-date {
	display: block;
	font-size: 0.75rem;
	color: #aaa;
}

.comment-body {
	font-size: 0.875rem;
	margin-bottom: 10px;
}

.comment-actions .reply-button {
	font-size: 0.75rem;
	margin-top: 5px;
}

.comment-write {
	margin-top: 30px;
	margin-bottom: 30px;
}

.comment-write .form-label {
	font-weight: bold;
	margin-bottom: 10px;
}

.comment-write .btn.green.mini {
	margin-top: 10px;
}

/* 드롭다운 메뉴 스타일 */
.dropdown-menu a {
	font-size: 0.8rem; /* 글씨 크기를 줄입니다 */
	color: #333; /* 글씨 색상을 지정합니다 */
	text-align: center; /* 텍스트를 중앙 정렬합니다 */
	padding: 5px 10px; /* 상하 좌우 패딩을 조정하여 항목 크기를 조절합니다 */
}

/* 드롭다운 메뉴 항목 호버 스타일 */
.dropdown-menu a:hover {
	background-color: #f8f9fa; /* 호버 시 배경색 변경 */
	color: #0056b3; /* 호버 시 글씨 색상 변경 */
}

/* 드롭다운 메뉴 위치와 관련된 스타일을 보정합니다 */
.dropdown {
	position: relative;
}
</style>