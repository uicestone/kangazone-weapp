<template lang="pug">
  view.booking-index-page
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
              view.text-gray.text-sm 距您{{currentStore.distance}} km
            button.cu-btn.icon.bg-green(@click="phoneCall(currentStore.phone)")
              text.cuIcon-phone
      
      view.cu-row.bg-white.nav.text-center.flex.radius.margin-tb
        view.cu-item.flex-sub.text-lg(:class="[form.bookingType == item.value? 'bg-blue': '' ]" v-for="(item,index) in bookingTypes" :key="index" @click="selectBookingType(item)") {{item.label}}

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
          view.cu-item.flex-sub.text-lg(:class="[form.bookingSlot == item? 'bg-blue': '' ]" v-for="(item,index) in bookingSlots" :key="index" @click="selectBookingSlot(item)") {{item}}
        view.cu-row.bg-white.nav.text-center.flex.radius
          view.cu-item.flex-sub.text-lg(:class="[form.bookingHours == item? 'bg-blue': '' ]" v-for="(item,index) in bookingHours" :key="index" @click="selectBookingHour(item)") {{item}}小时
      view(v-if="form.bookingType == 'party'")
        view.cu-form-group(:class="[form.bookingHours? '':'disabled']")
          view.title 开始时间
          picker(:value="form.bookingCheckinTime" :range="_avaliableHours" @change="updateBookingCheckinTime" :disabled="!form.bookingHours")
            view.picker {{form.bookingCheckinTime}}
        view.cu-row.bg-white.nav.text-center.flex.radius
          view.cu-item.flex-sub.text-lg(:class="[form.bookingHours == item? 'bg-blue': '' ]" v-for="(item,index) in bookingHours" :key="index" @click="selectBookingHour(item)") {{item}}小时
      view.cu-form-group.margin-top
        view.title 优惠券
        picker(:value="form.bookingCode.id" range-key="id" :range="availableCodes" @change="setBookingCode")
          view.picker {{form.bookingCode.id}}

    view.cu-bar.bg-white.tabbar.border.shop.payment-container
      view.flex.justify-start.align-end.text-gray(style="flex:3;padding-left:20upx;font-size:25upx")
        //- view(@tap="handlePolicy")
        //-   view 确认预约即代表您
        //-   view 同意我们的
        //-     text.text-red “预约政策”
      view.margin-right-sm 预约金: ￥{{price}}
      button.bg-red.submit.booking-button(@click="handleBooking" :disabled="!booking_avaliable") 确认预约    
</template>


<script>
import { sync } from "vuex-pathify";
import EiCalendar from "../../components/ei-calendar/ei-calendar.vue";
import moment from "moment";
import _ from "lodash";
import { createBooking, getAvailabilityBooking } from "../../common/vmeitime-http";
import { handlePayment } from "../../services";
import { config } from "../../config";

export default {
  components: {
    EiCalendar
  },
  data() {
    return {
      dates: {
        full: [],
        peak: []
      },
      hours: {
        full: []
      },
      showCalendar: false,
      bookingTypes: [{ value: "play", label: "计时" }, { value: "party", label: "派对" }, { value: "group", label: "团建" }],
      bookingSlots: ["上午", "下午", "晚上"],
      bookingHours: [1, 2, 3],
      avaliableHours: config.avaliableHours,
      form: {
        bookingCode: {
          id: null
        },
        bookingType: "play",
        bookingSlot: "下午",
        bookingHours: null,
        bookingDate: moment().format("YYYY-MM-DD"),
        bookingCheckinTime: "10:00",
        membersCount: 1,
        socksCount: 1
      }
    };
  },
  computed: {
    config: sync("configs"),
    user: sync("auth/user"),
    currentStore: sync("store/currentStore"),
    booking_avaliable() {
      return !_.some(this.form, _.isNil);
    },
    _availableHours() {
      return _.xor(this.avaliableHours, this.hours.full);
    },
    availableCodes() {
      return this.user.codes.filter(i => i.type == this.form.bookingType);
    },
    price() {
      const cardType = this.config.cardTypes[this.user.cardType];
      const firstHourPrice = cardType ? cardType.firstHourPrice : this.config.hourPrice;
      return this.config.hourPriceRatio.slice(0, this.form.bookingHours).reduce((price, ratio) => {
        return +(price + firstHourPrice * ratio).toFixed(2);
      }, 0);
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
  },
  watch: {
    "form.bookingHours"(a, b) {
      this.getAvailabilityHour();
    }
  },
  methods: {
    disabledDate(date) {
      date = moment(date).format("YYYY-MM-DD");
      return this.dates.full.includes(date);
    },
    async getAvailabilityHour() {
      const { bookingDate: date, bookingHours: hours, bookingType: type } = this.form;
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
      if (item.value == "group") {
        return uni.showModal({
          title: "团建请联系:xxxxx",
          showCancel: false,
          icon: "none"
        });
      }
      this.form.bookingType = item.value;
    },
    selectBookingSlot(item) {
      this.form.bookingSlot = item;
    },
    selectBookingHour(item) {
      this.form.bookingHours = item;
    },
    updateBookingCheckinTime(e) {
      this.form.bookingCheckinTime = this._avaliableHours[e.detail.value];
    },
    setBookingCode(e) {
      this.form.bookingCode = this.availableCodes[e.detail.value];
    },
    async handleBooking() {
      const { bookingType, bookingSlot, bookingDate, bookingCheckinTime, bookingHours, membersCount, socksCount, bookingCode } = this.form;
      uni.showLoading();
      const res = await createBooking({
        store: this.currentStore.id,
        type: bookingType,
        date: bookingDate,
        hours: bookingHours,
        checkInAt: bookingType == "play" ? bookingSlot : bookingCheckinTime,
        membersCount,
        socksCount
      });
      // const result = await handlePayment(res.data.payArgs);
      const booking = res.data;
      const { payments } = booking;

      payments.forEach(async payment => {
        if (payment.payArgs) {
          await handlePayment(payment.payArgs);
        }
      });

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
</style>
