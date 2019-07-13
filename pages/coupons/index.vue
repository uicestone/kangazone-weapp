<template lang="pug">
  view
    scroll-view.nav.padding
      view
        text.text-lg.text-bold 抵用券
        view.cu-row.bg-white.radius.shadow.padding.margin-top-sm(v-for="(item,index) in user.codes" :key="index") {{item.title}}

</template>
<script>
import { sync } from "vuex-pathify";
import { fetchUser } from "../../services";

export default {
  async onLoad() {
    uni.showLoading();
    await fetchUser();
    uni.hideLoading();
  },
  data() {
    return {};
  },
  computed: {
    user: sync("auth/user")
  },
  methods: {},
  mounted() {}
};
</script>
<style>
</style>
            