import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import store from "../util/store";
import { getClient } from "../util/matrix";
Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (store.accessToken) {
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
      if (!store.accessToken) {
        next();
        return;
      }
      console.log("Already logged in, redirecting to /home");
      next("/");
      return;
    },
    component: () => import(/* webpackChunkName: "about" */ "../views/Login.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter: async (to, from, next) => {
      console.log("Vaping login credentials");
      try {
        const client = getClient();
        if (client) {
          client.stopClient();
          await client.logout();
        }
      } catch (ex) {
        console.log("Failed to /logout", ex);
      }
      store.vapeLogin();
      next("/login");
    }
  },
  {
    path: "/slides/:roomId",
    name: "slides",
    component: () => import(/* webpackChunkName: "about" */ "../views/Slides.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
