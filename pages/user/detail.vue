<template lang="pug">
  view
    scroll-view.page(:scroll-y="true")
      view.flex.justify-center.margin-top-xl
        view.cu-avatar.round.xl
      view.margin
        view.cu-form-group.no-bg
          view.title 姓名
          text.text-bold.text-right {{ user.name}}
				
        view.cu-form-group.no-bg
          view.title 性別
          view.text-bold.text-right {{ form.sex }}

        view.cu-form-group.no-bg
          view.title 手机号
          text.text-bold.text-right(v-if="user.customer.mobile") {{user.customer.mobile}}
          button.text-right.cu-btn.bg-blue(v-if="!user.customer.mobile" open-type='getPhoneNumber' @getphonenumber="getPhoneNumber") 获取手机号
        //- button.cu-btn.block.bg-blue.margin-xl.lg(:disabled="loading" @click="updateUserProfile")
        //-   text.icon-loading2.iconfont-spin(v-if="loading")
        //-   text 更新
        
</template>

<script>
import { sync, get } from "vuex-pathify";

export default {
  data() {
    return {
      form: {
        sex: null,
        birthday: null,
        avatar: null
      },
      sex: {
        male: {
          label: "男",
          value: "男"
        },
        female: {
          label: "女",
          value: "女"
        }
      },
      providerList: [],
      hasProvider: false
    };
  },
  computed: {
    user: sync("auth/user")
  },
  methods: {
    async getPhoneNumber(res) {
      const { sex, birthday } = this.form;
      const { iv, encryptedData } = res.detail;
      uni.showLoading();

      // const user = await update_mobile({ iv, encryptedData });
      this.user = user;
      await this.updateUserProfile();
      uni.hideLoading();
    },
    async updateUserProfile() {
      if (!this.user.customer.mobile) {
        return uni.showToast({
          icon: "none",
          title: "请先获取手机号"
        });
      }
      const { sex, birthday } = this.form;

      if (data) {
        uni.redirectTo({
          url: "/pages/main/main"
        });
      }
    },
    switchSex(e) {
      this.form.sex = e.detail.value;
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
