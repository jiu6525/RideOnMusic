<script setup>
import { ref } from "vue";  
import { insertMemberApi } from "@/api/member.js";
import { useRouter } from "vue-router";
const router = useRouter();

var member = ref({})

const memberinsert = () => {
  console.log(member.value)
  if(member.value.memberPwd != member.value.checkPassword){
    alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.')
  }else{
    insertMemberApi(member.value, ({data}) => {
      if(data.status == 'success'){
        router.push({name: 'home'})
      }else if(data.status == 'fail'){
        alert(data.message)
      }else{
        alert('에러가 발생했습니다. 다시 시도해주세요.')
      }
    }, (error) => console.log(error))
  }
}
</script>

<template>
  <div>
    <div class="container">
      <div class="input-form-backgroud row">
        <div class="input-form col-md-12 mx-auto">
          <h4 class="mb-3">회원가입</h4>
          <!-- 서버측에서도 한번 더 검증해주면 좋긴 할 듯.. -->
          <!-- action="member.do?action=join" -->
          <form class="validation-form" @submit.prevent="memberinsert">
            <div class="mb-3">
              <label for="joinName">이름</label> <input type="text"
                class="form-control" id="joinName" name="memberName" v-model="member.memberName" required />
            </div>

            <div class="mb-3">
              <label for="joinId">아이디</label> <input type="text"
                class="form-control" id="joinId" name="memberId" v-model="member.memberId" required />
              <div class="invalid-feedback">아이디를 입력해주세요.</div>
            </div>

            <div class="mb-3">
              <label for="joinPwd">비밀번호</label> <input type="password"
                class="form-control" id="joinPwd" name="memberPwd" v-model="member.memberPwd" required />
              <div class="invalid-feedback">비밀번호를 입력해주세요.</div>
            </div>

            <div class="mb-3">
              <label for="checkPassword">비밀번호 확인</label> <input type="password"
                class="form-control" id="checkPassword" v-model="member.checkPassword" required />
              <div class="invalid-feedback">비밀번호를 재입력해주세요.</div>
            </div>

            <div class="mb-3">
              <label for="joinEmail">이메일</label> <input type="email"
                class="form-control" placeholder="you@example.com" id="joinEmail"
                name="memberEmail" v-model="member.memberEmail" required />
            </div>

            <div class="row mr-auto" style="float: right">
              <div class="col">
                <label for="name"></label>
                <input  type="submit"
                  class="btn btn-outline-primary" id="join-btn" value="회원가입"/>
              </div>
              <div class="col">
                <label for="name"></label> 
                <input type="reset" class="btn btn-outline-success"></input>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "/src/assets/css/member.css"
</style>