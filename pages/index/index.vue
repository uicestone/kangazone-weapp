<template lang="pug">
  view
    login
    scroll-view.page(:scroll-y="true")
      view.flex.justify-between.padding.align-center(@click="selcectStore")
        view
          view.text-lg.text-blod {{currentStore.name}}
          view.text-sm.text-grey.margin-left-xs(v-if="currentStore.distance") 距离您{{currentStore.distance}} km
        view
          text 切换门店
          text.icon-right
      swiper.screen-swiper(:circular='true' :autoplay='true' interval='5000' duration='500')
        swiper-item(v-for='(item,index) in bannerImageUrls' :key='index')
          img(:src='item.url' mode='aspectFill')
      view.flex.justify-end(@click="goBookingList")
        view.padding-right.padding-top-sm
          text 所有预约
          text.icon-right
      view.cu-list.menu.card-menu.margin-top.shadow
        navigator(url="/pages/booking/index").cu-item
          view.cu-avatar.round.lg.booking-icon
            img(:src="require('../../static/booking.png')")
          view.content.margin-sm
            view.text-md.margin-top-xs 立即预约
            view.text-gray.text-sm 无需电话、立即确认
          view.action
            text.icon-right.text-grey
      view.cu-list.grid.col-3.card-menu.padding.actions-container.shadow.margin-bottom-lg
        view.flex.justify-center.align-center(
          v-for="(item,index) in menus1",
          @click="navigateTo(item.to)",
          :key='index', 
          :class="[index != 0 ? 'solid-left': '']")
          view.text-xl(:class="['cuIcon-' + item.icon,'text-' + item.color]", style="font-size: 50upx")
          view.margin-xs.text-lg {{item.title}}
</template>


<script>
import { sync } from "vuex-pathify";
import { wechatLogin } from "../../services";
import login from "../login";
import { getStores, getConfigs } from "../../common/vmeitime-http";
export default {
  components: {
    login
  },
  data() {
    return {
      menus1: [
        {
          icon: "baby",
          color: "mauve",
          title: "会员卡",
          to: "/pages/membership/index"
        },
        {
          icon: "redpacket",
          color: "red",
          title: "优惠券",
          to: "/pages/coupons/index"
        },
        {
          icon: "profilefill",
          color: "purple",
          title: "个人资料",
          to: "/pages/user/detail"
        }
      ],
      bannerImageUrls: [
        {
          url: "https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg"
        },
        {
          url: "https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg"
        }
      ]
    };
  },
  computed: {
    currentStore: sync("store/currentStore"),
    nearStores: sync("store/nearStores"),
    auth: sync("auth"),
    configs: sync("configs")
  },
  watch: {
    "auth.user"() {
      this.checkLocation();
    }
  },
  async onLoad() {
    this.loadInitData();
    this.checkLogin();
  },
  methods: {
    async loadInitData() {
      const res = await getConfigs();
      this.configs = res.data;
    },
    async checkLogin() {
      try {
        const user = await wechatLogin();
        console.log(user);
      } catch (error) {
        console.error(error);
        this.auth.showLogin = true;
      }
    },
    async checkLocation() {
      console.log("checkLocation");
      uni.getLocation({
        success: async res => {
          const { latitude, longitude } = res;
          const stores = await getStores();
          this.nearStores = stores.data;
          this.currentStore = stores.data[0];
        },
        fail: async err => {
          uni.navigateTo({
            url: "/pages/store/list"
          });
          uni.showModal({
            title: "获取位置失败, 手动选择您最近的门店",
            showCancel: false,
            icon: "none"
          });
        }
      });
    },
    selcectStore() {
      uni.navigateTo({
        url: "/pages/store/list"
      });
    },
    navigateTo(url) {
      uni.navigateTo({
        url
      });
    },
    goLogin() {
      uni.navigateTo({
        url: "/pages/login"
      });
    }
  }
};
</script>

<style lang="stylus">
.page
  height 100vh
  widows 100vw
.banner
  background-size cover
  height 380upx
  z-index -1
.booking-icon
  background none
  img
    height 100%
    width 100%
    object-fit contain
    display block
</style>
