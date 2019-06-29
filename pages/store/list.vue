<template lang="pug">
  view
    view
      view.cu-list.menu.sm-border.card-menu.margin-top
        view.cu-item(v-for="(item,index) in nearStores" :key="index" @click="selectStore(item)")
          view.padding
            view {{item.name}}
            view {{item.address}}
          view.text-orange(v-if="item.distance") {{item.distance}}km    
</template>

<script>
import { sync } from "vuex-pathify";
import { get_store } from "../../services";

export default {
  data() {
    return {};
  },
  computed: {
    nearStores: sync("store/nearStores"),
    currentStore: sync("store/currentStore")
  },
  methods: {
    async selectStore(item) {
      uni.setStorage({
        key: "storeId",
        data: item.id
      });
      this.currentStore = { ...this.currentStore, ...item };
      uni.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.cu-item.disabled
  opacity 0.45
</style>