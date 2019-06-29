<template lang="pug">
  view
    view.page
      view.cu-card
        view.cu-item.shadow.padding
          view.flex.justify-between
            view.margin-left-sm
              view.text-lg.margin-top-xs {{currentStore.name}}
              view.text-gray.text-sm.padding-bottom-xs
                text.icon-shop
                text 营业中
            navigator(url="/pages/store/list").margin-top
              text 切换门店
              text.icon-right
          view.solid-top.margin-top-sm.padding-bottom-sm
          view.flex.align-center.justify-between
            view.margin-left-sm
              view.text-black.text-md {{currentStore.address}}
              view.text-gray.text-sm 距您{{currentStore.distance}} km
            button.cu-btn.icon.bg-green(@click="phoneCall(currentStore.phone)")
              text.cuIcon-phone
</template>


<script>
import { sync } from "vuex-pathify";

export default {
  computed: {
    currentStore: sync("store/currentStore")
  },
  methods: {
    phoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber });
    }
  }
};
</script>
