import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

class ChatService {
  constructor() {
    this.ws = null;
    this.callbacks = {};
  }

  connect() {
    const webSocketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
    this.ws = new WebSocket(webSocketUrl);

    this.ws.onmessage = (event) => {
      const message = event.data;
      this._notifyCallbacks(message);
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message) {
    if (this.ws) {
      this.ws.send(message);
    }
  }

  registerCallback(callback) {
    const id = new Date().getTime();
    this.callbacks[id] = callback;
    return id;
  }

  unregisterCallback(id) {
    delete this.callbacks[id];
  }

  _notifyCallbacks(message) {
    Object.values(this.callbacks).forEach((callback) => callback(message));
  }
}

const router = useRouter();
const chatService = new ChatService();
chatService.connect();

const addedPlaces = reactive([]);
const places = ref([]);

function handleSocketMessage(eventData) {
  
  if (eventData.type === 'path') {
    addedPlaces.value = eventData.contents;
  }
  // else if (eventData.type === 'plan') {
  //   // router.push({ name: 'plannerlist' });
  //   router.value.push({ name: 'plannerlist' });
  // }
  else if (eventData.type === 'search') {
    places.value = eventData.contents;
}
}

const socket = chatService.ws;

export { chatService, socket, handleSocketMessage, addedPlaces, places };
