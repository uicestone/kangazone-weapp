<template lang="pug">
  view.page.flex.align-end
    button.margin.flex-sub(type='primary', open-type='getUserInfo', @getuserinfo='wechatLogin', withcredentials='true') 微信登录
 
</template>

<script>
import { wechatLogin } from "../services";

export default {
  methods: {
    async wechatLogin() {
      try {
        const res = await wechatLogin();
        uni.navigateTo({
          url: "/pages/store/list"
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="stylus">
.page
  background white
  height 100vh
  widows 100vw
</style>
