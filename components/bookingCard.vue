<template lang="pug">
  view.cu-list.bg-white.margin-sm.padding.card-menu.shadow(@click="goToDetail")
    view.cu-bar.bg-white.flex.justify-between.align-center.margin-bottom-sm
      view.flex.align-center
        view.cu-avatar.radius.bg-white
          //- img.service-icon(:src="serviceIcon(majorServices)")
        view.margin-left-sm
          //- view {{majorServices}}
          //- view.text-grey.text-sm {{minorServices}}
      view.text-right.align-center
        view {{booking.store.name}}
        view.text-grey.text-sm(v-if="booking.status=='BOOKED'") {{booking.date}} 到店

    view.cu-bar.bg-white.flex.justify-between.align-center.padding-top-sm.solid-top
      view.flex.align-center
        //- view.cu-avatar.round.xs.bg-white(:style="[{ backgroundImage:'url(' + parseAvatar({children: booking.child}) + ')' }]")
        //- view.margin-left-sm
          //- text {{booking.child.name}} / {{booking.child.sex}}
      view.align-center.text-right
        //- main status
        view(v-if="booking.status=='IN_QUEUE'") 排队中
        view(v-if="booking.status=='BOOKED'") 待到店服务
        view(v-if="booking.status=='IN_SERVICE'") 服务中
        view(v-if="booking.status=='FINISHED'") 已完成
        view(v-if="booking.status=='CANCELED'") 已取消
        //- more status desc
        view(v-if="booking.assured") 
          view.text-sm.text-grey 已付预约金¥5 预约已确认
          button.cu-btn(@click.stop="cancelBooking" v-if="cancelAble") 取消预约
        //- text.text-sm.text-grey(v-if="booking.status=='BOOKED'") 预约已确认
        view(v-if="booking.status=='PENDING'")
          //- view.text-sm.text-grey.margin-bottom-xs 待支付¥5预约金，到店退
          button.cu-btn.bg-blue(@click.stop="wechatPay" :loading="loading") 确认预约
</template>

<script>
import { getBooking, handlePayment } from "../services";
import moment from "moment";

export default {
  props: ["booking"],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    // majorServices() {
    //   return this.booking.services
    //     .filter(s => s.service.slotsCount > 0)
    //     .map(s => s.service.name).join(" ");
    // },
    // minorServices() {
    //   return this.booking.services
    //     .filter(s => s.service.slotsCount === 0)
    //     .map(s => s.service.name).join(" ");
    // },
    // cancelAble() {
    //   const bookingTime = moment(`${this.booking.date} ${this.booking.slots[0]}`);
    //   const diffHour = moment.duration(bookingTime.diff(moment())).asHours();
    //   return diffHour > 8;
    // }
  },
  methods: {
    async cancelBooking() {
      const { payments } = this.booking;
      const [payment] = payments;
      const { id: paymentId } = payment;
      await refundPayment({ paymentId });
      await getBooking();
    },
    async wechatPay() {
      console.log("发起支付");
      this.loading = true;
      const { payments } = this.booking;

      for (const payment of payments) {
        if (payment.payArgs) {
          await handlePayment(payment.payArgs);
        }
      }

      setTimeout(() => {
        this.loading = false;
        uni.navigateTo({
          url: `/pages/booking/detail?id=${this.booking.id}`
        });
      }, 3000);
    },
    goToDetail() {
      uni.navigateTo({
        url: `/pages/booking/detail?id=${this.booking.id}`
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.service-icon
  height 100%
  width 100%
  object-fit contain
</style>