<template>
  <div
    class="w-100"
    style="
      margin-top: 10%;
      display: flex;
      justify-content: flex-start;
      gap: 20px;
      overflow-y: hidden;
      align-items: baseline;
    "
  >
      <!-- <PlannerChat/> -->
      <div class="col">
      <div class="row justify-content-center">
        <div class="col-md-3 text-center">
          <button class="btn btn-secondary btn-sm" type="button" @click="goToPlannerList">
            나의 여행계획 보기
          </button>
        </div>
        <div class="col-md-3 text-center">
          <VSelect
            :selectOption="sidoList"
            :defaultValue="'검색 할 지역 선택'"
            :classGroup="classGroup"
            @on-key-select="selectSido"
          />
        </div>
        <div class="col-md-3 text-center">
          <VSelect
            :selectOption="typeList"
            :defaultValue="'관광지 유형'"
            :classGroup="classGroup"
            @on-key-select="selectType"
          />
        </div>
        <div class="col-md-3 mb-3 text-center d-flex col">
          <input
            id="search-keyword"
            class="form-control mr-2"
            type="search"
            name="search-keyword"
            placeholder="검색어"
            aria-label="검색어"
            v-model="searchItem.title"
          />
          <button
            class="btn btn-primary btn-sm"
            id="btn-search"
            style="white-space: nowrap; margin-left: 5%"
            @click="search"
          >
            검색
          </button>
        </div>
      </div>
        <PlannerMaker :places="places" @submit-plan="handlePlanSubmission" />
          <!-- 초대 테스트 버튼 -->
          <!-- <button class="btn btn-primary" @click="inviteMember('3')">초대하기</button> -->
          <div class="col-md-3 mb-3 text-center d-flex col">
            <input id="sendedPushMember" class="form-control mr-2" type="text" v-model="sendedPushMember" placeholder="초대할 멤버 ID 입력" aria-label="초대할 멤버 ID 입력" />
            <button class="btn btn-primary btn-sm" id="btn-invite" style="white-space: nowrap; margin-left: 5%" @click="inviteMember">
              초대하기
            </button>
          </div>
        <!-- 초대 끝 -->


      </div>
      <MusicSidebar
      planId="planId"
    />
    </div>
  </template>
  
  <script setup>
import "@/assets/css/regist_plan.css";
import PlannerMaker from '/src/components/plan/item/PlannerMaker.vue';
import VSelect from '/src/components/common/VSelect.vue';
// import PlannerChat from "./PlannerChat.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Axios } from "@/util/http-commons";
import {chatService, socket, handleSocketMessage, places, addedPlaces } from '@/services/ChatService.js';

import MusicSidebar from "@/components/spotify/MusicSidebar.vue";
import store from "@/stores";

import { useMemberStore } from "@/stores/memberStore.js";
import { storeToRefs } from "pinia";

const router = useRouter(); 
const http = Axios();

// 초대 수정 코드
const sendedPushMember = ref("");

// 끝


const sidoList = ref([]);
const searchItem = ref({});
const classGroup = 'form-select mb-3';
const typeList = ref([
  { text: '관광지', value: '12' },
  { text: '문화시설', value: '14' },
  { text: '축제공연행사', value: '15' },
  { text: '여행코스', value: '25' },
  { text: '레포츠', value: '28' },
  { text: '숙박', value: '32' },
  { text: '쇼핑', value: '38' },
  { text: '음식점', value: '39' }
]);


onMounted(() => {
  getSido();
  addedPlaces.value = "";
});

const memberStore = useMemberStore();
const { userInfo} = storeToRefs(memberStore);

function inviteMember(){
  const memberId = sessionStorage.getItem('memberId');
  socket.send(JSON.stringify({ 
      type: 'invite', 
      memberId: memberId,
      sendedPushMember : sendedPushMember.value,
  }));
}

socket.onmessage = (event) => {
  const eventData = JSON.parse(event.data);
  if (eventData.type === 'invite') {
    console.log(eventData);
    handleSocketMessage(eventData);
  }
};

const getSido = () => {
  http.get('attraction')
    .then(({ data }) => {
      sidoList.value = data.data.map((item) => ({
        value: item.sidoCode, 
        text: item.sidoName
      }));
    });
};


const search = () => {
  http.post('attraction/search', searchItem.value)
    .then(({ data }) => {
      if (data.data.length === 0) {
        alert("검색결과가 없습니다.");
      } else {
        places.value = data.data;
        // 검색 결과를 서버로 전송

        socket.send(JSON.stringify({ 
          type: 'search', 
          searchArea: { 
            sidoCode: searchItem.value.sidoCode, 
            contentTypeId: searchItem.value.contentTypeId, 
            title: searchItem.value.title 
          },
          contents: data.data
        }));
      }
    });
};

function handlePlanSubmission(planData) {
  const formData = new FormData();
  for (const key in planData) {
    formData.append(key, planData[key]);
  }

  http.post('/plan', formData)
    .then(response => {
      console.log('계획 등록 성공', response);
    })
    .catch(error => {
      console.error('계획 등록 오류', error);
    });
}

const selectSido = (option) => {
  searchItem.value.sidoCode = option;
};

const selectType = (option) => {
  searchItem.value.contentTypeId = option;
};

const goToPlannerList = () => {
  router.push({ name: 'plannerlist' });
};
</script>
  
  <style scoped>
  @import "/src/assets/css/tourist_spot.css"
  </style>
  