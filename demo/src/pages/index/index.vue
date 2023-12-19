<template>
  <view class="p-index">
    <button @click="navigateTo('/pages/index/modal')">全局弹框组件</button>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class index extends Vue {
  navigateTo(url: string) {
    uni.navigateTo({ url });
  }
}
</script>

<style lang="scss" scoped>
.p-index {
  display: flex;
  flex-direction: column;
  row-gap: 30rpx;
  padding: 50rpx;

  button {
    width: 100%;
  }
}
</style>
