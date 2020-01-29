import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./util/store";
import twemoji from "twemoji";

Vue.config.productionTip = false;

new Vue({
  router,
  data: {
    privateState: {},
    sharedState: store,
  },
  render: (h) => h(App),
}).$mount("#app");

Vue.directive('emoji', {
  inserted (el) {
    el.innerHTML = twemoji.parse(el.innerHTML)
  }
})
