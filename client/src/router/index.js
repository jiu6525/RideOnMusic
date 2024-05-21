import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import TripView from "@/views/TripView.vue";
import onlyAuthUser from "@/assets/js/onlyAuthUser.js";
import ChatView from "@/views/ChatView.vue";
import memberRouter from "./memberRouter";
import planRouter from "./planRouter";
import boardRouter from "./boardRouter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/trip",
      name: "trip",
      component: TripView,
    },
    ...memberRouter,
    ...boardRouter,
    ...planRouter,
  ],
});

export default router;
