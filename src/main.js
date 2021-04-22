import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueParticles from "vue-particles";
import ElementUI from "element-ui";
import "@/assets/css/base.scss";
import VCharts from "v-charts";
import Echarts from "echarts";
import "echarts-gl";
import './icons'

Vue.use(ElementUI);
Vue.use(VueParticles);
Vue.use(VCharts);

Vue.config.productionTip = false;
Vue.prototype.bus = new Vue();
Vue.prototype.$echarts = Echarts;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
