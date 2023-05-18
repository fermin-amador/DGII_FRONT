import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import Vue2Filters from "vue2-filters";

Vue.use(Buefy);
Vue.use(Vue2Filters);

Vue.config.productionTip = false;

new Vue({
  mixins: [Vue2Filters.mixin],
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
