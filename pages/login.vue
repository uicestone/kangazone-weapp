<template lang="pug">
  view.cu-modal(:class="[auth.showLogin ? 'show':'']")
    view.cu-dialog.no-bg
      view.cu-bar
        button.flex-sub(type='primary', open-type='getUserInfo', @getuserinfo='wechatLogin', withcredentials='true') 微信登录
 
</template>

<script>
import { wechatLogin } from "../services";
import { sync } from "vuex-pathify";

export default {
  computed: {
    currentTab: sync("currentTab"),
    auth: sync("auth")
  },
  methods: {
    async wechatLogin() {
      try {
        const res = await wechatLogin();
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="stylus">
.no-bg
  background transparent
</style>
