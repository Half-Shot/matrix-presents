import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../pages/Home.vue";
import store from "../util/store";
import { logoutClient } from "../util/matrix";
Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (!store.isGuest) {
        next();
        return;
      }
      console.log("Not logged in, redirecting to /login");
      next("/login");
      return;
    },
  },
  {
    path: "/login",
    name: "login",
    beforeEnter: (to, from, next) => {
      if (store.isGuest) {
        next();
        return;
      }
      console.log("Already logged in, redirecting to /home");
      next("/");
      return;
    },
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter: async (to, from, next) => {
      console.log("Vaping login credentials");
      await logoutClient();
      next("/login");
    },
  },
  {
    path: "/slides-create",
    name: "slides-create",
    component: () => import("../pages/CreateSlideshow.vue"),
  },
  {
    path: "/slides/:roomId/:eventId?",
    name: "slides",
    props: {
      editor: false,
    },
    component: () => import("../pages/Slides.vue"),
  },
  {
    path: "/editor/:roomId/:eventId?",
    name: "slides-editor",
    props: {
      editor: true,
    },
    component: () => import("../pages/Slides.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
