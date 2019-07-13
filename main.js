import Vue from "vue";
import App from "./App";
import store from "./store";

import bookingCard from "./components/bookingCard.vue";

Vue.config.productionTip = false;

Vue.component("booking-card", bookingCard);
App.mpType = "app";
global.store = store; // for debug

const app = new Vue({
  store,
  ...App
});
app.$mount();
