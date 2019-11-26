<template lang="pug">
  view.booking-index-page
    img.bg-bottom.response(:src="bgUrl" mode="widthFix")
    view.page.padding
      view.cu-row.bg-white.radius
        view.cu-item.shadow.padding
          view.flex.justify-between
            view.margin-left-sm
              view.text-lg.margin-top-xs {{currentStore.name}}
              view.text-gray.text-sm.padding-bottom-xs
                text.icon-shop
                text 营业中
            //- navigator(url="/pages/store/list").margin-top
            //-   text 切换门店
            //-   text.icon-right
          view.solid-top.margin-top-sm.padding-bottom-sm
          view.flex.align-center.justify-between
            view.margin-left-sm
              view.text-black.text-md {{currentStore.address}}
              //- view.text-gray.text-sm 距您{{currentStore.distance}} km
            button.cu-btn.icon.bg-green(v-if="currentStore.phone" @click="phoneCall(currentStore.phone)")
              text.cuIcon-phone
      
      view.cu-row.bg-white.nav.text-center.flex.radius.margin-tb
        view.cu-item.flex-sub.text-lg(:class="[form.bookingType == item.value? 'bg-purple': '' ]" v-for="(item,index) in bookingTypes" :key="index" @click="selectBookingType(item)") 
          text(:class="[item.icon]")
          text {{" "+item.label}}

      view.cu-row.margin-tb.radius
        form.cu-item.shadow
          view.cu-form-group(@click="showCalendar = true")
            view.title 日期
            view.text-right {{form.bookingDate}}
          view.cu-form-group
            view.title 人数
            input.text-right(v-model="form.membersCount" placeholder="1" type="number")
          view.cu-form-group
            view.title 袜子数
            input.text-right(v-model="form.socksCount" placeholder="1"  type="number")
      EiCalendar(:visible.sync="showCalendar" :disabledDate="disabledDate" :custom-date="customDate" format="YYYY-MM-DD" v-model="form.bookingDate" @date-change="getAvailabilityDate")

      view(v-if="form.bookingType == 'play'")
        view.cu-row.bg-white.nav.text-center.flex.radius
          view.cu-item.flex-sub.text-lg(:class="[item.label === form.bookingSlot ? 'bg-purple' : '', item.isValid ? '' : 'text-grey']" v-for="item in bookingSlots" :key="item.label" @click="selectBookingSlot(item)") {{item.label}}
        view.cu-row.bg-white.nav.text-center.flex.radius
          view.cu-item.flex-sub.text-lg(:class="[form.bookingHours == item? 'bg-purple': '' ]" v-for="(item,index) in bookingHours" :key="index" @click="selectBookingHour(item)") {{item == 0 ? '畅玩':(item+'小时') }}
      view(v-if="form.bookingType == 'party'")
        view.cu-form-group(:class="[form.bookingHours? '':'disabled']")
          view.title 开始时间
          picker(:value="form.bookingCheckinTime" :range="_availableHours" @change="updateBookingCheckinTime" :disabled="!form.bookingHours")
            view.picker {{form.bookingCheckinTime}}
        view.cu-row.bg-white.nav.text-center.flex.radius
          view.cu-item.flex-sub.text-lg(:class="[form.bookingHours == item? 'bg-purple': '' ]" v-for="(item,index) in bookingHours" :key="index" @click="selectBookingHour(item)") {{item}}小时

      view.margin-top   
      view.cu-form-group(v-if="availableCodes.length >0")
        view.title 优惠券
        picker(disabled :value="form.bookingCode.title" range-key="title" :range="availableCodes" @change="setBookingCode")
          view.picker {{form.bookingCode.title || '不使用'}}
      //- view.cu-form-group(v-if="price > 0")
      //-   view.title 使用余额
      //-   switch.siwtch-user-creadit(@change="swtichUseCredit"  :checked="form.useCredit?true:false")

      view.margin-bottom(style="margin-bottom: 200upx")

    view.cu-bar.bg-white.tabbar.border.shop.payment-container(v-if="user.mobile" )
      view.flex.justify-start.align-end.text-gray(style="flex:3;padding-left:20upx;font-size:25upx")
        //- view(@tap="handlePolicy")
        //-   view 确认预约即代表您
        //-   view 同意我们的
        //-     text.text-red “预约政策”
      view.margin-right.text-orange(style="font-size:50upx;font-weight:bold") ￥{{price}}
      button.bg-orange.submit.booking-button(@click="handleBooking" :disabled="!booking_avaliable") 确认付款
    button.cu-btn.lg.block.bg-green.payment-container(v-if="!user.mobile" open-type='getPhoneNumber' @getphonenumber="getPhoneNumber" style="border-radius: 0") 绑定手机号

