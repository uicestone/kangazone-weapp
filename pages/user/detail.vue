<template lang="pug">
  view
    view
      img.bg.response(:src="bgUrl" mode="widthFix")
      view.flex.justify-center(style="margin-top: 88upx")
        view.cu-avatar.round.avatar(:style="[{ backgroundImage:'url(' + form.avatarUrl + ')' }]")
      view.padding.radius(style="margin-top: 100upx")
        view.cu-form-group.no-bg
          view.title 姓名
          text.text-bold.text-right {{ user.name}}
        view.cu-form-group.no-bg
          view.title 性別
          view.text-bold.text-right {{ form.gender }}
        view.cu-form-group.no-bg
          view.title 手机号
          text.text-bold.text-right(v-if="user.mobile") {{user.mobile}}
          button.text-right.cu-btn.bg-blue(v-if="!user.mobile" open-type='getPhoneNumber' @getphonenumber="getPhoneNumber") 获取手机号
        //- button.cu-btn.block.bg-blue.margin-xl.lg(:disabled="loading" @click="updateUserProfile")
        //-   text.icon-loading2.iconfont-spin(v-if="loading")
        //-   text 更新
        
</template>

<script>
import { sync, get } from "vuex-pathify";
import { wechatDecrypt, updateUser, updateMobile } from "../../common/vmeitime-http";

export default {
  data() {
    return {
      bgUrl: "/static/user_profile_bg.png",
      form: {
        gender: null,
        birthday: null,
        avatarUrl: null
      },
      providerList: [],
      hasProvider: false
    };
  },
  computed: {
    user: sync("auth/user"),
    auth: sync("auth")
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
      uni.redirectTo({
        url: "/pages/index/index"
      });
    },
    async updateUserProfile({ mobile }) {
      const userId = this.user.id;
      const req = await updateUser({ userId, data: { mobile } });
      if (req) {
        uni.redirectTo({
          url: "/pages/index/index"
        });
      }
    },
    switchgender(e) {
      this.form.gender = e.detail.value;
    }
  },
  onReady() {
    this.form = this.user;
  }
};
</script>

<style lang="stylus" scoped>
.page
  height 100vh
  widows 100vw
.avatar
  width 205upx
  height 205upx
</style>
