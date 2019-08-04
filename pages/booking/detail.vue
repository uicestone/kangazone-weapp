<template lang="pug">
  view
    view.response
      img.bg.response(:src="bgUrl" mode="widthFix")
      view.cu-bar.flex.justify-between.align-center.margin-top-lg.padding-lr
        view.margin-left-sm
          view.text-white.text-xl 预约信息
          view
            view.text-white.text-lg {{booking.customer.name}} {{booking.customer.mobile}}
        view.text-white {{ statusLabel[booking.status] }}
      view.cu-card(style="margin-top: 100upx")
        view.cu-item.shadow.padding
          view.solid-bottom.flex.justify-between.align-center
            view.padding
              view.text-black {{booking.store.name}}
              view.text-black {{booking.store.address}}
            button.cu-btn.icon.bg-green(v-if="booking.store.phone" @click="phoneCall(booking.store.phone)")
              text.cuIcon-phone
          view.flex.justify-between.padding
            text.text-black 备注
            text.text-black {{booking.remarks || ''}}
      view.cu-card(v-if="!['CANCELED', 'PENDING'].includes(booking.status)")
        view.cu-item.shadow.padding.margin-top-none
          view.solid-bottom.flex.justify-between.padding
            text.text-black 付款
            text.text-black 已支付 {{booking.price}}元
          view.solid-bottom.flex.justify-between.padding
            text.text-black 支付方式
            view.text-black
              text.cuIcon-check.margin-right-xs
              text 微信支付
          view.solid-bottom.flex.justify-between.padding
            text.text-black 项目
            text.text-black {{bookingTypeNames[booking.type]}}
          view.solid-bottom.flex.justify-between.padding
            text.text-black 日期
            text.text-black {{booking.date}}
          view.solid-bottom.flex.justify-between.padding
            text.text-black 时间
            text.text-black {{booking.checkInAt}} / {{booking.hours ? booking.hours+'小时' : '体验'}}
          view.solid-bottom.flex.justify-between.padding
            text.text-black 人数
            text.text-black {{booking.membersCount}}
          view.flex.justify-between.padding
            text.text-black 蹦床袜
            text.text-black {{booking.socksCount}}
      //- view.cu-card
      //-   view.cu-item.shadow.padding.margin-top-none
      //-     view.flex.justify-between.padding
      //-       text.text-black 关于违约、改约
</template>
<script>
import { moment } from "../../utils";
import { getBooking } from "../../common/vmeitime-http";
import { config } from "../../config";

export default {
  async onLoad(data) {
    const { id } = data;
    const res = await getBooking({ id });
    this.booking = res.data;
  },
  data() {
    return {
      bgUrl: "/static/booking_detail_bg.png",
      statusLabel: config.statusLabel,
      booking: {
        customer: {
          name: "",
          mobile: ""
        },
        store: {
          name: "",
          address: "",
          phone: ""
        },
        remarks: "",
        id: 0,
        date: ""
      },
      bookingTypeNames: {
        play: "计时自由探险",
        party: "派对和聚会"
      }
    };
  },
  methods: {
    phoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber });
    }
  }
};
</script>
<style>
.margin-top-none {
  margin-top: 0 !important;
}
</style>