<script setup>
import { ref, onMounted} from "vue";  
import { useRoute, useRouter, RouterLink } from "vue-router"

import PageNavigation from "@/components/common/VPageNavigation.vue"
import VSelect from "@/components/common/VSelect.vue"
import { getArticleListApi } from "@/api/board.js";
import {VArticleListItem} from "@/components/board"

const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const route = useRoute();
const router = useRouter();

const boardType=ref('')
const classGroup = 'form-select form-select-sm ms-5 me-1 w-50'
const selectOption = ref([
  { text: "글번호", value: "article_no" },
  { text: "제목", value: "subject" },
  { text: "작성자아이디", value: "member_id" },
])
const articles=ref([])
const pageArticles=ref([])

const currentPage = ref(1);
const totalPage = ref(0);
const navigation=ref({
  key: "",
  word: "",
})

const getArticleList = async () => {
  getArticleListApi(boardType.value,navigation.value,({data}) => {
    articles.value = data.data.articles
    // console.log(data)
    currentPage.value = 1;
    totalPage.value =Math.ceil(articles.value.length/VITE_ARTICLE_LIST_SIZE)
    onPageChange(1);
  }, (error) => {
    console.log(error);
  })
}
const onPageChange = (val) => {
  currentPage.value = val;
  let start=(val-1)*VITE_ARTICLE_LIST_SIZE
  let end=start+VITE_ARTICLE_LIST_SIZE
  //getArticleList()
  // console.log(articles.value)

  pageArticles.value=articles.value.slice(start,end)
}
const changeKey = (val) => {
  navigation.value.key = val;
};

onMounted(() => {
  boardType.value=route.fullPath.split("/")[1]=='qnaboard'?'qna':''
  getArticleList();
})

</script>

<template>
  <div class="row align-self-center mb-2">
    <div class="col-md-2 text-start">
      <button type="button" id="btn-mv-register"
      class="btn btn-outline-primary btn-sm" @click="router.push({ name:`${boardType}articlewrite`})">글쓰기</button>
    </div>
    <div class="col-md-7 offset-3">
      <form id="form-search" class="d-flex" @submit.prevent="getArticleList">
        <input type="hidden" name="action" value="list" /> 
        <input type="hidden" name="pgno" value="1" /> 
        <VSelect 
          :selectOption="selectOption" 
          :defaultValue="'검색 조건'"
          :classGroup="classGroup"
          @onKeySelect="changeKey" />
        <div class="input-group input-group-sm">
          <input
            type="text"
            class="form-control"
            v-model="navigation.word"
            placeholder="검색어..."
          />
          <button class="btn btn-dark" type="button" @click="getArticleList">검색</button>

        </div>
      </form>
    </div>
  </div>
  <table class="table table-hover">
    <thead>
      <tr class="text-center">
        <th scope="col">글번호</th>
        <th scope="col">제목</th>
        <th scope="col">작성자</th>
        <th scope="col">조회수</th>
        <th scope="col">작성일</th>
      </tr>
    </thead>
    <tbody>
      <VArticleListItem
        v-for="article in pageArticles"
        :key="article.articleNo"
        :article="article"
      ></VArticleListItem>
    </tbody>
  </table>
<PageNavigation
  :current-page="currentPage"
  :total-page="totalPage"
  @pageChange="onPageChange"
></PageNavigation>

</template>

<style scoped>

</style>