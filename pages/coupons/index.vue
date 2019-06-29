<template lang="pug">
  view
    scroll-view.nav
      view.bg-white.flex.text-center
        view.cu-item.flex-sub(
          v-for="(item,index) in tabs"
          :class="index==currentTabIndex?'text-blue cur':''"  
          :key='index'
          :data-id='index'
          @tap="tabSelect(index)") {{item.title}}

</template>
<script>
import { sync } from "vuex-pathify";

export default {
  async onLoad() {
    uni.showLoading();
    // const bookings = await get_booking({ customerId: this.user.customer.id });
    // this.bookings = bookings;
    uni.hideLoading();
  },
  data() {
    return {
      tabs: [
        {
          index: 0,
          title: "次卡",
          value: ["PENDING"]
        },
        {
          index: 1,
          title: "抵用券",
          value: ["BOOKED", "IN_QUEUE", "FINISHED"]
        },
        {
          index: 2,
          title: "折扣券",
          value: ["CANCELED"]
        }
      ],
      currentTabIndex: 0
    };
  },
  computed: {
    user: sync("auth/user")
  },
  methods: {
    tabSelect(index) {
      this.currentTabIndex = index;
    }
  },
  mounted() {}
};
</script>
<style>
</style>
            