import onlyAuthUser from "@/assets/js/onlyAuthUser.js";

export default [
  {
    path: "/board",
    name: "board",
    component: () => import("@/views/BoardMainView.vue"),

    redirect: { name: "boardlist" },
    children: [
      {
        path: "list",
        name: "boardlist",
        component: () => import("@/components/board/VBoardContainer.vue"),
        beforeEnter: onlyAuthUser,
      },
      {
        path: "detail/:articleNo",
        name: "articledetail",
        component: () => import("@/components/board/VArticleDetail.vue"),
        beforeEnter: onlyAuthUser, 
      },
      {
        path: "modify/:articleNo",
        name: "articlemodify",
        component: () => import("@/components/board/VArticleForm.vue"),
        beforeEnter: onlyAuthUser,
      },
      {
        path: "write",
        name: "articlewrite",
        component: () => import("@/components/board/VArticleForm.vue"),
        beforeEnter: onlyAuthUser, 
      },
    ],
  },
  {
    path: "/qnaboard",
    name: "qnaboard",
    component: () => import("@/views/BoardMainView.vue"),
    redirect: { name: "qnaboardlist" },
    children: [
      {
        path: "list",
        name: "qnaboardlist",
        component: () => import("@/components/board/VBoardContainer.vue"),
        beforeEnter: onlyAuthUser,
      },
      {
        path: "detail/:articleNo",
        name: "qnaarticledetail",
        component: () => import("@/components/board/VArticleDetail.vue"),
        beforeEnter: onlyAuthUser,
      },
      {
        path: "modify/:articleNo",
        name: "qnaarticlemodify",
        component: () => import("@/components/board/VArticleForm.vue"),
        beforeEnter: onlyAuthUser, 
      },
      {
        path: "write",
        name: "qnaarticlewrite",
        component: () => import("@/components/board/VArticleForm.vue"),
        beforeEnter: onlyAuthUser,
      },
    ],
  },
];