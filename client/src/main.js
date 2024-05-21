import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import App from "./App.vue";
import router from "./router";
import Moveable from "vue-moveable";
import piniaPersistedState from "pinia-plugin-persistedstate";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

const pinia = createPinia();
// pinia.use(piniaPersist);
pinia.use(piniaPersistedState);

app.use(pinia);
app.use(router);
app.use(Moveable);

app.mount("#app");