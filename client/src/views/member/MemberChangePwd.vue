<script setup>
import { ref } from "vue";  
import { updatePwdApi } from "@/api/member.js";

const pwdInfo = ref({})
const updatePwd = () => {
  if(pwdInfo.value.memberPwd != pwdInfo.value.checkPassword){
    alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.')
  }else{
    updatePwdApi(pwdInfo.value, ({data}) => {
      alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요.')
      sessionStorage.removeItem('loginId')
      location.href = '/'
    }, (error) => console.log(error))
  }
}
</script>

<template>
  <div>
    <div class="container">
      <div class="input-form-backgroud row">
        <div class="input-form col-md-12 mx-auto">
          <h4 class="mb-3">비밀번호 변경</h4>

          <form class="validation-form"
            action="member/authenticate" method="post" novalidate>
            <!-- 나중에 이메일 인증 -->
            <div class="mb-3">
              <label for="authId">아이디</label> <input type="text"
                class="form-control" id="authId" name="memberId" required />
              <div class="invalid-feedback">아이디를 입력해주세요.</div>
            </div>

            <div class="mb-3">
              <label for="authEmail">이메일</label> <input type="email"
                class="form-control" id="authEmail" name="memberEmail" required />
            </div>

            <div>
              <button type="submit" class="btn btn-outline-success">이메일
                인증</button>
            </div>
          </form>

          <form class="validation-form" @submit.prevent="updatePwd"
            method="post" novalidate>
            <!-- 이메일 인증 됐다고 치고 비번 업데이트, 나중에 세션으로 바꾸ㅓ여~ -->
            <div class="mb-3">
              <label for="authedId">아이디</label> <input type="text"
                class="form-control" id="authedId" name="memberId" 
                v-model="pwdInfo.memberId" required />
              <div class="invalid-feedback">아이디를 입력해주세요.</div>
            </div>

            <div class="mb-3">
              <label for="updatePwd">비밀번호 </label> <input type="password"
                class="form-control" id="updatePwd" name="memberPwd"
                v-model="pwdInfo.memberPwd" required />
              <div class="invalid-feedback">비밀번호를 입력해주세요.</div>
            </div>

            <div class="mb-3">
              <label for="checkPassword">비밀번호 확인</label> <input type="password"
                class="form-control" id="checkPassword" 
                v-model="pwdInfo.checkPassword" required />
              <div class="invalid-feedback">비밀번호를 재입력해주세요.</div>
            </div>

            <div>
              <button type="submit" class="btn btn-outline-success">비밀번호
                변경</button>
            </div>
          </form>


        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-form {
	max-width: 680px;
	padding: 32px;
	background: #fff;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
	-webkit-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
	-moz-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
	box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
}

.container {
	margin-top: 190px; /* 상단 마진 설정 */
	margin-bottom: 80px; /* 하단 마진 설정 */
	padding: 20px; /* 내부 컨텐츠와의 공간을 위해 패딩 설정 가능 */
}

@media ( max-width : 600px) {
	.container {
		margin-top: 20px; /* 모바일 화면에서의 상단 마진 설정 */
		margin-bottom: 20px; /* 모바일 화면에서의 하단 마진 설정 */
		padding: 10px;
	}
}
</style>