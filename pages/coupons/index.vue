<template lang="pug">
  view.nav.padding
    text.cuIcon-ticket.text-orange(style="font-size: 50upx")
    text.text-lg(style="margin-left: 10upx") 抵用券
    view(v-for="(item,index) in user.codes" :key="index")
      view.bg-img.coupon1.flex.align-center.margin-top-sm(:style="{ backgroundImage:'url(' + bg_1 + ')'}")
        view.flex.justify-center(style="width: 200upx;")
          text 
        view.flex.justify-center(style="width: 400upx;")
          text.text-xl {{item.title}}
        view.flex.justify-center(style="width: 200upx;")
          view.text-white.text-xl.text-bold
            view 立即
            view 使用
              

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
      bg_1: "/static/coupon_bg_1.png"
    };
  },
  computed: {
    user: sync("auth/user")
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="stylus" scoped>
.coupon1
  height 200upx
  background-size contain
</style>
            