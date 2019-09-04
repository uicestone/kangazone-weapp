<template lang="pug">
  view
    view.nav.bg-white.flex.text-center
      view.cu-item.flex-sub(
        v-for="(item,index) in tabs"
        :class="index==currentTabIndex?'text-blue cur':''"  
        :key='index'
        :data-id='index'
        @tap="tabSelect(index)") {{item.title}}
    booking-card(v-for="(booking, index) in bookingsOfTab[currentTabIndex]" :key="index" :booking="booking")
</template>

<script>
import { sync } from "vuex-pathify";
import { getBookings } from "../../common/vmeitime-http";

export default {
  async onLoad() {
    uni.showLoading();
    const res = await getBookings();
    this.bookings = res.data;
    uni.hideLoading();
  },
  data() {
    return {
      tabs: [
        {
          index: 0,
          title: "待支付",
          value: ["PENDING"]
        },
        {
          index: 1,
          title: "已预约",
          value: ["BOOKED"]
        },
        {
          index: 2,
          title: "已取消",
          value: ["CANCELED"]
        }
      ],
      currentTabIndex: 0
    };
  },
  computed: {
    user: sync("auth/user"),
    bookings: sync("booking/bookings"),
    bookingsOfTab() {
      return this.tabs.map(tab => this.bookings.filter(i => tab.value.includes(i.status)));
    }
  },
  methods: {
    tabSelect(index) {
      this.currentTabIndex = index;
    }
  },
  mounted() {
    if (!this.bookingsOfTab[this.currentTabIndex].length) {
      this.tabSelect(this.currentTabIndex + 1);
    }
  }
};
</script>
<style>
</style>
            