<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/memberStore.js";

import { storeToRefs } from "pinia";

export default {
  name: "PlannerChat",
  data() {
    return {
      ws: null,
      isConnected: false,
      chatMessage: "",
      messages: [],
      userIdx: null,
      username: "",
    };
  },
  methods: {
    async toggleConnection() {
      if (!this.isConnected) {
        this.connectWs(); // WebSocket 연결 시작
      } else {
        this.disconnectWs();
      }
    },
    connectWs() {
      const webSocketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
      this.ws = new WebSocket(webSocketUrl);

      this.ws.onopen = () => {
        const memberStore = useMemberStore();
        const { userInfo } = storeToRefs(memberStore);
        this.isConnected = true;
        const messageData = {
          type: "signin",
          userIdx: this.userIdx,
          username: userInfo.value.memberId,
          content: this.chatMessage,
          timestamp: new Date().toISOString(),
          emojiIdx: 0,
          planNum: 0,
          idx: 0,
        };
        this.ws.send(JSON.stringify(messageData));
        this.chatMessage = "";
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data); // JSON 데이터를 JavaScript 객체로 파싱
        this.messages.unshift(message.content); // 메시지 내용만 표시
      };

      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
        this.isConnected = false;
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.disconnectWs();
      };
    },
    send() {
      if (this.chatMessage.trim() !== "") {
        const memberStore = useMemberStore();
        const { userInfo } = storeToRefs(memberStore);
        const messageData = {
          type: "chat",
          userIdx: this.userIdx,
          username: userInfo.value.memberId,
          content: this.chatMessage,
          timestamp: new Date().toISOString(),
          emojiIdx: 0,
          planNum: 0,
          idx: 0,
        };
        this.ws.send(JSON.stringify(messageData));
        this.chatMessage = "";
      }
    },
    disconnectWs() {
      if (this.ws) {
        this.chatMessage = "";
        this.messages = [];
        this.ws.close();
      }
    },
  },
};
</script>

<template>
  <div class="side-bar">
    <div style="margin-top: 40%" id="chat-form-container" class="p-2 d-flex justify-content-around">
      <button @click="toggleConnection">{{ isConnected ? "종료" : "채팅 시작하기" }}</button>
      <div v-if="isConnected">
        <input v-model="chatMessage" @keyup.enter="send" placeholder="메시지를 입력하세요" />
        <div>
          <p v-for="(message, index) in messages" :key="index">{{ message }}</p>
        </div>
        <button @click="send">보내기</button>
      </div>
    </div>
  </div>
</template>

<style>
button {
  width: 100px;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#chat-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#chat-form-container input {
  margin-bottom: 10px;
}

#chat-form-container button {
  margin-top: 10px;
}

#chat-form-container div {
  width: 100%;
  overflow-y: auto;
  margin-bottom: 10px;
}

#chat-form-container p {
  margin: 5px 0;
}
</style>
