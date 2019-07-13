<template lang="pug">
  view.page.padding.flex.flex-direction
    view
      view.cu-row.shadow.bg-black.member-card.flex.padding
        view.cu-avatar.round.lg(v-if="user.avatarUrl" :style="[{ backgroundImage:'url(' + user.avatarUrl + ')' }]")
        view.margin-left(style="margin-top: 10upx")
          view.text-grey.text-xl {{user.name}}
          view.text-grey VIP卡 {{user.cardType}}
          view.text-grey 余额 {{user.credit}}
      view.cu-list.grid.col-3.margin-top
        view.cu-item.light(:class="[item.price == selectedAmount ? 'bg-orange':'']" v-for="(item,index) in configs.depositLevels" :key="index" @click="selectAmount(item)")
          view.cuIcon-recharge.text-orange
            text.text-sm 送 {{item.cardType}}
          text ￥{{item.price}}
      view.cu-list.grid.col-3.margin-top
        view.cu-item.light(:class="[index == selectedCardType ? 'bg-orange':'']" v-for="(item,index) in configs.cardTypes" :key="index" @click="selectCardType({item,index})")
          view.cuIcon-recharge.text-orange
            text.text-sm {{index}}
          text ￥{{item.netPrice}}
    view.flex-sub.flex.align-end
      button.cu-btn.block.bg-red.margin-tb-sm.lg.flex-sub(@click="handleUserDeposit" v-if="selectedAmount") 立即充值
      button.cu-btn.block.bg-red.margin-tb-sm.lg.flex-sub(@click="handleMembership" v-if="selectedCardType") 立即开通

</template>

<script>
import { sync } from "vuex-pathify";
import * as api from "../../common/vmeitime-http/index";
import { handlePayment, fetchUser } from "../../services";

export default {
  data() {
    return {
      selectedAmount: null,
      selectedCardType: null
    };
  },
  computed: {
    user: sync("auth/user"),
    configs: sync("configs")
  },
  async mounted() {
    await fetchUser();
  },
  methods: {
    selectAmount(item) {
      this.selectedCardType = null;
      this.selectedAmount = item.price;
    },
    selectCardType({ item, index }) {
      this.selectedAmount = null;
      this.selectedCardType = index;
    },
    async handleUserDeposit() {
      const res = await api.userDeposit({ depositLevel: this.selectedAmount });
      const payArgs = res.data.payArgs;
      const result = await handlePayment(payArgs);
      await fetchUser();
      console.log(res, result);
    },
    async handleMembership() {
      const { selectedCardType } = this;
      const res = await api.postUserMembership({ cardType: selectedCardType });
      const payArgs = res.data.payArgs;
      const result = await handlePayment(payArgs);
      await fetchUser();
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
