<script setup>
import { ref, onMounted } from "vue";  
import { getMemberApi, updateMemberApi, updatePwdApi, withdrawMemberApi } from "@/api/member.js";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/memberStore.js";
import { storeToRefs } from "pinia"


// 추가 코드
const memberStore = useMemberStore();
const { userInfo} = storeToRefs(memberStore);
//

const router = useRouter();

var member = ref({})
var updateInfo = ref({})
var pwdInfo = ref({})

onMounted(()=> getMemberInfo())

const getMemberInfo = async () => {
  await getMemberApi(userInfo.value.memberId, ({data}) => {
    if(!data.userInfo){
      alert('에러가 발생했습니다. 다시 시도해주세요.')
      router.push({name: 'home'})
    }else{
      member.value = data.userInfo
      updateInfo.value = {...data.userInfo}
      pwdInfo.value.memberId = data.userInfo.memberId
    }
  }, (error) => console.log(error))
}

const updateMember = () => {
  console.log(updateInfo.value)
  updateMemberApi(updateInfo.value, ({data}) => {
    console.log(data)
    if(data.status == 'success'){
      router.go(0)
    }else{
      alert('에러가 발생했습니다. 다시 시도해주세요.')
    }
  }, (error) => console.log(error))
}

const updatePwd = () => {
  console.log(pwdInfo.value)
  if(pwdInfo.value.memberPwd != pwdInfo.value.checkPassword){
    alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.')
  }else{
    updatePwdApi(pwdInfo.value, ({data}) => {
      alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요.')
      sessionStorage.removeItem('loginId')
      router.replace("/")
    }, (error) => console.log(error))
  }
}

const deleteMember = () =>{
  withdrawMemberApi(member.value, ({data}) => {
    console.log(data)
    sessionStorage.removeItem('loginId')
    router.replace("/")
  }, (error) => console.log(error))
}
</script>

<template>
  <div>
    <div class="container">
      <div class="row">
        <!-- 중앙 left content  start -->
        <div class="col-lg-4">
          <div class="card mb-3 card-shadow">
            <div id="info_left"
              class=" card-body d-flex flex-column align-items-center">
              <p id="info_left_name"
                class="card-title text-white mt-5 fw-bold fs-1">{{ member.memberName }}</p>
              <p id="info_left_email"
                class="card-text text-white mt-3 mb-5 fs-5">{{member.memberEmail}}</p>
            </div>
            <ul class="list-group list-group-flush ">
              <li class="list-group-item p-5 fs-5">
                <div class="mb-5">내 프로필</div>
                <div>찜한 장소</div>
              </li>
              <li class="list-group-item p-5 fs-5 clickable"><a
                data-bs-toggle="modal"
                data-bs-target="#withdraw"
                style="text-decoration: none; color: black">회원 탈퇴</a></li>
            </ul>
          </div>
        </div>
        <!-- 중앙 left content end -->
        <!-- 중앙 center content start -->
        <div class="col-lg-8">

          <div class="card card-shadow">
            <div
              class="card-header text-white fs-5 d-flex justify-content-between">
              내 프로필 <img class="clickable" src="/src/assets/img/icn_update.svg"
                data-bs-toggle="modal" data-bs-target="#update">
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush ">
                <li class="list-group-item">아이디&nbsp;&nbsp;&nbsp;<span
                  id="info_region" class="fw-bold ms-3">{{ member.memberId }}</span></li>
                <li class="list-group-item">이름&nbsp;&nbsp;&nbsp;<span
                  id="info_name" class="fw-bold ms-3">{{ member.memberName }}</span></li>
                <li class="list-group-item">이메일<span id="info_email"
                  class="fw-bold ms-3">{{ member.memberEmail }}</span></li>
              </ul>
            </div>
          </div>
          <div class="card mt-3 card-shadow">
            <div
              class="card-header text-white fs-5 d-flex justify-content-between">
              비밀번호 변경</div>
            <div class="card-body">
              <form class="validation-form" @submit.prevent="updatePwd">
                <input name="memberId" value="${loginId}" style="display: none">
                <div class="mb-3">
                  <label for="updatePwd">비밀번호 </label> <input type="password"
                    class="form-control" id="updatePwd" name="memberPwd" 
                    v-model="pwdInfo.memberPwd" required />
                  <div class="invalid-feedback">비밀번호를 입력해주세요.</div>
                </div>

                <div class="mb-3">
                  <label for="checkPassword">비밀번호 확인</label> <input
                    type="password" class="form-control" id="checkPassword"
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
          <div class="card mt-3 card-shadow">
            <div class="card-header text-white fs-5">찜한 장소</div>
            <div class="card-body">
              <ul class="list-group list-group-flush ">
                <li class="list-group-item">관심 카테고리 <select
                  id="search-content-id" class="form-select mt-2 mb-3"
                  aria-label="Default select example">
                    <option value="0" selected>관광지 유형</option>
                    <option value="12">관광지</option>
                    <option value="14">문화시설</option>
                    <option value="15">축제공연행사</option>
                    <option value="25">여행코스</option>
                    <option value="28">레포츠</option>
                    <option value="32">숙박</option>
                    <option value="38">쇼핑</option>
                    <option value="39">음식점</option>
                </select>
                </li>
                <li class="list-group-item mt-3">관심 지역
                  <form class="d-flex" role="search">
                    <select id="join_region" class="form-select mt-2 region"
                      aria-label="Default select example">
                      <option value="0" selected>지역 선택</option>
                    </select>
                  </form>
                  <div id="info_map" class="mt-3"></div>
                  <p class="mt-3">자세한 내용은 지역별 검색 화면에서 확인해보세요!</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 중앙 center content end -->
      </div>
    </div>

    <!-- 정보수정 modal start -->
    <div id="update" class="modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">내 정보 수정</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="updateName">이름</label> <input type="text"
                class="form-control" id="updateName" name="memberName"
                v-model="updateInfo.memberName" required />
            </div>
            <div class="form-group mt-3">
              <label for="updateEmail">이메일</label> <input type="email"
                class="form-control" id="updateEmail" name="memberEmail"
                v-model="updateInfo.memberEmail" required />
            </div>
            <div class="modal-footer mt-3">
              <input type="button" @click="updateMember" class="btn btn-outline-secondary" value="수정" />
              <button type="button" data-bs-dismiss="modal"
                class="btn btn-outline-secondary">취소</button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div id="withdraw" class="modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">회원 탈퇴</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
              <div>
              <h5>정말 탈퇴하시겠어요?</h5>
              탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다. <br>
              <!-- 탈퇴하시면 회원님이 작성한 게시글 및 댓글 내역이 삭제됩니다. <br> 삭제된 정보는 복구할 수 없으니 신중히 결정해주세요. -->
              </div>
              <div class="modal-footer mt-3">
                <button @click="deleteMember" class="btn btn-outline-secondary">탈퇴</button>
                <button type="button" data-bs-dismiss="modal"
                  class="btn btn-outline-secondary">취소</button>
              </div>
          </div>

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

#info_left {
	background-image: url("/src/assets/img/bg6.jpg");
	background-size: cover;
	border-radius: 5px 5px 0px 0px;
}

.card-shadow {
	/* x-pos y-pos blur spread color*/
	box-shadow: 3px 3px 10px 3px #cfcfcf;
}

.card-header {
	color: white;
	background-image: linear-gradient(to right, #30AF1C, #207D20);
}

.clickable {
	cursor: pointer;
}
</style>