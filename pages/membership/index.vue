<template lang="pug">
  view
    view
      view.cu-list.grid.col-3.margin
        view.cu-item.light(:class="[item == selectedAmount ? 'bg-orange':'']" v-for="(item,index) in amounts" :key="index" @click="selectAmount(item)")
          view.cuIcon-recharge.text-orange
          text ￥{{item}}
</template>

<script>
export default {
  data() {
    return {
      amounts: ["20", "50", "100", "200", "500", "1000"],
      selectedAmount: null
    };
  },
  methods: {
    selectAmount(amount) {
      this.selectedAmount = amount;
    }
  }
};
</script>

