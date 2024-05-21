
<script setup>
import { ref, onMounted} from "vue";  
import { useRoute, useRouter, RouterLink } from "vue-router"

const route = useRoute();
const boardType=ref('')
defineProps({ article: Object });

onMounted(() => {
  boardType.value=route.fullPath.split("/")[1]=='qnaboard'?'qna':''
})

</script>
<template>
  <tr class="text-center" >
    <th scope="row">
    <RouterLink
      :to="{ name: `${boardType}articledetail`, params: { articleNo:article.articleNo }}"
      class="article-title link-dark" style="text-decoration: none">
      {{article.articleNo}}
    </RouterLink>
    </th>
      <td class="text-start">{{article.subject}}</td>
      <td>{{article.memberId}}</td>
      <td>{{article.hit}}</td>
      <td>{{article.registerTime}}</td>
  </tr>
</template>
<style  scoped>

</style>