</template>


<script>
import { sync } from "vuex-pathify";
import EiCalendar from "../../components/ei-calendar/ei-calendar.vue";
import moment from "moment";
import _ from "lodash";
import { createBooking, getAvailabilityBooking, getBookingPrice, updateMobile } from "../../common/vmeitime-http";
import { handlePayment } from "../../services";
import { config } from "../../config";

export default {
  components: {
    EiCalendar
  },
  data() {
    return {
      bgUrl: "/static/bg_1.png",
      dates: {
        full: [],
        peak: []
      },
      hours: {
        full: []
      },
      showCalendar: false,
      bookingTypes: [
        { value: "play", label: "计时", icon: ".cuIcon-remind" },
        { value: "party", label: "派对", icon: ".cuIcon-discoverfill" },
        { value: "group", label: "团建", icon: ".cuIcon-activityfill" }
      ],
      bookingSlots: [{ label: "上午", until: "12:00:00" }, { label: "下午", until: "17:00:00" }, { label: "晚上", until: "20:00:00" }],
      bookingHours: [1, 2, 0],
      avaliableHours: config.avaliableHours,
      price: 0,
      loadingPrice: false,
      form: {
        bookingCode: {
          id: null,
          title: null,
          hours: null
        },
        useCredit: true,
        bookingType: "play",
        bookingSlot: null,
        bookingHours: 1,
        bookingDate: moment().format("YYYY-MM-DD"),
        bookingCheckinTime: null,
        membersCount: 1,
        socksCount: 1
      }
    };
  },
  computed: {
    config: sync("configs"),
    auth: sync("auth"),
    user: sync("auth/user"),
    currentStore: sync("store/currentStore"),
    booking_avaliable() {
      const { bookingType, bookingSlot, bookingHours, bookingDate, bookingCheckinTime, membersCount, socksCount } = this.form;
      if (bookingType == "play") {
        return !_.some({ bookingType, bookingSlot, bookingDate, bookingHours, membersCount, socksCount }, _.isNil);
      } else {
        return !_.some({ bookingType, bookingCheckinTime, bookingDate, bookingHours, membersCount, socksCount }, _.isNil);
      }
    },
    _availableHours() {
      if (this.hours.full.includes(this.form.bookingHours)) {
        this.form.bookingHours = null;
      }
      return _.xor(this.avaliableHours, this.hours.full);
    },
    availableCodes() {
      return this.user.codes.filter(i => i.type == this.form.bookingType && !i.used);
    },
    customDate() {
      return this.dates.peak.map(i => ({
        cellClass: "custom-cell",
        date: i,
        top: [
          {
            class: "custom-cell-top-1",
            text: "热"
          }
        ]
      }));
    }
  },
  async mounted() {
    await this.getAvailabilityDate();
    this.markValidSlots();
  },
  watch: {
    "form.bookingHours"(a, b) {
      this.getAvailabilityHour();
    },
    "form.bookingDate"(a, b) {
      this.markValidSlots();
    },
    form: {
      async handler() {
        if (this.loadingPrice) return;
        this.loadingPrice = true;
        const { bookingType, bookingSlot, bookingDate, bookingCheckinTime, bookingHours, membersCount, socksCount, bookingCode, useCredit } = this.form;
        const res = await getBookingPrice({
          store: this.currentStore.id,
          type: bookingType,
          code: bookingCode.id,
          date: bookingDate,
          hours: bookingHours,
          useCredit,
          checkInAt: bookingType == "play" ? bookingSlot : bookingCheckinTime,
          membersCount,
          socksCount
        });
        this.price = res.data.price;
        this.loadingPrice = false;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async getPhoneNumber(res) {
      const { iv, encryptedData } = res.detail;
      const {
        session_key,
        user: { openid }
      } = this.auth;
      uni.showLoading();

      const response = await updateMobile({ iv, encryptedData, session_key, openid });
      this.user = response.data;
      uni.hideLoading();
    },
    swtichUseCredit(e) {
      this.form.useCredit = e.detail.value;
      console.log(this.form.useCredit);
    },
    disabledDate(date) {
      if (
        moment(date)
          .endOf("day")
          .toDate() < new Date()
      ) {
        return true;
      }
      date = moment(date).format("YYYY-MM-DD");
      return this.dates.full.includes(date);
    },
    async getAvailabilityHour() {
      const { bookingDate: date, bookingHours: hours, bookingType: type } = this.form;
      if (type !== "party") return;

      const res = await getAvailabilityBooking({ type, date, hours });
      this.hours = res.data;
    },
    async getAvailabilityDate(date) {
      const month = moment(date).format("YYYY-MM");

      const {
        form: { bookingType }
      } = this;
      const res = await getAvailabilityBooking({ type: bookingType, month });
      this.dates = res.data;
    },
    selectBookingType(item) {
      if (["group", "party"].includes(item.value)) {
        return uni.showModal({
          title: "敬请期待",
          showCancel: false,
          icon: "none"
        });
      }
      this.form.bookingType = item.value;
    },
    bookingSlotIsValid(slot) {
      const isValid = new Date() < moment(this.form.bookingDate + " " + slot.until).toDate();
      console.log(this.form.bookingDate + " " + slot.until, isValid);
      return isValid;
    },
    markValidSlots() {
      this.form.bookingSlot = null;
      this.bookingSlots = this.bookingSlots.map(slot => {
        if (this.bookingSlotIsValid(slot)) {
          slot.isValid = true;
          if (!this.form.bookingSlot) {
            this.form.bookingSlot = slot.label;
          }
        } else {
          delete slot.isValid;
        }
        return slot;
      });
    },
    selectBookingSlot(slot) {
      if (!this.bookingSlotIsValid(slot)) {
        return false;
      }
      this.form.bookingSlot = slot.label;
    },
    slotItemClass(slot) {
      // const classObject = {
      //   "bg-purple": slot.label === this.form.bookingSlot,
      //   "text-grey": !this.bookingSlotIsValid(slot)
      // };
      // console.log(classObject);
      // return classObject;
      const classArray = [slot.label === this.form.bookingSlot ? "bg-purple" : "", this.bookingSlotIsValid(slot) ? "" : "text-grey"];
      console.log(classArray);
      return classArray;
    },
    selectBookingHour(item) {
      this.form.bookingHours = item;
    },
    updateBookingCheckinTime(e) {
      this.form.bookingCheckinTime = this._availableHours[e.detail.value];
    },
    setBookingCode(e) {
      const code = this.availableCodes[e.detail.value];
      this.form.bookingCode = code;
    },
    async handleBooking() {
      const { bookingType, bookingSlot, bookingDate, bookingCheckinTime, bookingHours, membersCount, socksCount, bookingCode, useCredit } = this.form;
      uni.showLoading();
      const res = await createBooking({
        store: this.currentStore.id,
        type: bookingType,
        code: bookingCode.id,
        date: bookingDate,
        hours: bookingHours,
        useCredit,
        checkInAt: bookingType == "play" ? bookingSlot : bookingCheckinTime,
        membersCount,
        socksCount
      });
      const booking = res.data;
      const { payments } = booking;

      for (const payment of payments) {
        if (payment.payArgs) {
          await handlePayment(payment.payArgs);
        }
      }

      uni.hideLoading();
      setTimeout(() => {
        uni.redirectTo({
          url: `/pages/booking/detail?id=${booking.id}`
        });
      }, 1000);
    },
    phoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber });
    }
  }
};
</script>

<style lang="stylus">
.booking-index-page
  .disabled
    view
      opacity 0.5
  .payment-container
    width 100vw
    position fixed
    bottom 0
  .booking-button
    border-radius 0
  .custom-cell
    color red
  .custom-cell-top-1
    color red
  .siwtch-user-creadit
    &::after
      content ''
    &::before
      content ''
</style>
