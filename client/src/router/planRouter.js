import PlannerView from "@/views/PlannerView.vue";
import onlyAuthUser from "@/assets/js/onlyAuthUser.js";

export default [
  {
    path: "/plan",
    name: "plan",
    component: PlannerView,
    redirect: { name: "plannerRegister" },
    children: [
      {
        path: "regist",
        name: "plannerRegister",
        component: () => import("@/components/plan/PlannerRegister.vue"),
        beforeEnter: onlyAuthUser,
      },
      {
        path: "list",
        name: "plannerlist",
        component: () => import("@/components/plan/PlannerList.vue"),
        beforeEnter: onlyAuthUser,
      },
      // {
      //   path:"info",
      //   name:"info",
      //   component:()=>import(""),
      // },
      // {
      //   path:"memo",
      //   name:"memo",
      //   component:()=>import(""),
      // },
    ],
  },
];
