import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./util/store";
import "animate.css";

Vue.config.productionTip = false;

new Vue({
  router,
  data: {
    privateState: {},
    sharedState: store,
  },
  render: (h) => h(App),
}).$mount("#app");
