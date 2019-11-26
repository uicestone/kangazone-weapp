<template lang="pug">
  view.page.flex.flex-direction
    img.bg.response(:src="bgUrl" mode="widthFix")
    img.bg-bottom.response(:src="bgUrl1" mode="widthFix")
    view.padding(style="margin-top: 200upx")
      view.shadow.member-card.bg-img.relative
        img.member-card-bg.absolute(:src="cardBgUrl" mode='aspectFill')        
        view.cu-row.flex(style="height: 220upx")
          view.cu-avatar.round.lg(v-if="user.avatarUrl" :style="{ backgroundImage:'url(' + user.avatarUrl + ')'}")
          view.margin-left(style="margin-top: 20upx")
            view(style="color: #a98042;font-size: 55upx") {{user.name || '[未知用户]'}}
            view.text-white(v-if="user.cardType" style="margin-top: 10upx") VIP卡 {{user.cardType}}
        view.cu-row.padding-left-xs.user-credit.flex.justify-between.align-center
          view.flex
            view.text-black(style="verticle-align:center") 余额: {{user.credit || 0}}
              text.text-xs(v-if="user.creditReward") （其中{{user.creditReward}}为赠送余额）
            view.text-black.margin-left-sm(style="verticle-align:center" v-if="user.codes && user.codes.length") 券码: {{user.codes.length}}
          view.text-white.text-xs No. {{cardNo}}
      view.cu-list.grid.col-3.margin-top(style="background: transparent ")
        view.cu-item.light.bg-white(:class="[item.price == selectedAmount ? 'bg-orange':'']" v-for="(item,index) in availableDepositLevels" :key="index" @click="selectAmount(item)" v-if="!item.counterOnly")
          view.cuIcon-recharge.text-orange
          text.margin-bottom(style="font-size:40upx;color:#f08300;font-weight:bold") {{item.depositCredit || item.desc}}
          text.reward-credit-text(v-if="item.rewardCredit") 送{{item.rewardCredit}}
          text {{item.desc}}
          text.text-sm(v-if="item.rewardCodes && item.rewardCodes.length && item.depositCredit") {{item.rewardCodes[0].title}}x{{ item.rewardCodes[0].count }}
    view.flex-sub.flex.align-end.padding
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
      bgUrl: "/static/membership_bg.png",
      bgUrl1: "/static/bg_1.png",
      cardBgUrl: "/static/membership_card_bg.png",
      selectedAmount: null,
      selectedDepositLevel: null,
      selectedCardType: null
    };
  },
  computed: {
    user: sync("auth/user"),
    configs: sync("configs"),
    userCardTypeIndex() {
      if (!this.configs.depositLevels) return -1;
      const index = this.configs.depositLevels.map(level => level.cardType).indexOf(this.user.cardType);
      console.log("user card type index", index);
      return index;
    },
    availableMembershipCardTypes() {
      if (!this.configs.depositLevels) return [];
      return this.configs.depositLevels
        .filter((level, index) => {
          return index > this.userCardTypeIndex;
        })
        .map(level => level.cardType);
    },
    availableDepositLevels() {
      if (!this.configs.depositLevels) return [];
      return this.configs.depositLevels;
      // return this.configs.depositLevels.filter((level, index) => {
      //   return index >= this.userCardTypeIndex;
      // });
    },
    cardNo() {
      return this.user.cardNo || "未领取实体卡";
    }
  },
  async mounted() {
    await fetchUser();
  },
  methods: {
    selectAmount(item) {
      this.selectedCardType = null;
      this.selectedAmount = item.price;
      this.selectedDepositLevel = item.slug;
    },
    selectCardType({ item, index }) {
      this.selectedAmount = null;
      this.selectedCardType = index;
    },
    async handleUserDeposit() {
      const res = await api.userDeposit({ depositLevel: this.selectedDepositLevel });
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
    },
    isAvailableMembershipCardType(type) {
      return this.availableMembershipCardTypes.includes(type);
    }
  }
};
</script>


<style lang="stylus" scoped>
.page
  height 100vh
  widows 100vw
.member-card
  height 350upx
  background-size contain
  border-radius 10upx
  padding 80upx 70upx 0
  .member-card-bg
    left 20upx
    top 0
    z-index -100
    height 350upx
    width 650upx
.topup-button
  width 100%
  position fixed
  botton 100upx
  left 0
.reward-credit-text
  font-size 45upx !important
  color #3b1638 !important
</style>
