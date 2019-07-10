<template lang="pug">
  view.page.padding.flex.flex-direction
    view
      view.cu-row.shadow.bg-black.member-card.flex.padding
        view.cu-avatar.round.lg(v-if="user.avatarUrl" :style="[{ backgroundImage:'url(' + user.avatarUrl + ')' }]")
        view.margin-left(style="margin-top: 10upx")
          view.text-grey.text-xl {{user.name}}
          view.text-grey VIP卡
          view.text-grey 余额 {{user.credit}}
      view.cu-list.grid.col-3.margin-top
        view.cu-item.light(:class="[item.price == selectedAmount ? 'bg-orange':'']" v-for="(item,index) in configs.depositLevels" :key="index" @click="selectAmount(item)")
          view.cuIcon-recharge.text-orange
            text.text-sm {{item.cardType}}
          text ￥{{item.price}}
    view.flex-sub.flex.align-end
      button.cu-btn.block.bg-red.margin-tb-sm.lg.flex-sub(@click="handleUserDeposit") 立即充值
</template>

<script>
import { sync } from "vuex-pathify";
import * as api from "../../common/vmeitime-http/index";
import { handlePayment } from "../../services";

export default {
  data() {
    return {
      selectedAmount: null
    };
  },
  computed: {
    user: sync("auth/user"),
    configs: sync("configs")
  },
  methods: {
    selectAmount(item) {
      this.selectedAmount = item.price;
    },
    async handleUserDeposit() {
      const res = await api.userDeposit({ depositLevel: this.selectedAmount });
      const result = await handlePayment(res.data);
      console.log(res, result);
    }
  }
};
</script>


<style lang="stylus" scoped>
.page
  height 100vh
  widows 100vw
.member-card
  height 250upx
  border-radius 10upx
.topup-button
  width 100%
  position fixed
  botton 100upx
  left 0
</style>
