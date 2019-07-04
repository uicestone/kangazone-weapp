<template lang="pug">
  view
    scroll-view.page(:scroll-y="true")
      view.flex.justify-center.margin-top-xl
        view.cu-avatar.round.xl(v-if="form.avatarUrl" :style="[{ backgroundImage:'url(' + form.avatarUrl + ')' }]")
      view.margin
        view.cu-form-group.no-bg
          view.title 姓名
          text.text-bold.text-right {{ user.name}}
				
        view.cu-form-group.no-bg
          view.title 性別
          view.text-bold.text-right {{ form.gender == "1" ? "男": "女" }}

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
import { wechatDecrypt } from "../../common/vmeitime-http";

export default {
  data() {
    return {
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
      const { session_key } = this.auth;
      uni.showLoading();

      console.log(res);
      console.log(session_key, encryptedData, iv);

      const data = await wechatDecrypt({ iv, encryptedData, session_key });
      console.log(data);
      // this.user = user;
      // await this.updateUserProfile();
      uni.hideLoading();
    },
    async updateUserProfile() {
      if (!this.user.customer.mobile) {
        return uni.showToast({
          icon: "none",
          title: "请先获取手机号"
        });
      }
      const { gender, birthday } = this.form;

      if (data) {
        uni.redirectTo({
          url: "/pages/main/main"
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

<style lang="stylus">
.page
  background white
  height 100vh
  widows 100vw
</style>
