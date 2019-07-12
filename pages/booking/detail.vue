<template lang="pug">
  view
    view.response.bg-grey(style="position: absolute; top: 0;height: 380upx;z-index:-1")
      view.cu-bar.bg-grey.flex.justify-between.align-center.margin-top.padding-lr
        view.flex.align-center
          view.margin-left-sm
            view.text-white.text-md.margin-top-xs 确认预约人信息
            text.text-white.text-xl {{booking.customer.name}} {{booking.customer.mobile}}
      view.cu-card
        view.cu-item.shadow.padding
          view.solid-bottom.flex.justify-between.align-center
            view.padding
              view.text-black {{booking.store.name}}
              view.text-black {{booking.store.address}}
            button.cu-btn.icon.bg-green(@click="phoneCall(booking.store.phone)")
              text.icon-phone
          view.flex.justify-between.padding
            text.text-black 备注
            text.text-black {{booking.remarks || ''}}
      view.cu-card(v-if="booking.paid")
        view.cu-item.shadow.padding.margin-top-none
          view.solid-bottom.flex.justify-between.padding
            text.text-black 预约金
            text.text-black 已支付 5元
          view.flex.justify-between.padding
            text.text-black 支付方式
            view.text-black.text.bold
              text.icon-check.margin-right-xs
              text 微信支付
      view.cu-card
        view.cu-item.shadow.padding.margin-top-none
          view.flex.justify-between.padding
            text.text-black 关于违约、改约
</template>
<script>
import { moment } from "../../utils";
import { getBooking } from "../../common/vmeitime-http";

export default {
  async onLoad(data) {
    const { id } = data;
    const res = await getBooking({ id });
    this.booking = res.data;
  },
  data() {
    return {
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