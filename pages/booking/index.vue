<template lang="pug">
  view
    view.page
      view.cu-card
        view.cu-item.shadow.padding
          view.flex.justify-between
            view.margin-left-sm
              view.text-lg.margin-top-xs {{currentStore.name}}
              view.text-gray.text-sm.padding-bottom-xs
                text.icon-shop
                text 营业中
            navigator(url="/pages/store/list").margin-top
              text 切换门店
              text.icon-right
          view.solid-top.margin-top-sm.padding-bottom-sm
          view.flex.align-center.justify-between
            view.margin-left-sm
              view.text-black.text-md {{currentStore.address}}
              view.text-gray.text-sm 距您{{currentStore.distance}} km
            button.cu-btn.icon.bg-green(@click="phoneCall(currentStore.phone)")
              text.cuIcon-phone
      view.cu-card
        form.cu-item.shadow.padding
          view.cu-form-group
            view.title 人数
            input(placeholder="1").text-right
          view.cu-form-group
            view.title 袜子数
            input(placeholder="1").text-right

    view.cu-bar.bg-white.tabbar.border.shop.payment-container
      view.flex.justify-start.align-end.text-gray(style="flex:5;padding-left:20upx;font-size:25upx")
        view(@tap="handlePolicy")
          view 确认预约即代表您
          view 同意我们的
            text.text-red “预约政策”
      view.margin-right-sm 预约金: ￥5
      button.bg-red.submit.booking-button(@click="handleBooking" :disabled="!booking_avaliable") 确认预约    
</template>


<script>
import { sync } from "vuex-pathify";

export default {
  data() {
    return {
      form: {}
    };
  },
  computed: {
    currentStore: sync("store/currentStore"),
    booking_avaliable() {
      return false;
    }
  },
  methods: {
    handleBooking() {},
    phoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber });
    }
  }
};
</script>

<style lang="stylus" scoped>
.payment-container
  width 100vw
  position fixed
  bottom 0
</style>
