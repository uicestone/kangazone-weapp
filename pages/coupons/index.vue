<template lang="pug">
  view.nav.padding
    view(v-if="user.codes.length >0")
      text.cuIcon-ticket.text-orange(style="font-size: 50upx")
      text.text-lg(style="margin-left: 10upx") 券码
      view( v-for="(item,index) in user.codes" :key="index")
        view.bg-img.coupon1.flex.align-center.margin-top-sm
          img.img-bg.absolute(:src="bg_1" mode='aspectFit')
          view.s-1.flex.justify-center(style="")
            text(v-if="!item.expiresAt").padding-left.text-gray 长期有效
          view.s-2.flex.justify-center
            text.text-xl {{item.title}}
          view.s-3.flex.justify-center(@click="goBooking")
            view.text-white.text-xl.text-bold
              view 立即
              view 使用
    view.no-coupon(v-else)
      img.no-coupon-bg(:src="no_coupon_bg" mode="widthFix")
      text.text-gray.text-xl.margin-top-sm 暂无可使用的优惠券噢

</template>
<script>
import { sync } from "vuex-pathify";
import { fetchUser } from "../../services";

export default {
  async onLoad() {
    uni.showLoading();
    await fetchUser();
    uni.hideLoading();
  },
  data() {
    return {
      bg_1: "/static/coupon_bg_1.png",
      no_coupon_bg: "/static/no_coupon_bg.png"
    };
  },
  computed: {
    user: sync("auth/user")
  },
  methods: {
    goBooking() {
      uni.navigateTo({ url: "/pages/booking/index" });
    }
  },
  mounted() {}
};
</script>
<style lang="stylus" scoped>
.coupon1
  height 200upx
  background-size contain
  .s-1
    width 200upx
  .s-2
    width 500upx
  .s-3
    width 200upx
  .img-bg
    z-index -100
    width 700upx
    height 200upx
.no-coupon
  display flex
  flex-direction column
  justify-items center
  align-items center
  align-content center
  padding-top 300upx
  .no-coupon-bg
    width 200px
</style>
            