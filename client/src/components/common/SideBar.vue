<template>
    <div class="side-bar-wrapper">
      <VueResizable
          class="resizable-side-bar"
          :width="400"
          :max-width="Infinity"
          :active="['r']"
          v-if="isVisibleSideBar"
      >
        <div class="side-bar">
            <PlannerChat/>
        </div>
      </VueResizable>
      <BButton
          class="side-bar-active-btn"
          size="sm"
          @click="showSideBar"
      >
        {{ isVisibleSideBar ? '닫힘' : '열림' }}
      </BButton>
    </div>
  </template>
  
  <script>
  import VueResizable from "vue-resizable"
  import PlannerChat from "@/components/plan/PlannerChat.vue";
  export default {
    name: 'SideBar',
    components: {
      VueResizable, PlannerChat
    },
    data() {
      return {
        isVisibleSideBar: true
      }
    },
    methods: {
      showSideBar() {
        this.isVisibleSideBar = !this.isVisibleSideBar;
      }
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .side-bar-wrapper {
    display: flex;
    position: absolute; /* 부모 컨테이너를 절대 위치로 설정 */
    top: 0; /* 화면의 맨 위로 설정 */
    left: 0; /* 화면의 왼쪽에 고정 */
    bottom: 0;
    > .resizable-side-bar {
      > .side-bar {
        background-color: rgb(224 253 255 / 50%);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  
    > .side-bar-active-btn {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #b8b0b0;
      padding: 0;
      border: none;
      border-radius: unset;
      color: #fff;
      opacity: 0.5;
    }
  }

  
  </style>