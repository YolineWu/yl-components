<template>
  <view class="page-index">
    <TestYlModal />
    <button type="prmary" @click="showYlModal">弹出`yl-modal`弹框</button>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import TestYlModal from "@/components/test-yl-modal/test-yl-modal.vue";
import { useYLModalMixin, useYLModal } from "yl-uni-components";
import store from "@/store";

export default Vue.extend({
  mixins: [useYLModalMixin(store)],
  components: { TestYlModal },
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {
    this.showYlModal();
  },
  methods: {
    showYlModal() {
      useYLModal(store).show({
        title: "我是标题",
        content:
          "我是内内内内内内内内内内内内内内内内内内内内内内内内内内内内容",
        desc: "我是描述",
      });
    },
  },
});
</script>
<style lang="scss">
.page-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 30rpx;
  padding: 40rpx 50rpx;
}
</style>
